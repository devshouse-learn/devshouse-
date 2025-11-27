import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminPanel from './AdminPanel';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>⚙️ Panel de Administración</h1>
        <p className="dashboard-subtitle">Gestiona la plataforma y el contenido</p>
      </div>

      <div className="admin-dashboard-container">
        <div className="admin-panels-wrapper">
          <AdminPanel />
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
