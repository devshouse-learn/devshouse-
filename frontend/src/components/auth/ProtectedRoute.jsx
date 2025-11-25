import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

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
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        color: '#a0a0a0',
        fontSize: '16px',
        textAlign: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h2 style={{ color: '#ffffff' }}>Debes iniciar sesión para continuar</h2>
        <p>La modal de autenticación aparecerá arriba</p>
      </div>
    );
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
          <h2>⛔ Acceso Denegado</h2>
          <p>Tu rol actual es: <strong>{user?.role}</strong></p>
          <p>Se requiere: <strong>{allowedRoles.join(' o ')}</strong></p>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
