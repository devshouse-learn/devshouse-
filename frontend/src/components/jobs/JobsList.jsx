import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jobsService } from '../../services/registration.service';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../common/BackButton';
import './JobsList.css';

const JobsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReactions, setUserReactions] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);

  // Detectar si estamos en un formulario
  const isInForm = location.pathname.includes('/form');

  const getCompanyName = (job) => job.company || job.company_name || job.employer || 'Empresa';
  const getLogoUrl = (job) => job.logoUrl || job.logo_url || job.companyLogo || job.company_logo || '';
  const getInitials = (value = '') =>
    value
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'EM';

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await jobsService.getAll();
      const loadedJobs = response.data || [];
      setJobs(loadedJobs);
      
      const reactions = {};
      for (const job of loadedJobs) {
        const userReaction = await jobsService.getUserReactions(job.id);
        reactions[job.id] = userReaction;
      }
      setUserReactions(reactions);
    } catch (err) {
      console.error('Error loading jobs:', err);
      if (err.message.includes('Failed to fetch')) {
        setError(' No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      } else if (err.message.includes('timeout')) {
        setError(' La conexión tardó demasiado. Por favor, intenta de nuevo.');
      } else {
        setError(' Error al cargar los empleos. Por favor, intenta de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const result = await jobsService.like(id);
      const isLiking = result.action === 'liked';
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === id 
            ? { ...job, likes: isLiking ? (job.likes || 0) + 1 : (job.likes || 1) - 1 }
            : job
        )
      );
      setUserReactions(prev => ({
        ...prev,
        [id]: { ...prev[id], hasLiked: isLiking }
      }));
    } catch (err) {
      console.error('Error al dar like:', err);
      alert('Error al registrar like: ' + err.message);
    }
  };

  const handleReport = async (id) => {
    if (userReactions[id]?.hasReported) {
      return;
    }
    try {
      const reason = prompt('¿Cuál es el motivo de la denuncia?');
      if (reason) {
        await jobsService.report(id, reason);
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === id 
              ? { ...job, reports: (job.reports || 0) + 1 }
              : job
          )
        );
        setUserReactions(prev => ({
          ...prev,
          [id]: { ...prev[id], hasReported: true }
        }));
        alert(' Denuncia registrada correctamente');
      }
    } catch (err) {
      console.error('Error al reportar:', err);
      alert('Error al denunciar: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      return;
    }
    try {
      await jobsService.delete(id);
      setJobs(prevJobs => prevJobs.filter(j => j.id !== id));
      alert(' Oferta eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert(' Error al eliminar: ' + err.message);
    }
  };

  if (loading) {
    return <div className="list-container">Cargando ofertas de empleo...</div>;
  }

  return (
    <div className="list-container">
      <BackButton />
      <div className="list-header">
        <div className="header-top">
          <button 
            className="btn-primary-large"
            onClick={() => navigate('/jobs/form')}
          >
             Publicar Empleo
          </button>
        </div>
        <div className="header-content">
          <h1> Ofertas de Empleo</h1>
          <p>Encuentra las mejores oportunidades laborales</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={loadJobs}
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

      {jobs.length === 0 ? (
        <div className="empty-state">
          <h2> Sin ofertas de empleo aún</h2>
          <p>Sé el primero en publicar una oferta</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/jobs/form')}
          >
             Publicar Empleo
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {jobs.map((job) => {
            const companyName = getCompanyName(job);
            const logoUrl = getLogoUrl(job);
            const logoFallback = getInitials(companyName);

            return (
              <div key={job.id} className="item-card">
              <div className="card-header">
                <div className="header-title">
                    <div className="company-logo" aria-label={`Logo de ${companyName}`}>
                      {logoUrl ? (
                        <img src={logoUrl} alt={`Logo de ${companyName}`} />
                      ) : (
                        <span>{logoFallback}</span>
                      )}
                    </div>
                    <div className="header-info">
                      <h3>{job.position}</h3>
                      <p className="company-name"> {companyName}</p>
                    </div>
                </div>
                <div className="header-menu">
                  <button
                    className="menu-btn"
                    onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                    title="Más opciones"
                  >
                    ⋮
                  </button>
                  {openMenuId === job.id && (
                    <div className="menu-dropdown">
                      <button
                        className="menu-item"
                        onClick={() => {
                          handleReport(job.id);
                          setOpenMenuId(null);
                        }}
                        disabled={userReactions[job.id]?.hasReported}
                      >
                        {userReactions[job.id]?.hasReported ? '🚨 Denunciado' : '🚨 Reportar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

                <div className="card-content">
                <div className="card-body">
                  {/* Información Básica */}
                  <div className="info-row">
                    <span className="label"><span className="emoji">📍</span> Ubicación:</span>
                    <span className="value">{job.location}</span>
                  </div>

                  <div className="info-row">
                    <span className="label"><span className="emoji">📋</span> Tipo de contrato:</span>
                    <span className="value" style={{ textTransform: 'capitalize' }}>{job.jobType}</span>
                  </div>

                  <div className="info-row">
                    <span className="label"><span className="emoji">📈</span> Experiencia:</span>
                    <span className="value">{job.experience}</span>
                  </div>

                  {/* Información Salarial */}
                  {(job.salaryMin || job.salaryMax) && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">💰</span> Salario:</span>
                      <span className="value">
                        {job.salaryMin && job.salaryMax 
                          ? `${job.currency || 'USD'} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                          : `${job.currency || 'USD'} ${job.salaryMin || job.salaryMax || 'No especificado'}`
                        }
                      </span>
                    </div>
                  )}

                  {/* Industria */}
                  {job.industry && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">🏢</span> Industria:</span>
                      <span className="value" style={{ textTransform: 'capitalize' }}>{job.industry}</span>
                    </div>
                  )}

                  {/* Descripción Resumida */}
                  {job.description && (
                    <div className="info-row description-preview">
                      <span className="label"><span className="emoji">📝</span> Descripción:</span>
                      <span className="value">{job.description.substring(0, 100)}{job.description.length > 100 ? '...' : ''}</span>
                    </div>
                  )}

                  {/* Requisitos Principales */}
                  {job.requirements && (
                    <div className="info-row requirements-preview">
                      <span className="label"><span className="emoji">✅</span> Requisitos:</span>
                      <span className="value">
                        {typeof job.requirements === 'string' 
                          ? job.requirements.split(',').slice(0, 2).map(req => req.trim()).join(', ')
                          : Array.isArray(job.requirements)
                          ? job.requirements.slice(0, 2).join(', ')
                          : 'No especificados'
                        }
                        {typeof job.requirements === 'string' && job.requirements.split(',').length > 2 ? '...' : ''}
                        {Array.isArray(job.requirements) && job.requirements.length > 2 ? '...' : ''}
                      </span>
                    </div>
                  )}

                  {/* Beneficios */}
                  {job.benefits && (
                    <div className="info-row benefits-preview">
                      <span className="label"><span className="emoji">🎁</span> Beneficios:</span>
                      <span className="value">
                        {typeof job.benefits === 'string' 
                          ? job.benefits.substring(0, 80)
                          : 'Consultar oferta completa'
                        }
                        {typeof job.benefits === 'string' && job.benefits.length > 80 ? '...' : ''}
                      </span>
                    </div>
                  )}

                  {/* Fecha Límite */}
                  {job.applicationDeadline && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📅</span> Plazo:</span>
                      <span className="value">{new Date(job.applicationDeadline).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                </div>

                <div className="card-stats">
                  <span><span className="emoji">👁️</span> Vistas: {job.views || 0}</span>
                  <span><span className="emoji">❤️</span> Likes: {job.likes || 0}</span>
                  <span><span className="emoji">🚨</span> Reportes: {job.reports || 0}</span>
                </div>
              </div>

                <div className="card-actions">
                <button
                  className={`btn-like ${userReactions[job.id]?.hasLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(job.id)}
                  title={userReactions[job.id]?.hasLiked ? 'Remover like' : 'Me gusta'}
                >
                  <span className="emoji">🤍</span> {userReactions[job.id]?.hasLiked ? 'Liked' : 'Like'}
                </button>
                <button
                  className="btn-contact"
                  onClick={() => {
                    const email = job.contactEmail 
                      || job.email 
                      || job.postedByEmail
                      || job.postedBy?.email;
                    
                    if (email && String(email).trim()) {
                      window.location.href = `mailto:${String(email).trim()}`;
                    } else {
                      alert(' Email no disponible para este contacto. Por favor contacta al administrador.');
                    }
                  }}
                  title="Contactar con el empleador"
                ><span className="emoji">📬</span> Contactar </button>
                {(user?.role === 'admin' || user?.id === job.createdBy) && (
                  <button
                    onClick={() => handleDelete(job.id)}
                    title={user?.role === 'admin' ? 'Eliminar oferta de empleo (admin)' : 'Eliminar tu oferta de empleo'}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: 'none',
                      padding: '0',
                      borderRadius: '0',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'none',
                      fontSize: '20px',
                    }}
                  ><span className="emoji">🗑️</span></button>
                )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobsList;
