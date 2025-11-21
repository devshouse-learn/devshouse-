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

  if (requiredRole && user?.role !== requiredRole) {
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
        <p>Se requiere: <strong>{requiredRole}</strong></p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
