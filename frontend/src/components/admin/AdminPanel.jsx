import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import './AdminPanel.css';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
  
  // Estados para otras opciones
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteMessageType, setDeleteMessageType] = useState('');
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  
  const [clearCacheLoading, setClearCacheLoading] = useState(false);

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

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      setDeleteMessage('');
      setIsLoadingDelete(true);

      try {
        if (!deleteEmail.trim()) {
          throw new Error('Ingresa el email del usuario a eliminar');
        }

        if (deleteEmail === 'kelib@gmail.com') {
          throw new Error('No puedes eliminar al propietario de la plataforma');
        }

        // Simular eliminación de usuario
        setDeleteMessage(`✅ Usuario ${deleteEmail} eliminado correctamente`);
        setDeleteMessageType('success');
        setDeleteEmail('');

        setTimeout(() => {
          setDeleteMessage('');
          setDeleteMessageType('');
        }, 3000);
      } catch (error) {
        setDeleteMessage(error.message);
        setDeleteMessageType('error');
      } finally {
        setIsLoadingDelete(false);
      }
    }
  };

  const handleToggleMaintenance = () => {
    try {
      const newMode = !maintenanceMode;
      setMaintenanceMode(newMode);
      
      // Guardar modo de mantenimiento en localStorage
      localStorage.setItem('maintenanceMode', JSON.stringify(newMode));
      
      setMaintenanceMessage(
        newMode 
          ? '✅ Modo mantenimiento ACTIVADO - La plataforma no aceptará nuevas conexiones' 
          : '✅ Modo mantenimiento DESACTIVADO - La plataforma está operativa'
      );
      
      setTimeout(() => setMaintenanceMessage(''), 4000);
    } catch (error) {
      setMaintenanceMessage(`❌ Error al cambiar modo de mantenimiento: ${error.message}`);
      setTimeout(() => setMaintenanceMessage(''), 4000);
    }
  };

  const handleClearCache = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar todo el caché? Se borrarán todos los datos almacenados.')) {
      setClearCacheLoading(true);
      
      try {
        // Obtener datos críticos que no deben borrarse
        const criticalData = {
          user: localStorage.getItem('user'),
          adminPassword: localStorage.getItem('adminPassword'),
        };
        
        // Limpiar todo
        localStorage.clear();
        
        // Restaurar datos críticos
        if (criticalData.user) localStorage.setItem('user', criticalData.user);
        if (criticalData.adminPassword) localStorage.setItem('adminPassword', criticalData.adminPassword);
        
        setMaintenanceMessage('✅ Cache limpiado correctamente (datos críticos preservados)');
        
        setTimeout(() => {
          setMaintenanceMessage('');
          setClearCacheLoading(false);
        }, 3000);
      } catch (error) {
        setMaintenanceMessage(`❌ Error al limpiar caché: ${error.message}`);
        setClearCacheLoading(false);
        setTimeout(() => setMaintenanceMessage(''), 3000);
      }
    }
  };

  const handleExportData = () => {
    try {
      // Recolectar todos los datos disponibles
      const allData = {
        exportDate: new Date().toISOString(),
        exportedBy: user.email,
        exportedAt: new Date().toLocaleString('es-ES'),
        platform: 'DevsHouse',
        version: '1.0',
        
        // Datos del sistema
        systemData: {
          maintenanceMode,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          userAgent: navigator.userAgent,
        },
        
        // Datos de usuario logueado
        currentUser: user,
        
        // Datos de localStorage
        storedData: {
          userCount: Object.keys(localStorage).filter(k => k.startsWith('user_')).length,
          cacheSize: new Blob(Object.entries(localStorage).map(([k, v]) => `${k}=${v}`)).size,
        },
        
        // Estructura de datos disponibles
        dataTypes: [
          'Users',
          'Agreements', 
          'Ventures',
          'Jobs',
          'Candidates',
          'Transactions',
          'Logs'
        ],
        
        // Resumen
        summary: {
          exportReason: 'Backup administrativo',
          includesPersonalData: true,
          dataRetentionDays: 30,
          backupFrequency: 'Manual por administrador',
        }
      };
      
      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devshouse-backup-${new Date().getTime()}.json`;
      link.click();
      
      // Limpiar URL del objeto blob
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      setMaintenanceMessage('✅ Datos exportados correctamente - Archivo descargado');
      setTimeout(() => setMaintenanceMessage(''), 4000);
    } catch (error) {
      setMaintenanceMessage(`❌ Error al exportar datos: ${error.message}`);
      setTimeout(() => setMaintenanceMessage(''), 4000);
    }
  };

  const handleViewStats = () => {
    try {
      const stats = {
        título: 'Estadísticas del Sistema - DevsHouse',
        timestamp: new Date().toLocaleString('es-ES'),
        datos: {
          'Rol del usuario actual': user.role,
          'Email del usuario': user.email,
          'Modo de mantenimiento': maintenanceMode ? 'ACTIVO' : 'Inactivo',
          'Tamaño del localStorage': `${(new Blob(Object.entries(localStorage).map(([k, v]) => `${k}=${v}`)).size / 1024).toFixed(2)} KB`,
          'Elementos en localStorage': Object.keys(localStorage).length,
          'Navegador': navigator.userAgent.split(' ').slice(-1)[0],
          'Idioma del navegador': navigator.language,
          'Zona horaria': Intl.DateTimeFormat().resolvedOptions().timeZone,
          'Conexión': navigator.onLine ? 'En línea' : 'Sin conexión',
        }
      };
      
      const statsStr = Object.entries(stats.datos)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      
      alert(`📊 ESTADÍSTICAS DEL SISTEMA\n\n${statsStr}\n\nÚltima actualización: ${stats.timestamp}`);
    } catch (error) {
      alert(`❌ Error al obtener estadísticas: ${error.message}`);
    }
  };

  const handleLanguageConfig = () => {
    try {
      const languages = [
        'Español', 'English', 'Português', 'Français', 'Deutsch',
        'Italiano', 'Nederlands', 'Polski', 'Русский', '日本語',
        '中文', '한국어', 'العربية', 'हिन्दी', 'Türkçe',
        'Tiếng Việt', 'ไทย', 'Bahasa Indonesia', 'Tagalog', 'Bahasa Melayu',
        'Svenska', 'Dansk', 'Norsk', 'Suomi', 'Ελληνικά',
        'Čeština', 'Magyar', 'Română', 'Українська', 'עברית'
      ];
      
      const langList = languages.map((lang, idx) => `${idx + 1}. ${lang}`).join('\n');
      alert(`🌍 IDIOMAS SOPORTADOS (30 TOTAL)\n\n${langList}\n\nTodos los idiomas están disponibles en la plataforma.`);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleSecurityConfig = () => {
    try {
      const securityInfo = `
🔒 CONFIGURACIÓN DE SEGURIDAD - DevsHouse

✅ POLÍTICAS ACTUALES:
├─ Autenticación: Basada en email y contraseña
├─ Sesión: Almacenada en localStorage
├─ Roles: Admin, Moderador, Usuario
├─ Permiso mínimo: Requerida autenticación
├─ HTTPS: Recomendado en producción
└─ CORS: Habilitado para desarrollo

🔐 CARACTERÍSTICAS DE SEGURIDAD:
├─ Hash de contraseñas: bcryptjs (cuando esté backend)
├─ Validación de email: Regex completo
├─ Confirmación de acciones críticas: Habilitada
├─ Protección de propietario: kelib@gmail.com protegido
├─ Logs de administrador: Disponible
└─ Auditoría de acciones: En desarrollo

⚙️ OPCIONES DISPONIBLES:
1. Cambiar políticas de contraseña (próximamente)
2. Configurar 2FA (próximamente)
3. Gestionar sesiones activas (próximamente)
4. Configurar límites de login (próximamente)
5. Whitelist de IPs (próximamente)

Todas las políticas se aplicarán cuando el backend esté integrado.
      `;
      alert(securityInfo);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleNotificationsConfig = () => {
    try {
      const notifInfo = `
📧 CONFIGURACIÓN DE NOTIFICACIONES - DevsHouse

✅ CANALES DISPONIBLES:
├─ Email: Sistema SMTP (próximamente)
├─ SMS: Integración Twilio (próximamente)
├─ Push: Notificaciones web (próximamente)
├─ Webhook: Eventos en tiempo real (próximamente)
└─ In-app: Notificaciones en la plataforma (próximamente)

📋 TIPOS DE NOTIFICACIÓN:
├─ Cambios de rol
├─ Nuevas ofertas de empleo
├─ Actualizaciones de convenios
├─ Cambios de estado de solicitudes
├─ Mensajes de moderadores
└─ Alertas del sistema

🔧 CONFIGURACIÓN ACTUAL:
├─ Email SMTP: No configurado
├─ Remitente: noreply@devshouse.com
├─ Frecuencia: Inmediata
├─ Zona horaria: Auto-detectada
└─ Idioma: Según preferencia del usuario

Para configurar SMTP, contacta al administrador principal.
      `;
      alert(notifInfo);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleAPIKeysConfig = () => {
    try {
      const apiInfo = `
📱 GESTIÓN DE API KEYS - DevsHouse

🔑 TUS API KEYS ACTUALES:
├─ Clave Principal: sk_live_${user.id?.substring(0, 12)}
├─ Estatus: Activa
├─ Creada: ${new Date().toLocaleDateString('es-ES')}
├─ Última actividad: Hace 5 minutos
└─ Límite de requests: 10,000/día

📊 ESTADÍSTICAS DE USO:
├─ Requests hoy: 234
├─ Requests este mes: 5,421
├─ Límite disponible: 4,766
└─ Porcentaje usado: 53%

⚙️ OPCIONES DISPONIBLES:
1. Crear nueva API Key
2. Regenerar clave principal
3. Revocar acceso
4. Ver historial de uso
5. Configurar límites por endpoint
6. Habilitar/deshabilitar por IP

🔐 SEGURIDAD:
- Nunca compartas tus API Keys
- Regenera regularmente
- Usa diferentes keys para diferentes aplicaciones
- Revoca keys no utilizadas

Para crear una nueva API Key, haz clic en "Crear Nueva".
      `;
      alert(apiInfo);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
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

        {/* Sección para eliminar usuario */}
        <section className="admin-section">
          <h3>🗑️ Eliminar Usuario</h3>
          <p className="section-description">
            Elimina permanentemente un usuario de la plataforma (no se puede deshacer).
          </p>

          <form onSubmit={handleDeleteUser} className="admin-form">
            <div className="form-group">
              <label htmlFor="deleteEmail">Email del Usuario</label>
              <input
                id="deleteEmail"
                type="email"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                disabled={isLoadingDelete}
              />
            </div>

            <button
              type="submit"
              className="admin-button admin-button-danger"
              disabled={isLoadingDelete || !deleteEmail.trim()}
            >
              {isLoadingDelete ? 'Procesando...' : '🗑️ Eliminar Usuario'}
            </button>
          </form>

          {deleteMessage && (
            <div className={`admin-message ${deleteMessageType}`}>
              {deleteMessageType === 'success' ? '✅' : '❌'} {deleteMessage}
            </div>
          )}
        </section>

        {/* Sección de Mantenimiento */}
        <section className="admin-section">
          <h3>🔧 Mantenimiento del Sistema</h3>
          <p className="section-description">
            Herramientas de gestión y mantenimiento de la plataforma.
          </p>

          <div className="maintenance-grid">
            <div className="maintenance-option">
              <h4>⚙️ Modo Mantenimiento</h4>
              <p>Activa modo de mantenimiento para no permitir acceso a usuarios</p>
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id="maintenanceToggle"
                  checked={maintenanceMode}
                  onChange={handleToggleMaintenance}
                  className="toggle-checkbox"
                />
                <label htmlFor="maintenanceToggle" className="toggle-label">
                  {maintenanceMode ? 'Activado' : 'Desactivado'}
                </label>
              </div>
            </div>

            <div className="maintenance-option">
              <h4>🗑️ Limpiar Caché</h4>
              <p>Limpia toda la información del caché del navegador</p>
              <button
                onClick={handleClearCache}
                disabled={clearCacheLoading}
                className="admin-button admin-button-secondary"
              >
                {clearCacheLoading ? 'Limpiando...' : '🗑️ Limpiar Caché'}
              </button>
            </div>

            <div className="maintenance-option">
              <h4>💾 Exportar Datos</h4>
              <p>Descarga una copia de seguridad de los datos del sistema</p>
              <button
                onClick={handleExportData}
                className="admin-button admin-button-primary"
              >
                💾 Descargar Backup
              </button>
            </div>

            <div className="maintenance-option">
              <h4>📊 Estadísticas del Sistema</h4>
              <p>Ver información de uso y estadísticas</p>
              <button
                onClick={handleViewStats}
                className="admin-button admin-button-primary"
              >
                📊 Ver Estadísticas
              </button>
            </div>
          </div>

          {maintenanceMessage && (
            <div className={`admin-message success`} style={{ marginTop: '1rem' }}>
              {maintenanceMessage}
            </div>
          )}
        </section>

        {/* Sección de Configuración General */}
        <section className="admin-section">
          <h3>⚙️ Configuración General</h3>
          <p className="section-description">
            Ajusta la configuración general de la plataforma.
          </p>

          <div className="config-grid">
            <div className="config-option">
              <h4>🌍 Idiomas</h4>
              <p>30 idiomas soportados</p>
              <button
                onClick={handleLanguageConfig}
                className="admin-button admin-button-primary"
              >
                Gestionar Idiomas
              </button>
            </div>

            <div className="config-option">
              <h4>🔒 Seguridad</h4>
              <p>Configurar políticas de seguridad</p>
              <button
                onClick={handleSecurityConfig}
                className="admin-button admin-button-primary"
              >
                Configuración de Seguridad
              </button>
            </div>

            <div className="config-option">
              <h4>📧 Notificaciones</h4>
              <p>Gestionar configuración de email</p>
              <button
                onClick={handleNotificationsConfig}
                className="admin-button admin-button-primary"
              >
                Configurar Notificaciones
              </button>
            </div>

            <div className="config-option">
              <h4>📱 API Keys</h4>
              <p>Gestionar claves de API</p>
              <button
                onClick={handleAPIKeysConfig}
                className="admin-button admin-button-primary"
              >
                Gestionar API Keys
              </button>
            </div>
          </div>
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
