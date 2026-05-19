import React, { useState, useEffect } from 'react';
import { getBooks, getCategories } from '../services/api';
import BookCard from '../components/BookCard';

function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, categoriesRes] = await Promise.all([
          getBooks(),
          getCategories()
        ]);
        setBooks(booksRes.data.books);
        setCategories(categoriesRes.data.categories);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        const res = await getBooks(params);
        setBooks(res.data.books);
      } catch (err) {
        console.error('Error al filtrar:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchFiltered, 300);
    return () => clearTimeout(debounce);
  }, [search, category]);

  return (
    <main className="main-content">
      <section className="hero fade-in">
        <h1>Tu Biblioteca Digital</h1>
        <p>Explora nuestra colección de libros, encuentra tus favoritos y disfruta de la lectura.</p>
      </section>

      <div className="search-container fade-in">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por título, autor o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📚</div>
          <h3>No se encontraron libros</h3>
          <p>Intenta con otra búsqueda o categoría.</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {books.length} libro{books.length !== 1 ? 's' : ''} encontrado{books.length !== 1 ? 's' : ''}
          </p>
          <div className="books-grid">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default Home;
