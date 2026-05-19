import React, { useState, useEffect } from 'react';
import { getBooks, getCategories, createBook, updateBook, deleteBook } from '../services/api';
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
  const { showToast } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    newCategory: '',
    image: null,
    file: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        getBooks(),
        getCategories()
      ]);
      setBooks(booksRes.data.books);
      setCategories(categoriesRes.data.categories);
    } catch {
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingBook(null);
    setFormData({ title: '', author: '', description: '', category: '', newCategory: '', image: null, file: null });
    setImagePreview(null);
    setShowNewCategory(false);
    setModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || '',
      category: book.category,
      newCategory: '',
      image: null,
      file: null
    });
    setImagePreview(book.image ? (book.image.startsWith('/') ? book.image : `/uploads/covers/${book.image}`) : null);
    setShowNewCategory(false);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setShowNewCategory(value === 'new');
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      const finalCategory = showNewCategory ? formData.newCategory : formData.category;
      data.append('title', formData.title);
      data.append('author', formData.author);
      data.append('description', formData.description);
      data.append('category', finalCategory);
      if (formData.image) data.append('image', formData.image);
      if (formData.file) data.append('file', formData.file);

      if (editingBook) {
        await updateBook(editingBook.id, data);
        showToast('Libro actualizado exitosamente');
      } else {
        await createBook(data);
        showToast('Libro creado exitosamente');
      }

      setModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Error al guardar libro', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${title}"?`)) return;

    try {
      await deleteBook(id);
      showToast('Libro eliminado');
      fetchData();
    } catch {
      showToast('Error al eliminar libro', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <main className="main-content">
      <div className="admin-header fade-in">
        <h1>Panel de Administración</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Agregar Libro
        </button>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📚</div>
          <h3>No hay libros aún</h3>
          <p>Agrega tu primer libro usando el botón de arriba.</p>
        </div>
      ) : (
        <div className="admin-table fade-in">
          <table>
            <thead>
              <tr>
                <th>Portada</th>
                <th>Título</th>
                <th>Autor</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    {book.image ? (
                      <img
                        src={book.image.startsWith('/') ? book.image : `/uploads/covers/${book.image}`}
                        alt={book.title}
                        style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <span style={{ fontSize: '1.5rem' }}>📖</span>
                    )}
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <span className="book-category-badge" style={{ position: 'static' }}>
                      {book.category}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(book)}>
                        ✏️ Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.id, book.title)}>
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBook ? 'Editar Libro' : 'Agregar Libro'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Título *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Autor *</label>
                  <input
                    type="text"
                    name="author"
                    className="form-input"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    name="category"
                    className="form-input"
                    value={showNewCategory ? 'new' : formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="new">+ Nueva categoría</option>
                  </select>
                </div>

                {showNewCategory && (
                  <div className="form-group">
                    <label>Nombre de la nueva categoría *</label>
                    <input
                      type="text"
                      name="newCategory"
                      className="form-input"
                      placeholder="Ej: Ciencia Ficción"
                      value={formData.newCategory}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    name="description"
                    className="form-input"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Portada del libro</label>
                  <label className="file-upload">
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                    ) : (
                      <div>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                        <div>Haz clic o arrastra una imagen aquí</div>
                      </div>
                    )}
                  </label>
                </div>

                <div className="form-group">
                  <label>Archivo del libro (PDF, EPUB)</label>
                  <label className="file-upload">
                    <input type="file" accept=".pdf,.epub,.zip" onChange={handleFileChange} />
                    <div>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                      <div>{formData.file ? formData.file.name : 'Haz clic para subir un archivo'}</div>
                    </div>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                  {submitting ? 'Guardando...' : (editingBook ? 'Actualizar Libro' : 'Crear Libro')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminPanel;
