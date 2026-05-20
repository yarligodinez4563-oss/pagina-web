import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://pagina-web-sp9h.onrender.com';

function getFileUrl(filePath) {
  if (!filePath) return null;
  return filePath.startsWith('http') ? filePath : `${API_URL}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
}

function Favorites() {
  const { showToast } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await getFavorites();
      setFavorites(res.data.favorites);
    } catch {
      showToast('Error al cargar favoritos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await removeFavorite(bookId);
      setFavorites(favorites.filter(f => f.id !== bookId));
      showToast('Removido de favoritos');
    } catch {
      showToast('Error al remover', 'error');
    }
  };

  return (
    <main className="main-content">
      <div className="hero fade-in">
        <h1>Mis Favoritos</h1>
        <p>Tus libros guardados para leer después.</p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="empty-state">
          <div className="icon">❤️</div>
          <h3>No tienes favoritos aún</h3>
          <p>Explora el catálogo y agrega libros que te interesen.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="books-grid">
          {favorites.map((book) => (
            <div key={book.id} className="book-card fade-in">
              <Link to={`/book/${book.id}`} style={{ display: 'block' }}>
                <div className="book-cover">
                  {book.image ? (
                    <img src={getFileUrl(book.image)} alt={book.title} />
                  ) : (
                    <div className="book-cover-placeholder">📖</div>
                  )}
                  <span className="book-category-badge">{book.category}</span>
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">por {book.author}</p>
                  <p className="book-description">{book.description}</p>
                </div>
              </Link>
              <div className="book-actions" style={{ padding: '0 1.25rem 1.25rem' }}>
                <button
                  className="btn-icon active"
                  onClick={() => handleRemove(book.id)}
                  title="Quitar de favoritos"
                >
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Favorites;
