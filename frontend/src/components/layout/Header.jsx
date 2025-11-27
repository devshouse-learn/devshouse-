import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <h1>DEVSHOUSE</h1>
        </Link>
        <p className="subtitle">Conectando oportunidades</p>

        {isAuthenticated && user && (
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className={`user-role role-${user.role}`}>{user.role}</span>
            </div>
            {user.role === 'admin' && (
              <Link to="/data-viewer" className="admin-link">
                📊 Datos
              </Link>
            )}
            <button className="logout-button" onClick={logout}>
              Salir
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
