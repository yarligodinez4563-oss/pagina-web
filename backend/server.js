require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Importar rutas
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const favoriteRoutes = require('./routes/favorites');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Crear directorios de uploads si no existen
const uploadsDirs = [
  path.join(__dirname, 'uploads', 'covers'),
  path.join(__dirname, 'uploads', 'books'),
  path.join(__dirname, 'database')
];

uploadsDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/favorites', favoriteRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: `Error interno: ${err.message}` });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n📚 Servidor de biblioteca iniciado en puerto ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`👤 Admin: ${process.env.ADMIN_EMAIL}`);
  console.log(`🔑 Contraseña admin: ${process.env.ADMIN_PASSWORD}\n`);
});
