import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>DevsHouse</h1>
        </Link>
        <p className="subtitle">Conectando oportunidades</p>
      </div>
    </header>
  );
};

export default Header;
