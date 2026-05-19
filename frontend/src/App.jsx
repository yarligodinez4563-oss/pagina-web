import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Favorites from './pages/Favorites';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route
        path="/"
        element={
          user ? (
            <>
              <Navbar user={user} logout={logout} />
              <Home />
            </>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/book/:id"
        element={
          user ? (
            <>
              <Navbar user={user} logout={logout} />
              <BookDetail />
            </>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Navbar user={user} logout={logout} />
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <Navbar user={user} logout={logout} />
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
