// src/components/ProtectedRoute.js
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = () => {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          login(JSON.parse(storedUser)); // Restore from localStorage
        } catch {
          localStorage.removeItem('user'); // If corrupted
        }
      }
    }
  }, [isAuthenticated, login]);

  const storedUser = localStorage.getItem('user');
  const token = storedUser ? JSON.parse(storedUser)?.token : null;
  const allowed = isAuthenticated || !!token;

  return allowed ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
