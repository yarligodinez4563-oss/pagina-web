import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addFavorite, removeFavorite, checkFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://pagina-web-sp9h.onrender.com';

function getFileUrl(filePath) {
  if (!filePath) return null;
  return filePath.startsWith('http') ? filePath : `${API_URL}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
}

function BookCard({ book }) {
  const { showToast } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkFavorite(book.id)
      .then(res => setIsFavorite(res.data.isFavorite))
      .catch(() => {});
  }, [book.id]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isFavorite) {
        await removeFavorite(book.id);
        setIsFavorite(false);
        showToast('Removido de favoritos');
      } else {
        await addFavorite(book.id);
        setIsFavorite(true);
        showToast('Agregado a favoritos');
      }
    } catch {
      showToast('Error al actualizar favoritos', 'error');
    }
  };

  return (
    <Link to={`/book/${book.id}`} className="book-card fade-in">
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
        <div className="book-actions">
          <button
            className={`btn-icon ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
            title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
