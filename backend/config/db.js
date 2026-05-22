const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'database', 'library.db');
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Crear tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    image TEXT,
    file_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE(user_id, book_id)
  );
`);

// Crear usuario admin si no existe
const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get(process.env.ADMIN_EMAIL);
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
    'Administrador',
    process.env.ADMIN_EMAIL,
    hashedPassword,
    'admin'
  );
  console.log('✓ Cuenta de administrador creada');
}

module.exports = db;

// Sembrar libros de ejemplo si la BD está vacía
const bookCount = db.prepare('SELECT COUNT(*) as count FROM books').get();
if (bookCount.count === 0) {
  const seedBooks = [
    { title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', description: 'El ingenioso hidalgo don Quijote de la Mancha es la obra cumbre de la literatura española. Narra las aventuras de Alonso Quijano, un hidalgo que pierde la razón por leer demasiados libros de caballerías.', category: 'Clásicos' },
    { title: 'Cien años de soledad', author: 'Gabriel García Márquez', description: 'Obra maestra del realismo mágico que narra la historia de la familia Buendía en Macondo.', category: 'Novela' },
    { title: '1984', author: 'George Orwell', description: 'Una distopía sobre un régimen totalitario donde el Gran Hermano lo vigila todo y la libertad es un sueño del pasado.', category: 'Ciencia ficción' },
    { title: 'El Principito', author: 'Antoine de Saint-Exupéry', description: 'Un piloto perdido en el desierto conoce a un pequeño príncipe que viene de otro planeta. Una historia sobre la amistad, el amor y la vida.', category: 'Literatura infantil' },
    { title: 'Orgullo y Prejuicio', author: 'Jane Austen', description: 'Una de las novelas más famosas de la literatura inglesa, que explora los sentimientos encontrados entre Elizabeth Bennet y el señor Darcy.', category: 'Novela' },
    { title: 'Crimen y Castigo', author: 'Fiódor Dostoyevski', description: 'Un joven estudiante comete un asesinato y debe enfrentar las consecuencias psicológicas de su acto.', category: 'Novela' }
  ];

  const insertBook = db.prepare('INSERT INTO books (title, author, description, category) VALUES (?, ?, ?, ?)');
  const insertMany = db.transaction((books) => {
    for (const b of books) {
      insertBook.run(b.title, b.author, b.description, b.category);
    }
  });
  insertMany(seedBooks);
  console.log(`✓ ${seedBooks.length} libros de ejemplo creados`);
}
