const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../config/db');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { sanitizeFilename, validateImage, validateBookFile } = require('../middleware/fileSecurity');

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname === 'file'
      ? path.join(__dirname, '..', 'uploads', 'books')
      : path.join(__dirname, '..', 'uploads', 'covers');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = sanitizeFilename(path.basename(file.originalname, ext));
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${safeName}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') {
      const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
      if (allowed.includes(file.mimetype)) cb(null, true);
      else cb(new Error('Solo se permiten imágenes (JPG, PNG, GIF, WebP, BMP).'));
    } else if (file.fieldname === 'file') {
      const allowedTypes = ['application/pdf', 'application/epub+zip', 'application/zip'];
      if (allowedTypes.includes(file.mimetype)) cb(null, true);
      else cb(new Error('Solo se permiten PDF, EPUB o ZIP.'));
    } else {
      cb(null, true);
    }
  }
});

// Middleware para validar archivos subidos
function validateUploadedFiles(req, res, next) {
  const files = req.files || {};
  const errors = [];

  if (files['image']) {
    for (const file of files['image']) {
      const result = validateImage(file.path, file.mimetype);
      if (!result.valid) {
        fs.unlinkSync(file.path);
        errors.push(`Portada: ${result.error}`);
      }
    }
  }

  if (files['file']) {
    for (const file of files['file']) {
      const result = validateBookFile(file.path, file.mimetype);
      if (!result.valid) {
        fs.unlinkSync(file.path);
        errors.push(`Archivo: ${result.error}`);
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('. ') });
  }

  next();
}

// Obtener todos los libros (con filtros opcionales)
router.get('/', (req, res) => {
  try {
    const { search, category } = req.query;
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ? OR category LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';
    const books = db.prepare(query).all(...params);
    res.json({ books });
  } catch (error) {
    res.status(500).json({ error: `Error al obtener libros: ${error.message}` });
  }
});

// Obtener categorías (DEBE ir antes de /:id)
router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT DISTINCT category FROM books ORDER BY category').all();
    res.json({ categories: categories.map(c => c.category) });
  } catch (error) {
    res.status(500).json({ error: `Error al obtener categorías: ${error.message}` });
  }
});

// Obtener un libro por ID
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado.' });
    }
    res.json({ book });
  } catch (error) {
    res.status(500).json({ error: `Error al obtener el libro: ${error.message}` });
  }
});

// Crear libro (solo admin)
router.post('/',
  authenticateToken,
  isAdmin,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  validateUploadedFiles,
  (req, res) => {
    const { title, author, description, category } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({ error: 'Título, autor y categoría son requeridos.' });
    }

    try {
      const files = req.files || {};
      const imagePath = files['image'] ? `/uploads/covers/${files['image'][0].filename}` : null;
      const filePath = files['file'] ? `/uploads/books/${files['file'][0].filename}` : null;

      const result = db.prepare(
        'INSERT INTO books (title, author, description, category, image, file_path) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(title, author, description || '', category, imagePath, filePath);

      res.status(201).json({
        message: 'Libro creado exitosamente.',
        book: { id: result.lastInsertRowid, title, author, description, category, image: imagePath, file_path: filePath }
      });
    } catch (error) {
      res.status(500).json({ error: `Error al crear libro: ${error.message}` });
    }
  }
);

// Actualizar libro (solo admin)
router.put('/:id',
  authenticateToken,
  isAdmin,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  validateUploadedFiles,
  (req, res) => {
    const { title, author, description, category } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({ error: 'Título, autor y categoría son requeridos.' });
    }

    try {
      const existingBook = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
      if (!existingBook) {
        return res.status(404).json({ error: 'Libro no encontrado.' });
      }

      const files = req.files || {};
      const imagePath = files['image'] ? `/uploads/covers/${files['image'][0].filename}` : existingBook.image;
      const filePath = files['file'] ? `/uploads/books/${files['file'][0].filename}` : existingBook.file_path;

      // Eliminar archivos viejos si se reemplazan
      if (files['image'] && existingBook.image) {
        const oldPath = path.join(__dirname, '..', existingBook.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      if (files['file'] && existingBook.file_path) {
        const oldPath = path.join(__dirname, '..', existingBook.file_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      db.prepare(
        'UPDATE books SET title = ?, author = ?, description = ?, category = ?, image = ?, file_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).run(title, author, description || '', category, imagePath, filePath, req.params.id);

      res.json({
        message: 'Libro actualizado exitosamente.',
        book: { id: parseInt(req.params.id), title, author, description, category, image: imagePath, file_path: filePath }
      });
    } catch (error) {
      res.status(500).json({ error: `Error al actualizar libro: ${error.message}` });
    }
  }
);

// Eliminar libro (solo admin)
router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const existingBook = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    if (!existingBook) {
      return res.status(404).json({ error: 'Libro no encontrado.' });
    }

    // Eliminar archivos del sistema
    if (existingBook.image) {
      const imgPath = path.join(__dirname, '..', existingBook.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    if (existingBook.file_path) {
      const filePath = path.join(__dirname, '..', existingBook.file_path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
    res.json({ message: 'Libro eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: `Error al eliminar libro: ${error.message}` });
  }
});

module.exports = router;
