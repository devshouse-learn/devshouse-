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
          onClick={() => navigate('/agreements/form')}
        >
          <div className="option-icon">📋</div>
          <h2>Convenios</h2>
          <p>Crea y publica convenios educativos entre instituciones y empresas</p>
          <button className="option-button">
            Crear Convenio →
          </button>
        </div>

        <div 
          className="option-card"
          onClick={() => navigate('/recruiting/publish-profile')}
        >
          <div className="option-icon">🎓</div>
          <h2>Estudiar</h2>
          <p>Sube tu hoja de vida y muestra tu perfil profesional</p>
          <button className="option-button">
            Subir Hoja de Vida →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreementsHub;
