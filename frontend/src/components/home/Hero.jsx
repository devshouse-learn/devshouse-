import { useAuth } from '../../context/AuthContext';
import './Hero.css';

// Deploy: 2025-12-09
const Hero = ({ onShowAuthModal }) => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Bienvenidos a DEVSHOUSE</h1>
        <p className="hero-subtitle">Conectando educación, emprendimiento y oportunidades laborales ✨</p>
        
        {!isAuthenticated && (
          <div className="hero-buttons">
            <button 
              className="hero-btn hero-btn-primary"
              onClick={() => onShowAuthModal('login')}
            >
              🔐 Inicio de Sesión
            </button>
            <button 
              className="hero-btn hero-btn-secondary"
              onClick={() => onShowAuthModal('register')}
            >
              ✍️ Crear Cuenta
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
