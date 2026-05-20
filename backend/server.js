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
  origin: 'https://pagina-web-khaki-rho.vercel.app',
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

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/favorites', favoriteRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  res.status(500).json({
    error: `Error interno: ${err.message}`
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n📚 Servidor de biblioteca iniciado en puerto ${PORT}`);
  console.log(`🔗 API activa`);
});