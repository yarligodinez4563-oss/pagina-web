import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pagina-web-sp9h.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getUserProfile = () => api.get('/auth/me');

// Books
export const getBooks = (params) => api.get('/books', { params });
export const getBook = (id) => api.get(`/books/${id}`);
export const getCategories = () => api.get('/books/categories');

export const createBook = (formData) =>
  api.post('/books', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const updateBook = (id, formData) =>
  api.put(`/books/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const deleteBook = (id) => api.delete(`/books/${id}`);

// Favorites
export const getFavorites = () => api.get('/favorites');
export const addFavorite = (bookId) => api.post(`/favorites/${bookId}`);
export const removeFavorite = (bookId) => api.delete(`/favorites/${bookId}`);
export const checkFavorite = (bookId) =>
  api.get(`/favorites/check/${bookId}`);

export default api;