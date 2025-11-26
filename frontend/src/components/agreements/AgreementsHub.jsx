import { useNavigate } from 'react-router-dom';
import './AgreementsHub.css';

const AgreementsHub = () => {
  const navigate = useNavigate();

  return (
    <div className="hub-container">
      <div className="hub-header">
        <button 
          className="btn-back"
          onClick={() => navigate('/')}
          title="Volver al inicio"
        >
          ← Volver
        </button>
        <h1>📚 Educación y Convenios</h1>
        <p>Elige cómo deseas participar</p>
      </div>

      <div className="hub-options">
        <div 
          className="option-card"
          onClick={() => navigate('/agreements')}
        >
          <div className="option-icon">📋</div>
          <h2>Convenios</h2>
          <p>Busca o publica convenios educativos entre instituciones y empresas</p>
          <button className="option-button">
            Ver Convenios →
          </button>
        </div>

        <div 
          className="option-card"
          onClick={() => navigate('/job-search')}
        >
          <div className="option-icon">🎓</div>
          <h2>Estudiar</h2>
          <p>Encuentra estudiantes y profesionales disponibles para aprender y crecer</p>
          <button className="option-button">
            Ver Talentos →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreementsHub;
