import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsService } from '../../services/registration.service';
import { useAuth } from '../../context/AuthContext';
import './JobsList.css';

const JobsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReactions, setUserReactions] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);

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
      <div className="list-header">
        <div className="header-top">
          <button 
            className="btn-back"
            onClick={() => navigate('/recruiting')}
            title="Volver al Centro de Reclutamiento"
          ><span className="emoji">↩️</span> Volver </button>
        </div>
        <div className="header-content">
          <h1> Ofertas de Empleo</h1>
          <p>Encuentra las mejores oportunidades laborales</p>
        </div>
        <button 
          className="btn-primary-large"
          onClick={() => navigate('/jobs/form')}
        >
           Publicar Empleo
        </button>
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
          {jobs.map((job) => (
            <div key={job.id} className="item-card">
              <div className="card-header">
                <div className="header-title">
                  <div className="header-info">
                    <h3>{job.position}</h3>
                    <p className="company-name"> {job.company}</p>
                  </div>
                  <span className="badge">{job.experience}</span>
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
                  <div className="info-row">
                    <span className="label"><span className="emoji">📍</span> Ubicacion:</span>
                    <span className="value">{job.location}</span>
                  </div>

                  <div className="info-row">
                    <span className="label"><span className="emoji">📋</span> Tipo de contrato:</span>
                    <span className="value" style={{ textTransform: 'capitalize' }}>{job.jobType}</span>
                  </div>

                  <div className="info-row">
                    <span className="label"><span className="emoji">📈</span> Experiencia requerida:</span>
                    <span className="value">{job.experience}</span>
                  </div>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsList;
