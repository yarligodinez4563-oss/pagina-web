# 📚 BiblioTech - Biblioteca Digital

Sistema completo de biblioteca digital con autenticación, gestión de libros y favoritos.

## 🚀 Tecnologías

- **Frontend:** React 18 + Vite + React Router
- **Backend:** Node.js + Express
- **Base de datos:** SQLite (better-sqlite3)
- **Autenticación:** JWT + bcrypt
- **Estilos:** CSS moderno con variables y animaciones

## 📋 Requisitos

- **Node.js 18+** ([Descargar aquí](https://nodejs.org/))
- npm (incluido con Node.js)

### Instalar Node.js en Windows

1. Descarga el instalador desde [nodejs.org](https://nodejs.org/)
2. Ejecuta el instalador y sigue los pasos
3. Reinicia tu terminal
4. Verifica la instalación: `node --version` y `npm --version`

## 🔧 Instalación

### 1. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 2. Instalar dependencias del frontend

```bash
cd frontend
npm install
```

### 3. Configurar variables de entorno (opcional)

El archivo `backend/.env` ya viene configurado con valores por defecto. Puedes modificar:

```env
PORT=3001
JWT_SECRET=tu_secreto_aqui
ADMIN_EMAIL=admin@biblioteca.com
ADMIN_PASSWORD=Admin123!
```

## 🚀 Ejecutar en desarrollo

### Opción 1: Ejecutar por separado (recomendado para desarrollo)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

### Opción 2: Build de producción

```bash
# Build frontend
cd frontend
npm run build

# Ejecutar backend en modo producción
cd ../backend
NODE_ENV=production npm start
```

## 👤 Credenciales por defecto

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@biblioteca.com | Admin123! |

## 📁 Estructura del proyecto

```
pagina-web/
├── backend/
│   ├── config/
│   │   └── db.js              # Configuración de SQLite y tablas
│   ├── middleware/
│   │   └── auth.js            # Middleware de autenticación JWT
│   ├── routes/
│   │   ├── auth.js            # Rutas de login/registro
│   │   ├── books.js           # CRUD de libros + uploads
│   │   └── favorites.js       # Gestión de favoritos
│   ├── uploads/               # Archivos subidos
│   ├── database/              # Base de datos SQLite
│   ├── .env                   # Variables de entorno
│   ├── server.js              # Entry point del backend
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Contexto de autenticación
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Página de login
│   │   │   ├── Register.jsx      # Página de registro
│   │   │   ├── Home.jsx          # Catálogo de libros
│   │   │   ├── BookDetail.jsx    # Detalle de libro
│   │   │   ├── Favorites.jsx     # Lista de favoritos
│   │   │   └── AdminPanel.jsx    # Panel de administración
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Barra de navegación
│   │   │   ├── BookCard.jsx      # Tarjeta de libro
│   │   │   └── ProtectedRoute.jsx# Protección de rutas
│   │   ├── services/
│   │   │   └── api.js            # Cliente API con axios
│   │   ├── App.jsx               # Componente principal
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Estilos globales
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt (10 rounds)
- Tokens JWT con expiración de 24 horas
- Rutas protegidas con middleware de autenticación
- Panel de administración restringido a rol admin
- Validación de datos en frontend y backend
- Upload de archivos con filtro de tipos permitidos

## ✨ Funcionalidades

### Usuarios
- Registro e inicio de sesión
- Búsqueda de libros en tiempo real (título, autor, categoría)
- Filtrado por categorías
- Agregar/quitar favoritos
- Ver detalles de libros

### Administrador
- Agregar libros con portada y archivo
- Editar información de libros
- Eliminar libros
- Crear nuevas categorías
- Gestión completa desde modal interactivo

## 📱 Responsive

El diseño se adapta a:
- Desktop (>1024px)
- Tablet (768px - 1024px)
- Mobile (<768px)

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Perfil actual

### Books
- `GET /api/books` - Listar libros (con filtros)
- `GET /api/books/:id` - Detalle de libro
- `GET /api/books/categories` - Listar categorías
- `POST /api/books` - Crear libro (admin)
- `PUT /api/books/:id` - Actualizar libro (admin)
- `DELETE /api/books/:id` - Eliminar libro (admin)

### Favorites
- `GET /api/favorites` - Mis favoritos
- `POST /api/favorites/:bookId` - Agregar favorito
- `DELETE /api/favorites/:bookId` - Remover favorito
- `GET /api/favorites/check/:bookId` - Verificar favorito

## 📝 Licencia

MIT

## 🌐 Publicar en internet

### Opción 1: Railway (fácil, recomendado)

1. Sube el proyecto a **GitHub**
2. Crea cuenta en https://railway.app
3. **New Project → Deploy from GitHub**
4. Configura en Railway:
   - **Root Directory:** `backend`
   - **Start Command:** `node server.js`
   - **Variables de entorno:**
     - `JWT_SECRET` = una clave secreta larga
     - `NODE_ENV` = `production`
     - `PORT` = `3001`
     - `FRONTEND_URL` = URL que te asigne Railway
5. Railway asigna URL tipo: `https://tu-app.up.railway.app`

### Opción 2: VPS (producción real)

Sigue las instrucciones en `produccion.sh` incluido en el proyecto. Requiere un servidor Ubuntu (DigitalOcean, AWS EC2, etc.)

Resumen del proceso:
```bash
# En el servidor
git clone https://github.com/tu_usuario/tu_repo.git /opt/biblioteca
cd /opt/biblioteca/backend && npm install
npm install -g pm2
NODE_ENV=production pm2 start server.js --name biblioteca
cd /opt/biblioteca/frontend && npm install && npm run build
# Configurar Nginx y SSL (ver produccion.sh)
```
