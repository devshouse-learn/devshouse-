import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path) ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-links">
          <Link
            to="/agreements"
            className={`nav-link ${isActive('agreements')}`}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Convenios</span>
          </Link>

          <Link
            to="/ventures"
            className={`nav-link ${isActive('ventures')}`}
          >
            <span className="nav-icon">🚀</span>
            <span className="nav-text">Emprendimientos</span>
          </Link>

          <Link
            to="/recruiting"
            className={`nav-link recruiting-link ${isActive('recruiting')}`}
          >
            <span className="nav-icon">💼</span>
            <span className="nav-text">Centro de Reclutamiento</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
