import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminPanel from './AdminPanel';
import ModerationPanel from '../moderation/ModerationPanel';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const showAdminPanel = user.role === 'admin';
  const showModerationPanel = user.role === 'moderador' || user.role === 'admin';

  // Si solo puede ver moderación, muestra moderación por defecto
  const defaultPanel = showAdminPanel ? 'admin' : 'moderation';
  const [activePanel, setActivePanel] = useState(defaultPanel);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>🛠️ Panel de Control</h1>
        <p className="dashboard-subtitle">Gestiona la plataforma y el contenido</p>
      </div>

      <div className="admin-dashboard-container">
        {/* Panel de Navegación */}
        <div className="admin-nav-tabs">
          {showAdminPanel && (
            <button
              className={`nav-tab ${activePanel === 'admin' ? 'active' : ''}`}
              onClick={() => setActivePanel('admin')}
            >
              ⚙️ Administración
            </button>
          )}
          {showModerationPanel && (
            <button
              className={`nav-tab ${activePanel === 'moderation' ? 'active' : ''}`}
              onClick={() => setActivePanel('moderation')}
            >
              🛡️ Moderación
            </button>
          )}
        </div>

        {/* Contenido de los Paneles */}
        <div className="admin-panels-wrapper">
          {activePanel === 'admin' && showAdminPanel && <AdminPanel />}
          {activePanel === 'moderation' && showModerationPanel && <ModerationPanel />}
        </div>
      </div>

      {/* Botones de Navegación Inferiores */}
      <div className="admin-dashboard-footer">
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate(-1)}
        >
          ⬅️ Atrás
        </button>
        <button
          type="button"
          className="btn-home"
          onClick={() => navigate('/')}
        >
          🏠 Inicio
        </button>
      </div>
    </div>
  );
}
