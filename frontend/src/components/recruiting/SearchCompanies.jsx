import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { venturesService, jobsService } from '../../services/registration.service';
import '../jobs/JobsList.css';

const SearchCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReactions, setUserReactions] = useState({});
  const [activeTab, setActiveTab] = useState('ventures');

  useEffect(() => {
    loadCompanies();
  }, [activeTab]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      console.log(`🔄 Cargando ${activeTab} desde API...`);
      
      let response;
      if (activeTab === 'ventures') {
        response = await venturesService.getAll();
      } else {
        response = await jobsService.getAll();
      }
      
      console.log('✅ Respuesta del API:', response);
      let loadedCompanies = response.data || [];
      
      // Filtrar solo emprendimientos con showInSearch = true
      if (activeTab === 'ventures') {
        loadedCompanies = loadedCompanies.filter(venture => venture.showInSearch !== false);
      }
      
      console.log('🏢 Empresas cargadas:', loadedCompanies);
      setCompanies(loadedCompanies);
      
      // Cargar reacciones del usuario
      const reactions = {};
      const service = activeTab === 'ventures' ? venturesService : jobsService;
      for (const company of loadedCompanies) {
        const userReaction = await service.getUserReactions(company.id);
        reactions[company.id] = userReaction;
      }
      setUserReactions(reactions);
      setError('');
    } catch (err) {
      console.error('❌ Error al cargar empresas:', err);
      setError('❌ Error al cargar las empresas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const service = activeTab === 'ventures' ? venturesService : jobsService;
      const result = await service.like(id);
      console.log('Like response:', result);
      
      const isLiking = result.action === 'liked';
      setUserReactions((prev) => ({
        ...prev,
        [id]: { ...prev[id], hasLiked: isLiking },
      }));
      
      // Actualizar el contador de likes
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === id
            ? {
                ...company,
                likes: isLiking ? (company.likes || 0) + 1 : Math.max(0, (company.likes || 0) - 1),
              }
            : company
        )
      );
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleReport = async (id, reason) => {
    try {
      const service = activeTab === 'ventures' ? venturesService : jobsService;
      const result = await service.report(id, reason);
      console.log('Report response:', result);
      
      const isReporting = result.action === 'reported';
      setUserReactions((prev) => ({
        ...prev,
        [id]: { ...prev[id], hasReported: isReporting },
      }));
      
      // Actualizar el contador de reportes
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === id
            ? {
                ...company,
                reports: isReporting ? (company.reports || 0) + 1 : Math.max(0, (company.reports || 0) - 1),
              }
            : company
        )
      );
    } catch (error) {
      console.error('Error al reportar:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>⏳ Cargando empresas...</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header" style={{ padding: '60px 40px', minHeight: '250px', justifyContent: 'space-between' }}>
        <div className="header-top">
          <button 
            className="btn-back"
            onClick={() => navigate('/recruiting')}
            title="Volver al Centro de Reclutamiento"
          >
            ← Volver
          </button>
        </div>
        <div className="header-content">
          <h1>🏢 Buscar Empresas</h1>
          <p>Descubre empresas y oportunidades</p>
        </div>
      </div>

      <div className="tab-container" style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
        <button
          className={`tab-button ${activeTab === 'ventures' ? 'active' : ''}`}
          onClick={() => setActiveTab('ventures')}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'ventures' ? '#1e88e5' : '#666',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          🚀 Emprendimientos
        </button>
        <button
          className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'jobs' ? '#1e88e5' : '#666',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          💼 Ofertas de Trabajo
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={loadCompanies}
            style={{
              marginLeft: '15px',
              padding: '5px 15px',
              background: '#c33',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            🔄 Reintentar
          </button>
        </div>
      )}

      {companies.length === 0 ? (
        <div className="empty-state">
          <h2>📭 Sin {activeTab === 'ventures' ? 'emprendimientos' : 'ofertas'} registrados aún</h2>
          <p>Sé el primero en registrar {activeTab === 'ventures' ? 'tu emprendimiento' : 'una oferta'}</p>
          <button 
            className="btn-primary"
            onClick={() => navigate(activeTab === 'ventures' ? '/ventures/form' : '/jobs/form')}
          >
            ➕ Registrar
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {companies.map((company) => (
            <div key={company.id} className="item-card">
              <div className="card-header">
                <h3>{activeTab === 'ventures' ? company.companyName : company.position}</h3>
                <span className="badge">
                  {activeTab === 'ventures' ? company.industry : company.company}
                </span>
              </div>

              <div className="card-content">
                <div className="card-body">
                  {activeTab === 'ventures' ? (
                    <>
                      {company.founderName && (
                        <div className="info-row">
                          <span className="label">👤 Fundador:</span>
                          <span className="value">{company.founderName}</span>
                        </div>
                      )}
                      {company.location && (
                        <div className="info-row">
                          <span className="label">📍 Ubicación:</span>
                          <span className="value">{company.location}</span>
                        </div>
                      )}
                      {company.investmentStage && (
                        <div className="info-row">
                          <span className="label">💰 Etapa:</span>
                          <span className="value">{company.investmentStage}</span>
                        </div>
                      )}
                      {company.website && (
                        <div className="info-row">
                          <span className="label">🌐 Web:</span>
                          <span className="value">
                            <a href={company.website} target="_blank" rel="noopener noreferrer">
                              {company.website}
                            </a>
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {company.location && (
                        <div className="info-row">
                          <span className="label">📍 Ubicación:</span>
                          <span className="value">{company.location}</span>
                        </div>
                      )}
                      {company.contractType && (
                        <div className="info-row">
                          <span className="label">📋 Tipo:</span>
                          <span className="value">{company.contractType}</span>
                        </div>
                      )}
                      {company.salary && (
                        <div className="info-row">
                          <span className="label">💵 Salario:</span>
                          <span className="value">{company.salary}</span>
                        </div>
                      )}
                      {company.experienceLevel && (
                        <div className="info-row">
                          <span className="label">📈 Experiencia:</span>
                          <span className="value">{company.experienceLevel}</span>
                        </div>
                      )}
                    </>
                  )}

                  {company.description && (
                    <div className="description">
                      <p>{company.description.substring(0, 200)}...</p>
                    </div>
                  )}

                  <div className="card-stats">
                    <span>👁️ {company.views || 0} vistas</span>
                    <span>❤️ {company.likes || 0} likes</span>
                    <span>🚨 {company.reports || 0} reportes</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className={`btn-like ${userReactions[company.id]?.hasLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(company.id)}
                    title={userReactions[company.id]?.hasLiked ? 'Quitar like' : 'Dar like'}
                  >
                    {userReactions[company.id]?.hasLiked ? '❤️ Liked' : '🤍 Like'}
                  </button>
                  <button
                    className={`btn-report ${userReactions[company.id]?.hasReported ? 'reported' : ''}`}
                    onClick={() => handleReport(company.id, 'Contenido inapropiado')}
                    title={userReactions[company.id]?.hasReported ? 'Ya reportado' : 'Reportar'}
                  >
                    {userReactions[company.id]?.hasReported ? '🚩 Reported' : '🚩 Report'}
                  </button>
                  <button
                    className="btn-contact"
                    onClick={() => {
                      const email = activeTab === 'ventures' ? company.founderEmail : company.contactEmail;
                      if (email) {
                        window.location.href = `mailto:${email}`;
                      }
                    }}
                    title="Contactar"
                  >
                    ✉️ Contactar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCompanies;
