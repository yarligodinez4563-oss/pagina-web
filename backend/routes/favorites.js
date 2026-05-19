const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Obtener favoritos del usuario
router.get('/', authenticateToken, (req, res) => {
  try {
    const favorites = db.prepare(`
      SELECT b.*, f.id as favorite_id
      FROM favorites f
      JOIN books b ON f.book_id = b.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `).all(req.user.id);

    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener favoritos.' });
  }
});

// Agregar a favoritos
router.post('/:bookId', authenticateToken, (req, res) => {
  try {
    const book = db.prepare('SELECT id FROM books WHERE id = ?').get(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado.' });
    }

    const existing = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND book_id = ?')
      .get(req.user.id, req.params.bookId);

    if (existing) {
      return res.status(409).json({ error: 'El libro ya está en favoritos.' });
    }

    db.prepare('INSERT INTO favorites (user_id, book_id) VALUES (?, ?)').run(req.user.id, req.params.bookId);
    res.status(201).json({ message: 'Libro agregado a favoritos.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar a favoritos.' });
  }
});

// Remover de favoritos
router.delete('/:bookId', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM favorites WHERE user_id = ? AND book_id = ?')
      .run(req.user.id, req.params.bookId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Favorito no encontrado.' });
    }

    res.json({ message: 'Libro removido de favoritos.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al remover de favoritos.' });
  }
});

// Verificar si un libro es favorito
router.get('/check/:bookId', authenticateToken, (req, res) => {
  try {
    const favorite = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND book_id = ?')
      .get(req.user.id, req.params.bookId);

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar favorito.' });
  }
});

module.exports = router;
