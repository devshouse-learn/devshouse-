import { useNavigate } from 'react-router-dom';
import './PageWrapper.css';

const PageWrapper = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  showBackButton = true 
}) => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <div className="page-header">
        {showBackButton && (
          <button 
            className="btn-back"
            onClick={() => navigate('/')}
            title="Volver al inicio"
          >
            ← Volver
          </button>
        )}
        <div className="page-title-section">
          <h1>{icon} {title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="page-content">
        {children}
      </div>

      <div className="page-footer">
        <button className="btn-home" onClick={() => navigate('/')}>
          🏠 Inicio
        </button>
      </div>
    </div>
  );
};

export default PageWrapper;
