import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agreementsService, venturesService, jobsService } from '../../services/registration.service';
import ReactionButtons from '../common/ReactionButtons';
import ReadOnlyModal from '../common/ReadOnlyModal';
import { useAuth } from '../../context/AuthContext';
import './DataViewer.css';

const DataViewer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [data, setData] = useState({
    agreements: [],
    ventures: [],
    jobs: [],
  });
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [readOnlyModal, setReadOnlyModal] = useState({
    isOpen: false,
    data: null,
    type: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [agreementsRes, venturesRes, jobsRes] = await Promise.all([
        agreementsService.getAll(),
        venturesService.getAll(),
        jobsService.getAll(),
      ]);

      const loadedData = {
        agreements: agreementsRes.data || [],
        ventures: venturesRes.data || [],
        jobs: jobsRes.data || [],
      };

      setData(loadedData);
      setStats({
        agreements: loadedData.agreements.length,
        ventures: loadedData.ventures.length,
        jobs: loadedData.jobs.length,
        users: 0, // TODO: Implementar cuando exista API de usuarios
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const allData = {
      agreements: data.agreements,
      ventures: data.ventures,
      jobs: data.jobs,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devshouse-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const clearAllData = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
      try {
        // Eliminar todos los convenios
        for (const agreement of data.agreements) {
          await agreementsService.delete(agreement.id);
        }
        // Eliminar todos los emprendimientos
        for (const venture of data.ventures) {
          await venturesService.delete(venture.id);
        }
        // Eliminar todos los empleos
        for (const job of data.jobs) {
          await jobsService.delete(job.id);
        }
        
        await loadData();
        alert('✅ Todos los datos han sido eliminados');
      } catch (error) {
        console.error('Error al eliminar datos:', error);
        alert('❌ Error al eliminar los datos');
      }
    }
  };

  const deleteItem = async (type, id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      try {
        switch (type) {
          case 'agreement':
            await agreementsService.delete(id);
            break;
          case 'venture':
            await venturesService.delete(id);
            break;
          case 'job':
            await jobsService.delete(id);
            break;
          default:
            break;
        }
        await loadData();
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('❌ Error al eliminar el registro');
      }
    }
  };

  const openReadOnlyModal = (type, itemData) => {
    setReadOnlyModal({
      isOpen: true,
      data: itemData,
      type: type,
    });
  };

  const closeReadOnlyModal = () => {
    setReadOnlyModal({
      isOpen: false,
      data: null,
      type: null,
    });
  };

  return (
    <div className="data-viewer">
      <div className="data-viewer-header">
        <button 
          className="btn-back"
          onClick={() => navigate('/')}
          title="Volver al inicio"
          style={{
            position: 'absolute',
            left: '20px',
            top: '20px',
          }}
        >
          ← Volver
        </button>
        <h1>📊 Visor de Datos</h1>
        <p>Administra todos los datos guardados en localStorage</p>
        <div className="data-actions">
          <button onClick={loadData} className="btn-refresh">
            🔄 Actualizar
          </button>
          <button onClick={exportData} className="btn-export">
            💾 Exportar JSON
          </button>
          <button onClick={clearAllData} className="btn-danger">
            🗑️ Limpiar Todo
          </button>
        </div>
      </div>

      <div className="data-tabs">
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          📈 Estadísticas
        </button>
        <button
          className={activeTab === 'agreements' ? 'active' : ''}
          onClick={() => setActiveTab('agreements')}
        >
          📋 Convenios ({stats.agreements || 0})
        </button>
        <button
          className={activeTab === 'ventures' ? 'active' : ''}
          onClick={() => setActiveTab('ventures')}
        >
          🚀 Emprendimientos ({stats.ventures || 0})
        </button>
        <button
          className={activeTab === 'jobs' ? 'active' : ''}
          onClick={() => setActiveTab('jobs')}
        >
          💼 Empleos ({stats.jobs || 0})
        </button>
      </div>

      <div className="data-content">
        {activeTab === 'stats' && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-value">{stats.agreements || 0}</div>
              <div className="stat-label">Convenios Educativos</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <div className="stat-value">{stats.ventures || 0}</div>
              <div className="stat-label">Emprendimientos</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-value">{stats.jobs || 0}</div>
              <div className="stat-label">Ofertas de Empleo</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-value">{stats.applications || 0}</div>
              <div className="stat-label">Aplicaciones</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{stats.users || 0}</div>
              <div className="stat-label">Usuarios Registrados</div>
            </div>
          </div>
        )}

        {activeTab === 'agreements' && (
          <div className="data-list">
            {data.agreements.length === 0 ? (
              <p className="no-data">No hay convenios registrados</p>
            ) : (
              data.agreements.map((agreement) => (
                <div key={agreement.id} className="data-item">
                  <div className="item-header">
                    <h3 
                      onClick={() => openReadOnlyModal('agreement', agreement)}
                      style={{ cursor: 'pointer' }}
                      title="Haz clic para ver en modo lectura"
                    >
                      {agreement.schoolName}
                    </h3>
                    <button
                      onClick={() => deleteItem('agreement', agreement.id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="item-details">
                    <p><strong>Tipo:</strong> {agreement.schoolType}</p>
                    <p><strong>Ubicación:</strong> {agreement.location}</p>
                    <p><strong>Contacto:</strong> {agreement.contactEmail}</p>
                    <p><strong>Creado:</strong> {new Date(agreement.createdAt).toLocaleString()}</p>
                    <p><strong>Estado:</strong> <span className={`status ${agreement.status}`}>{agreement.status}</span></p>
                  </div>
                  {agreement.description && (
                    <p className="item-description">{agreement.description}</p>
                  )}
                  {user && (
                    <div className="item-reactions">
                      <ReactionButtons
                        resourceType="agreement"
                        resourceId={agreement.id}
                        initialLikes={agreement.likes || 0}
                        initialReports={agreement.reports || 0}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'ventures' && (
          <div className="data-list">
            {data.ventures.length === 0 ? (
              <p className="no-data">No hay emprendimientos registrados</p>
            ) : (
              data.ventures.map((venture) => (
                <div key={venture.id} className="data-item">
                  <div className="item-header">
                    <h3 
                      onClick={() => openReadOnlyModal('venture', venture)}
                      style={{ cursor: 'pointer' }}
                      title="Haz clic para ver en modo lectura"
                    >
                      {venture.companyName}
                    </h3>
                    <button
                      onClick={() => deleteItem('venture', venture.id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="item-details">
                    <p><strong>Industria:</strong> {venture.industry}</p>
                    <p><strong>Ubicación:</strong> {venture.location}</p>
                    <p><strong>Fundador:</strong> {venture.founderName}</p>
                    <p><strong>Email:</strong> {venture.founderEmail}</p>
                    <p><strong>Etapa:</strong> {venture.investmentStage}</p>
                    <p><strong>Creado:</strong> {new Date(venture.createdAt).toLocaleString()}</p>
                    <p><strong>Vistas:</strong> {venture.views || 0}</p>
                  </div>
                  {venture.description && (
                    <p className="item-description">{venture.description}</p>
                  )}
                  {user && (
                    <div className="item-reactions">
                      <ReactionButtons
                        resourceType="venture"
                        resourceId={venture.id}
                        initialLikes={venture.likes || 0}
                        initialReports={venture.reports || 0}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="data-list">
            {data.jobs.length === 0 ? (
              <p className="no-data">No hay empleos publicados</p>
            ) : (
              data.jobs.map((job) => (
                <div key={job.id} className="data-item">
                  <div className="item-header">
                    <h3 
                      onClick={() => openReadOnlyModal('job', job)}
                      style={{ cursor: 'pointer' }}
                      title="Haz clic para ver en modo lectura"
                    >
                      {job.position}
                    </h3>
                    <button
                      onClick={() => deleteItem('job', job.id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="item-details">
                    <p><strong>Empresa:</strong> {job.company}</p>
                    <p><strong>Ubicación:</strong> {job.location}</p>
                    <p><strong>Tipo:</strong> {job.jobType}</p>
                    <p><strong>Experiencia:</strong> {job.experience}</p>
                    <p><strong>Salario:</strong> {job.currency} {job.salaryMin} - {job.salaryMax}</p>
                    <p><strong>Publicado:</strong> {new Date(job.createdAt).toLocaleString()}</p>
                    <p><strong>Aplicantes:</strong> {job.applicants || 0}</p>
                    <p><strong>Estado:</strong> <span className={`status ${job.status}`}>{job.status}</span></p>
                  </div>
                  {job.description && (
                    <p className="item-description">{job.description}</p>
                  )}
                  {user && (
                    <div className="item-reactions">
                      <ReactionButtons
                        resourceType="job"
                        resourceId={job.id}
                        initialLikes={job.likes || 0}
                        initialReports={job.reports || 0}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <ReadOnlyModal
        isOpen={readOnlyModal.isOpen}
        onClose={closeReadOnlyModal}
        data={readOnlyModal.data}
        type={readOnlyModal.type}
      />
    </div>
  );
};

export default DataViewer;
