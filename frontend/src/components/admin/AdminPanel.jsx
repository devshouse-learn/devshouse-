import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/auth.service';
import './AdminPanel.css';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [adminEmail, setAdminEmail] = useState('');
  const [moderatorEmail, setModeratorEmail] = useState('');
  const [revokeAdminEmail, setRevokeAdminEmail] = useState('');
  const [revokeModeratorEmail, setRevokeModeratorEmail] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [adminMessageType, setAdminMessageType] = useState('');
  const [moderatorMessage, setModeratorMessage] = useState('');
  const [moderatorMessageType, setModeratorMessageType] = useState('');
  const [revokeAdminMessage, setRevokeAdminMessage] = useState('');
  const [revokeAdminMessageType, setRevokeAdminMessageType] = useState('');
  const [revokeModeratorMessage, setRevokeModeratorMessage] = useState('');
  const [revokeModeratorMessageType, setRevokeModeratorMessageType] = useState('');
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [isLoadingModerator, setIsLoadingModerator] = useState(false);
  const [isLoadingRevokeAdmin, setIsLoadingRevokeAdmin] = useState(false);
  const [isLoadingRevokeModerator, setIsLoadingRevokeModerator] = useState(false);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    setAdminMessage('');
    setIsLoadingAdmin(true);

    try {
      if (!adminEmail.trim()) {
        throw new Error('Ingresa el email del usuario a promover a administrador');
      }

      const adminPassword = localStorage.getItem('adminPassword');

      if (!adminPassword) {
        throw new Error('Sesión expirada. Por favor, vuelve a iniciar sesión');
      }

      const result = await authService.assignAdminRole(user.email, adminPassword, adminEmail);

      setAdminMessage(result.message);
      setAdminMessageType('success');
      setAdminEmail('');

      setTimeout(() => {
        setAdminMessage('');
        setAdminMessageType('');
      }, 3000);
    } catch (error) {
      setAdminMessage(error.message);
      setAdminMessageType('error');
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  const handleAssignModerator = async (e) => {
    e.preventDefault();
    setModeratorMessage('');
    setIsLoadingModerator(true);

    try {
      if (!moderatorEmail.trim()) {
        throw new Error('Ingresa el email del usuario a promover a moderador');
      }

      const adminPassword = localStorage.getItem('adminPassword');

      if (!adminPassword) {
        throw new Error('Sesión expirada. Por favor, vuelve a iniciar sesión');
      }

      const result = await authService.assignModeratorRole(user.email, adminPassword, moderatorEmail);

      setModeratorMessage(result.message);
      setModeratorMessageType('success');
      setModeratorEmail('');

      setTimeout(() => {
        setModeratorMessage('');
        setModeratorMessageType('');
      }, 3000);
    } catch (error) {
      setModeratorMessage(error.message);
      setModeratorMessageType('error');
    } finally {
      setIsLoadingModerator(false);
    }
  };

  const handleRevokeAdmin = async (e) => {
    e.preventDefault();
    setRevokeAdminMessage('');
    setIsLoadingRevokeAdmin(true);

    try {
      if (!revokeAdminEmail.trim()) {
        throw new Error('Ingresa el email del usuario a revocar administrador');
      }

      const adminPassword = localStorage.getItem('adminPassword');

      if (!adminPassword) {
        throw new Error('Sesión expirada. Por favor, vuelve a iniciar sesión');
      }

      const result = await authService.revokeAdminRole(user.email, adminPassword, revokeAdminEmail);

      setRevokeAdminMessage(result.message);
      setRevokeAdminMessageType('success');
      setRevokeAdminEmail('');

      setTimeout(() => {
        setRevokeAdminMessage('');
        setRevokeAdminMessageType('');
      }, 3000);
    } catch (error) {
      setRevokeAdminMessage(error.message);
      setRevokeAdminMessageType('error');
    } finally {
      setIsLoadingRevokeAdmin(false);
    }
  };

  const handleRevokeModerator = async (e) => {
    e.preventDefault();
    setRevokeModeratorMessage('');
    setIsLoadingRevokeModerator(true);

    try {
      if (!revokeModeratorEmail.trim()) {
        throw new Error('Ingresa el email del usuario a revocar moderador');
      }

      const adminPassword = localStorage.getItem('adminPassword');

      if (!adminPassword) {
        throw new Error('Sesión expirada. Por favor, vuelve a iniciar sesión');
      }

      const result = await authService.revokeModeratorRole(user.email, adminPassword, revokeModeratorEmail);

      setRevokeModeratorMessage(result.message);
      setRevokeModeratorMessageType('success');
      setRevokeModeratorEmail('');

      setTimeout(() => {
        setRevokeModeratorMessage('');
        setRevokeModeratorMessageType('');
      }, 3000);
    } catch (error) {
      setRevokeModeratorMessage(error.message);
      setRevokeModeratorMessageType('error');
    } finally {
      setIsLoadingRevokeModerator(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>⚙️ Panel de Administración</h2>
        <p className="admin-info">
          Conectado como: <strong>{user.email}</strong>
        </p>
      </div>

      <div className="admin-panel-content">
        {/* Sección para asignar Administrador */}
        <section className="admin-section">
          <h3>👑 Asignar Rol de Administrador</h3>
          <p className="section-description">
            Promueve a otros usuarios a administradores para que puedan gestionar la plataforma.
          </p>

          <form onSubmit={handleAssignAdmin} className="admin-form">
            <div className="form-group">
              <label htmlFor="adminEmail">Email del Usuario</label>
              <input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                disabled={isLoadingAdmin}
              />
            </div>

            <button
              type="submit"
              className="admin-button admin-button-primary"
              disabled={isLoadingAdmin || !adminEmail.trim()}
            >
              {isLoadingAdmin ? 'Procesando...' : '👑 Promover a Administrador'}
            </button>
          </form>

          {adminMessage && (
            <div className={`admin-message ${adminMessageType}`}>
              {adminMessageType === 'success' ? '✅' : '❌'} {adminMessage}
            </div>
          )}
        </section>

        {/* Sección para asignar Moderador */}
        <section className="admin-section">
          <h3>🛡️ Asignar Rol de Moderador</h3>
          <p className="section-description">
            Promueve a usuarios a moderadores para que ayuden a gestionar el contenido.
          </p>

          <form onSubmit={handleAssignModerator} className="admin-form">
            <div className="form-group">
              <label htmlFor="moderatorEmail">Email del Usuario</label>
              <input
                id="moderatorEmail"
                type="email"
                value={moderatorEmail}
                onChange={(e) => setModeratorEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                disabled={isLoadingModerator}
              />
            </div>

            <button
              type="submit"
              className="admin-button admin-button-secondary"
              disabled={isLoadingModerator || !moderatorEmail.trim()}
            >
              {isLoadingModerator ? 'Procesando...' : '🛡️ Promover a Moderador'}
            </button>
          </form>

          {moderatorMessage && (
            <div className={`admin-message ${moderatorMessageType}`}>
              {moderatorMessageType === 'success' ? '✅' : '❌'} {moderatorMessage}
            </div>
          )}
        </section>

        {/* Sección para revocar Administrador */}
        <section className="admin-section">
          <h3>❌ Revocar Rol de Administrador</h3>
          <p className="section-description">
            Revoca el rol de administrador a usuarios (excepto al propietario kelib@gmail.com).
          </p>

          <form onSubmit={handleRevokeAdmin} className="admin-form">
            <div className="form-group">
              <label htmlFor="revokeAdminEmail">Email del Usuario</label>
              <input
                id="revokeAdminEmail"
                type="email"
                value={revokeAdminEmail}
                onChange={(e) => setRevokeAdminEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                disabled={isLoadingRevokeAdmin}
              />
            </div>

            <button
              type="submit"
              className="admin-button admin-button-danger"
              disabled={isLoadingRevokeAdmin || !revokeAdminEmail.trim()}
            >
              {isLoadingRevokeAdmin ? 'Procesando...' : '❌ Revocar Administrador'}
            </button>
          </form>

          {revokeAdminMessage && (
            <div className={`admin-message ${revokeAdminMessageType}`}>
              {revokeAdminMessageType === 'success' ? '✅' : '❌'} {revokeAdminMessage}
            </div>
          )}
        </section>

        {/* Sección para revocar Moderador */}
        <section className="admin-section">
          <h3>🚫 Revocar Rol de Moderador</h3>
          <p className="section-description">
            Revoca el rol de moderador a usuarios.
          </p>

          <form onSubmit={handleRevokeModerator} className="admin-form">
            <div className="form-group">
              <label htmlFor="revokeModeratorEmail">Email del Usuario</label>
              <input
                id="revokeModeratorEmail"
                type="email"
                value={revokeModeratorEmail}
                onChange={(e) => setRevokeModeratorEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                disabled={isLoadingRevokeModerator}
              />
            </div>

            <button
              type="submit"
              className="admin-button admin-button-warning"
              disabled={isLoadingRevokeModerator || !revokeModeratorEmail.trim()}
            >
              {isLoadingRevokeModerator ? 'Procesando...' : '🚫 Revocar Moderador'}
            </button>
          </form>

          {revokeModeratorMessage && (
            <div className={`admin-message ${revokeModeratorMessageType}`}>
              {revokeModeratorMessageType === 'success' ? '✅' : '❌'} {revokeModeratorMessage}
            </div>
          )}
        </section>

        {/* Sección de Navegación */}
        <div className="admin-navigation">
          <div className="btn-group-left">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate(-1)}
            >
              ⬅️ Atrás
            </button>
          </div>
          <div className="btn-group-right">
            <button
              type="button"
              className="btn-close"
              onClick={() => navigate('/')}
            >
              ✕ Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
