import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBook, addFavorite, removeFavorite, checkFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const [book, setBook] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, favRes] = await Promise.all([
          getBook(id),
          checkFavorite(id)
        ]);
        setBook(bookRes.data.book);
        setIsFavorite(favRes.data.isFavorite);
      } catch {
        showToast('Error al cargar el libro', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
        showToast('Removido de favoritos');
      } else {
        await addFavorite(id);
        setIsFavorite(true);
        showToast('Agregado a favoritos');
      }
    } catch {
      showToast('Error al actualizar favoritos', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="empty-state">
        <div className="icon">📖</div>
        <h3>Libro no encontrado</h3>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <main className="main-content fade-in">
      <button className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/')}>
        ← Volver
      </button>

      <div className="book-detail">
        <div className="book-detail-header">
          <div className="book-detail-cover">
            {book.image ? (
              <img src={book.image.startsWith('/') ? book.image : `/uploads/covers/${book.image}`} alt={book.title} />
            ) : (
              <div className="book-detail-cover-placeholder">📖</div>
            )}
          </div>
          <div className="book-detail-info">
            <h1>{book.title}</h1>
            <p className="author">por {book.author}</p>
            <span className="category">{book.category}</span>
            <p className="description">{book.description || 'Sin descripción disponible.'}</p>
            <div className="book-detail-actions">
              {book.file_path && (
                <a
                  href={book.file_path.startsWith('/') ? book.file_path : `/uploads/books/${book.file_path}`}
                  className="btn btn-success"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📖 Leer libro
                </a>
              )}
              <button
                className={`btn ${isFavorite ? 'btn-danger' : 'btn-primary'}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? '❤️ En favoritos' : '🤍 Agregar a favoritos'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {book.file_path && (
        <div className="book-detail-body">
          <iframe
            src={book.file_path.startsWith('/') ? book.file_path : `/uploads/books/${book.file_path}`}
            style={{
              width: '100%',
              height: '80vh',
              border: 'none',
              borderRadius: 'var(--radius)',
              background: '#fff'
            }}
            title={book.title}
          />
        </div>
      )}
    </main>
  );
}

export default BookDetail;
