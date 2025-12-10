import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <h1>DEVSHOUSE</h1>
        </Link>
        <p className="subtitle">Conectando oportunidades</p>

        {isAuthenticated && user ? (
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className={`user-role role-${user.role}`}>{user.role}</span>
            </div>
            {(user.role === 'admin' || user.role === 'moderador') && (
              <Link to="/moderation-panel" className="moderation-link">
                 Moderación
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/data-viewer" className="admin-link">
                 Datos
              </Link>
            )}
            <button className="logout-button" onClick={handleLogout}>
              Salir
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button 
              className="login-button" 
              onClick={() => navigate('/login')}
            >
              Inicia sesión
            </button>
            <button 
              className="register-button" 
              onClick={() => navigate('/register')}
            >
              Registrate
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
