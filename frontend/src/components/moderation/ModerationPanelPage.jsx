import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ModerationPanel from './ModerationPanel';
import './ModerationPanelPage.css';

const ModerationPanelPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Solo moderadores y admins pueden acceder
  if (!user || !['admin', 'moderador'].includes(user.role)) {
    return (
      <div className="moderation-panel-page">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a este panel.</p>
          <button onClick={() => navigate('/')} className="btn-back">
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="moderation-panel-page">
      <div className="moderation-header">
        <button 
          className="btn-back"
          onClick={() => navigate('/')}
          title="Volver al inicio"
        >
          ← Volver
        </button>
        <h1>🛡️ Panel de Moderación</h1>
        <p>Revisa y modera el contenido de la plataforma</p>
      </div>

      <div className="moderation-content">
        <ModerationPanel />
      </div>

      <div className="moderation-footer">
        <button className="btn-home" onClick={() => navigate('/')}>
          🏠 Inicio
        </button>
      </div>
    </div>
  );
};

export default ModerationPanelPage;
