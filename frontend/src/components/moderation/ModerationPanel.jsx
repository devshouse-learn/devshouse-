import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { moderationService } from '../../services/reactions.service';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../common/BackButton';
import './ModerationPanel.css';

const ModerationPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingItems, setPendingItems] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, agreement, venture, job

  useEffect(() => {
    loadData();
    
    // Recargar datos cada 5 segundos para detectar nuevos reportes
    const interval = setInterval(loadData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('📊 Cargando datos de moderación...');
      const [pendingRes, statsRes] = await Promise.all([
        moderationService.getPending(),
        moderationService.getStats(),
      ]);

      console.log('✅ Respuesta getPending:', pendingRes);
      console.log('✅ Respuesta getStats:', statsRes);

      setPendingItems(pendingRes.data || []);
      setStats(statsRes.data || {});
      
      console.log('✅ Items pendientes establecidos:', pendingRes.data?.length || 0);
      console.log('✅ Stats establecidos:', statsRes.data);
    } catch (error) {
      console.error('❌ Error al cargar datos de moderación:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (resourceType, resourceId) => {
    if (
      !window.confirm(
        '¿Estás seguro de que quieres aprobar este contenido? Se eliminarán todas las denuncias.'
      )
    ) {
      return;
    }

    try {
      await moderationService.approve(resourceType, resourceId);
      alert(' Contenido aprobado correctamente');
      await loadData();
    } catch (error) {
      console.error('Error al aprobar:', error);
      alert(' Error al aprobar el contenido');
    }
  };

  const handleDelete = async (resourceType, resourceId) => {
    if (
      !window.confirm(
        '¿Estás seguro de que quieres ELIMINAR este contenido? Esta acción no se puede deshacer.'
      )
    ) {
      return;
    }

    try {
      await moderationService.delete(resourceType, resourceId);
      alert(' Contenido eliminado correctamente');
      await loadData();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert(' Error al eliminar el contenido');
    }
  };

  const getResourceTitle = (item) => {
    switch (item.resourceType) {
      case 'agreement':
        return item.schoolName;
      case 'student':
        return item.name;
      case 'venture':
        return item.companyName;
      case 'job':
        return item.position;
      case 'candidate':
        return item.full_name || item.name || 'Sin nombre';
      default:
        return 'Sin título';
    }
  };

  const getResourceTypeLabel = (type) => {
    switch (type) {
      case 'agreement':
        return ' Convenio';
      case 'student':
        return ' Estudiante';
      case 'venture':
        return ' Emprendimiento';
      case 'job':
        return ' Empleo';
      case 'candidate':
        return ' Talento';
      default:
        return type;
    }
  };

  const filteredItems =
    filter === 'all'
      ? pendingItems
      : pendingItems.filter((item) => item.resourceType === filter);

  return (
    <div className="moderation-panel">
      <BackButton />
      <div className="moderation-header">
        <h1>Panel de Moderación</h1>
        <p>Revisa y gestiona el contenido denunciado por la comunidad</p>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card urgent">
          <div className="stat-icon"></div>
          <div className="stat-value">
            {stats.itemsUnderReview?.total || 0}
          </div>
          <div className="stat-label">Items en Revisión</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-value">
            {stats.itemsUnderReview?.agreements || 0}
          </div>
          <div className="stat-label">Convenios</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-value">
            {stats.itemsUnderReview?.ventures || 0}
          </div>
          <div className="stat-label">Emprendimientos</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-value">{stats.itemsUnderReview?.jobs || 0}</div>
          <div className="stat-label">Empleos</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-value">{stats.itemsUnderReview?.candidates || 0}</div>
          <div className="stat-label">Talentos</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-value">{stats.totalReports || 0}</div>
          <div className="stat-label">Denuncias Totales</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filter-tabs">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
           Todos ({pendingItems.length})
        </button>
        <button
          className={filter === 'agreement' ? 'active' : ''}
          onClick={() => setFilter('agreement')}
        >
           Convenios (
          {pendingItems.filter((i) => i.resourceType === 'agreement').length})
        </button>
        <button
          className={filter === 'venture' ? 'active' : ''}
          onClick={() => setFilter('venture')}
        >
           Emprendimientos (
          {pendingItems.filter((i) => i.resourceType === 'venture').length})
        </button>
        <button
          className={filter === 'job' ? 'active' : ''}
          onClick={() => setFilter('job')}
        >
           Empleos (
          {pendingItems.filter((i) => i.resourceType === 'job').length})
        </button>
        <button
          className={filter === 'candidate' ? 'active' : ''}
          onClick={() => setFilter('candidate')}
        >
           Talentos (
          {pendingItems.filter((i) => i.resourceType === 'candidate').length})
        </button>
      </div>

      {/* Lista de items en revisión */}
      <div className="pending-items">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : filteredItems.length === 0 ? (
          <div className="no-items">
            <p> No hay contenido pendiente de revisión</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={`${item.resourceType}-${item.id}`} className="review-item">
              <div className="item-header">
                <div className="item-title">
                  <span className="resource-type">
                    {getResourceTypeLabel(item.resourceType)}
                  </span>
                  <h3>{getResourceTitle(item)}</h3>
                </div>
                <div className="item-reports">
                  <span className="reports-count">
                     {item.reports} denuncias
                  </span>
                </div>
              </div>

              <div className="item-content">
                <p className="description">
                  {item.description || 'Sin descripción'}
                </p>
                {item.resourceType === 'agreement' && (
                  <div className="item-details">
                    <span> {item.location}</span>
                    <span> {item.contactEmail}</span>
                    <span> {item.schoolType}</span>
                  </div>
                )}
                {item.resourceType === 'venture' && (
                  <div className="item-details">
                    <span> {item.location}</span>
                    <span> {item.industry}</span>
                    <span> {item.investmentStage}</span>
                  </div>
                )}
                {item.resourceType === 'job' && (
                  <div className="item-details">
                    <span> {item.company}</span>
                    <span> {item.location}</span>
                    <span> {item.jobType}</span>
                    <span> {item.experience}</span>
                  </div>
                )}
                {item.resourceType === 'candidate' && (
                  <div className="item-details">
                    <span> {item.email}</span>
                    <span> {item.professional_title}</span>
                    <span> {item.location}</span>
                    <span> {item.years_experience} años experiencia</span>
                  </div>
                )}
              </div>

              {/* Detalles de las denuncias */}
              <div className="reports-section">
                <h4> Detalles de Denuncias:</h4>
                <div className="reports-list">
                  {item.reportDetails?.slice(0, 5).map((report, idx) => (
                    <div key={idx} className="report-detail">
                      <span className="report-user">Usuario #{report.userId}</span>
                      <span className="report-reason">{report.reason}</span>
                      <span className="report-date">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {item.reportDetails?.length > 5 && (
                    <p className="more-reports">
                      ... y {item.reportDetails.length - 5} denuncias más
                    </p>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="item-actions">
                <button
                  className="btn-approve"
                  onClick={() => handleApprove(item.resourceType, item.id)}
                >
                   Aprobar Contenido
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(item.resourceType, item.id)}
                >
                   Eliminar Contenido
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModerationPanel;
