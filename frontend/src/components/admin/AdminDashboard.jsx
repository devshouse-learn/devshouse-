import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminPanel from './AdminPanel';
import ModerationPanel from '../moderation/ModerationPanel';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user has admin or moderador role
  const isAuthorized = user && (user.role === 'admin' || user.role === 'moderador');

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <button
          onClick={() => navigate('/')}
          title="Volver al inicio"
          className="dashboard-back-btn"
        >
          ← Volver
        </button>
        <h1>🛡️ Panel de Control Administrativo</h1>
        <p className="dashboard-subtitle">Gestión completa de la plataforma</p>
      </div>

      <div className="dashboard-layout">
        {/* Admin Panel - Only visible to admins */}
        {user?.role === 'admin' && (
          <div className="dashboard-section admin-section-wrapper">
            <AdminPanel />
          </div>
        )}

        {/* Moderation Panel - Visible to admins and moderators */}
        {(user?.role === 'admin' || user?.role === 'moderador') && (
          <div className="dashboard-section moderation-section-wrapper">
            <ModerationPanel />
          </div>
        )}
      </div>
    </div>
  );
}
