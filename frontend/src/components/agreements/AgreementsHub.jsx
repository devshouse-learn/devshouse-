import { useNavigate } from 'react-router-dom';
import './AgreementsHub.css';

const AgreementsHub = () => {
  const navigate = useNavigate();

  return (
    <div className="hub-container">
      <div className="list-header">
        <div className="header-top">
          <button 
            className="btn-back"
            onClick={() => navigate('/')}
            title="Volver al inicio"
          >
            ← Volver
          </button>
        </div>
        <div className="header-content">
          <h1>Educación y Convenios</h1>
          <p>Elige cómo deseas participar</p>
        </div>
      </div>

      <div className="hub-options">
        <div 
          className="option-card"
          onClick={() => navigate('/agreements/list')}
        >
          <div className="option-icon">📋</div>
          <h2>Convenios</h2>
          <p>Explora convenios educativos registrados</p>
          <button className="option-button">
            Ver Convenios →
          </button>
        </div>

        <div 
          className="option-card"
          onClick={() => navigate('/agreements/students')}
        >
          <div className="option-icon">🎓</div>
          <h2>Estudiar</h2>
          <p>Descubre estudiantes y talentos registrados</p>
          <button className="option-button">
            Ver Estudiantes →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreementsHub;
