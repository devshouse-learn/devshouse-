import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: '#ffffff'
      }}>
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasAccess = allowedRoles.includes(user?.role);
    
    if (!hasAccess) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          color: '#ff6b6b',
          fontSize: '18px',
          textAlign: 'center',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h2> Acceso Denegado</h2>
          <p>Tu rol actual es: <strong>{user?.role}</strong></p>
          <p>Se requiere: <strong>{allowedRoles.join(' o ')}</strong></p>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
