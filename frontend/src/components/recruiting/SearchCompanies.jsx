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
      console.log(` Cargando ${activeTab} desde API...`);
      
      let response;
      if (activeTab === 'ventures') {
        response = await venturesService.getAll();
      } else {
        response = await jobsService.getAll();
      }
      
      console.log(' Respuesta del API:', response);
      let loadedCompanies = response.data || [];
      
      // Filtrar solo emprendimientos con showInSearch = true
      if (activeTab === 'ventures') {
        loadedCompanies = loadedCompanies.filter(venture => venture.showInSearch !== false);
      }
      
      console.log(' Empresas cargadas:', loadedCompanies);
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
      console.error(' Error al cargar empresas:', err);
      setError(' Error al cargar las empresas. Por favor, intenta de nuevo.');
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
          ><span className="emoji">↩️</span> Volver </button>
        </div>
        <div className="header-content">
          <h1> Buscar Empresas</h1>
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
           Emprendimientos
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
           Ofertas de Trabajo
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
          ><span className="emoji">🔄</span> Reintentar </button>
        </div>
      )}

      {companies.length === 0 ? (
        <div className="empty-state">
          <h2> Sin {activeTab === 'ventures' ? 'emprendimientos' : 'ofertas'} registrados aún</h2>
          <p>Sé el primero en registrar {activeTab === 'ventures' ? 'tu emprendimiento' : 'una oferta'}</p>
          <button 
            className="btn-primary"
            onClick={() => navigate(activeTab === 'ventures' ? '/ventures/form' : '/jobs/form')}
          ><span className="emoji">✍️</span> Registrar </button>
        </div>
      ) : (
        <div className="items-grid">
          {companies.map((company) => (
            <div key={company.id} className="item-card">
              <div className="card-header">
                <div className="header-info">
                  <h3>{activeTab === 'ventures' ? company.company_name : company.position}</h3>
                  {activeTab === 'jobs' && company.company && (
                    <p className="company-name"> {company.company}</p>
                  )}
                </div>
                <span className="badge">
                  {activeTab === 'ventures' ? company.industry : company.experience_level}
                </span>
              </div>

              <div className="card-content">
                <div className="card-body">
                  {activeTab === 'ventures' ? (
                    <>
                      {company.founder_name && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">👤</span> Fundador:</span>
                          <span className="value">{company.founder_name}</span>
                        </div>
                      )}
                      {company.location && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">📍</span> Ubicación:</span>
                          <span className="value">{company.location}</span>
                        </div>
                      )}
                      {company.founded_year && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">📅</span> Año:</span>
                          <span className="value">{company.founded_year}</span>
                        </div>
                      )}
                      {company.investment_stage && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">📈</span> Etapa:</span>
                          <span className="value">{company.investment_stage}</span>
                        </div>
                      )}
                      {company.funding_needed && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">💵</span> Financiamiento:</span>
                          <span className="value">{company.funding_needed}</span>
                        </div>
                      )}
                      {company.team_size && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">👥</span> Equipo:</span>
                          <span className="value">{company.team_size}</span>
                        </div>
                      )}
                      {company.revenue_model && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">💼</span> Modelo:</span>
                          <span className="value">{company.revenue_model}</span>
                        </div>
                      )}
                      {company.website && (
                        <div className="info-row">
                          <span className="label"> Web:</span>
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
                      {/* Información Básica */}
                      {company.location && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">📍</span> Ubicación:</span>
                          <span className="value">{company.location}</span>
                        </div>
                      )}
                      {company.jobType && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">📋</span> Tipo de contrato:</span>
                          <span className="value" style={{ textTransform: 'capitalize' }}>{company.jobType}</span>
                        </div>
                      )}
                      {company.experience && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">📈</span> Experiencia:</span>
                          <span className="value">{company.experience}</span>
                        </div>
                      )}
                      
                      {/* Información Salarial */}
                      {(company.salaryMin || company.salaryMax) && (
                        <div className="info-row salary-row">
                          <span className="label"><span className="emoji">💰</span> Salario:</span>
                          <span className="value">
                            {company.salaryMin && company.salaryMax 
                              ? `${company.currency || 'USD'} ${company.salaryMin.toLocaleString()} - ${company.salaryMax.toLocaleString()}`
                              : `${company.currency || 'USD'} ${company.salaryMin || company.salaryMax || 'No especificado'}`
                            }
                          </span>
                        </div>
                      )}
                      
                      {/* Industria */}
                      {company.industry && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">🏢</span> Industria:</span>
                          <span className="value" style={{ textTransform: 'capitalize' }}>{company.industry}</span>
                        </div>
                      )}
                      
                      {/* Descripción */}
                      {company.description && (
                        <div className="info-row description-preview">
                          <span className="label"><span className="emoji">📝</span> Descripción:</span>
                          <span className="value">{company.description.substring(0, 100)}{company.description.length > 100 ? '...' : ''}</span>
                        </div>
                      )}
                      
                      {/* Requisitos */}
                      {company.requirements && (
                        <div className="info-row requirements-preview">
                          <span className="label"><span className="emoji">✅</span> Requisitos:</span>
                          <span className="value">
                            {typeof company.requirements === 'string' 
                              ? company.requirements.split(',').slice(0, 2).map(req => req.trim()).join(', ')
                              : Array.isArray(company.requirements)
                              ? company.requirements.slice(0, 2).join(', ')
                              : 'No especificados'
                            }
                            {typeof company.requirements === 'string' && company.requirements.split(',').length > 2 ? '...' : ''}
                            {Array.isArray(company.requirements) && company.requirements.length > 2 ? '...' : ''}
                          </span>
                        </div>
                      )}
                      
                      {/* Responsabilidades */}
                      {company.responsibilities && (
                        <div className="info-row benefits-preview">
                          <span className="label"><span className="emoji">📋</span> Responsabilidades:</span>
                          <span className="value">
                            {typeof company.responsibilities === 'string' 
                              ? company.responsibilities.substring(0, 80)
                              : 'Consultar oferta completa'
                            }
                            {typeof company.responsibilities === 'string' && company.responsibilities.length > 80 ? '...' : ''}
                          </span>
                        </div>
                      )}
                      
                      {/* Beneficios */}
                      {company.benefits && (
                        <div className="info-row benefits-preview">
                          <span className="label"><span className="emoji">🎁</span> Beneficios:</span>
                          <span className="value">
                            {typeof company.benefits === 'string' 
                              ? company.benefits.substring(0, 80)
                              : 'Consultar oferta completa'
                            }
                            {typeof company.benefits === 'string' && company.benefits.length > 80 ? '...' : ''}
                          </span>
                        </div>
                      )}
                      
                      {/* Fecha Límite */}
                      {company.applicationDeadline && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">📅</span> Plazo:</span>
                          <span className="value">{new Date(company.applicationDeadline).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                      
                      {/* Email */}
                      {company.contactEmail && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">📧</span> Email:</span>
                          <span className="value">
                            <a href={`mailto:${company.contactEmail}`} style={{ color: '#1a73e8', textDecoration: 'none' }}>
                              {company.contactEmail}
                            </a>
                          </span>
                        </div>
                      )}
                      
                      {/* Fecha de publicación */}
                      {company.createdAt && (
                        <div className="info-row">
                          <span className="label"><span className="emoji">📅</span> Publicado:</span>
                          <span className="value">
                            {new Date(company.createdAt).toLocaleDateString('es-CO', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="card-stats">
                    <span> {company.views || 0} vistas</span>
                    <span> {company.likes || 0} likes</span>
                    <span> {company.reports || 0} reportes</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className={`btn-like ${userReactions[company.id]?.hasLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(company.id)}
                    title={userReactions[company.id]?.hasLiked ? 'Quitar like' : 'Dar like'}
                  >
                    {userReactions[company.id]?.hasLiked ? ' Liked' : ' Like'}
                  </button>
                  <button
                    className={`btn-report ${userReactions[company.id]?.hasReported ? 'reported' : ''}`}
                    onClick={() => handleReport(company.id, 'Contenido inapropiado')}
                    title={userReactions[company.id]?.hasReported ? 'Ya reportado' : 'Reportar'}
                  >
                    {userReactions[company.id]?.hasReported ? ' Reported' : ' Report'}
                  </button>
                  <button
                    className="btn-contact"
                    onClick={() => {
                      // Intenta múltiples fuentes de email
                      let email;
                      if (activeTab === 'ventures') {
                        email = company.founderEmail 
                          || company.contact?.email 
                          || company.email 
                          || company.contactEmail;
                      } else {
                        email = company.contactEmail 
                          || company.email 
                          || company.postedByEmail
                          || company.postedBy?.email;
                      }
                      console.log(' Trying email:', email, 'from company:', company);
                      
                      if (email && String(email).trim()) {
                        window.location.href = `mailto:${String(email).trim()}`;
                      } else {
                        console.warn(' No email found in company object:', company);
                        alert(' Email no disponible para este contacto. Por favor contacta al administrador.');
                      }
                    }}
                    title="Contactar"
                  ><span className="emoji">📬</span> Contactar </button>
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
