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
      
      // Cargar reacciones del usuario
      const reactions = {};
      for (const job of loadedJobs) {
        const userReaction = await jobsService.getUserReactions(job.id);
        reactions[job.id] = userReaction;
      }
      setUserReactions(reactions);
    } catch (err) {
      console.error('Error loading jobs:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('⚠️ No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      } else if (err.message.includes('timeout')) {
        setError('⚠️ La conexión tardó demasiado. Por favor, intenta de nuevo.');
      } else {
        setError('⚠️ Error al cargar los empleos. Por favor, intenta de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const result = await jobsService.like(id);
      console.log('Like response:', result);
      
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
    // Si ya reportó, no permitir otro reporte
    if (userReactions[id]?.hasReported) {
      return;
    }
    
    try {
      const reason = prompt('¿Cuál es el motivo de la denuncia?');
      if (reason) {
        const result = await jobsService.report(id, reason);
        console.log('Report response:', result);
        
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
        
        alert('🚨 Denuncia registrada correctamente');
      }
    } catch (err) {
      console.error('Error al reportar:', err);
      alert('Error al registrar denuncia: ' + err.message);
    }
  };

  const handleDelete = async (id, job) => {
    // Solo admin o el creador del formulario pueden eliminar
    const isAdmin = user?.role === 'admin';
    const isCreator = user?.id === job.createdBy;

    if (!isAdmin && !isCreator) {
      alert('⛔ No tienes permiso para eliminar esta oferta de empleo');
      return;
    }

    if (window.confirm('⚠️ ¿Estás seguro de que quieres eliminar esta oferta de empleo? Esta acción no se puede deshacer.')) {
      try {
        await jobsService.delete(id);
        setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('❌ Error al eliminar la oferta de empleo: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className="loading">⏳ Cargando empleos...</div>;
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <div className="header-top">
          <button 
            className="btn-back"
            onClick={() => navigate('/')}
            title="Volver al inicio"
          >
            ← Volver
          </button>
        </div>
        <div className="header-content">
          <h1>🎯 Ofertas de Empleo</h1>
          <p>Encuentra las mejores oportunidades laborales</p>
        </div>
        <button 
          className="btn-primary-large"
          onClick={() => navigate('/jobs/form')}
        >
          ➕ Publicar Empleo
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
          >
            🔄 Reintentar
          </button>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="empty-state">
          <h2>📭 Sin ofertas de empleo aún</h2>
          <p>Sé el primero en publicar una oferta</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/jobs/form')}
          >
            ➕ Publicar Empleo
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {jobs.map((job) => (
            <div key={job.id} className="item-card">
              <div className="card-header">
                <h3>{job.position}</h3>
                <span className="badge">{job.experience}</span>
              </div>

              <div className="card-content">
                <div className="info-row">
                  <span className="label">🏢 Empresa:</span>
                  <span className="value">{job.company}</span>
                </div>

                <div className="info-row">
                  <span className="label">📍 Ubicación:</span>
                  <span className="value">{job.location}</span>
                </div>

                {job.salaryMin && job.salaryMax && (
                  <div className="info-row salary-row">
                    <span className="label">💰 Salario:</span>
                    <span className="value">
                      ${Number(job.salaryMin).toLocaleString()} - ${Number(job.salaryMax).toLocaleString()} {job.currency}
                    </span>
                  </div>
                )}

                <div className="info-row">
                  <span className="label">🎯 Tipo:</span>
                  <span className="value" style={{ textTransform: 'capitalize' }}>{job.jobType}</span>
                </div>

                <div className="info-row">
                  <span className="label">� Experiencia:</span>
                  <span className="value">{job.experience}</span>
                </div>

                {job.requirements && (
                  <div className="info-row">
                    <span className="label">✓ Requisitos:</span>
                    <span className="value">{job.requirements}</span>
                  </div>
                )}

                {job.responsibilities && (
                  <div className="info-row">
                    <span className="label">📋 Responsabilidades:</span>
                    <span className="value">{job.responsibilities}</span>
                  </div>
                )}

                {job.benefits && (
                  <div className="info-row">
                    <span className="label">🎁 Beneficios:</span>
                    <span className="value">{job.benefits}</span>
                  </div>
                )}

                <div className="info-row">
                  <span className="label">📧 Email:</span>
                  <span className="value">{job.contactEmail}</span>
                </div>

                {job.description && (
                  <div className="description">
                    <p>{job.description}</p>
                  </div>
                )}

                <div className="card-stats">
                  <span>👁️ {job.views} vistas</span>
                  <span>❤️ {job.likes} likes</span>
                  <span>🚨 {job.reports} reportes</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className={`btn-like ${userReactions[job.id]?.hasLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(job.id)}
                  title={userReactions[job.id]?.hasLiked ? 'Remover like' : 'Me gusta'}
                >
                  {userReactions[job.id]?.hasLiked ? '❤️ Liked' : '🤍 Like'}
                </button>
                <button
                  className={`btn-report ${userReactions[job.id]?.hasReported ? 'reported' : ''}`}
                  onClick={() => handleReport(job.id)}
                  title={userReactions[job.id]?.hasReported ? 'Ya denunciado' : 'Reportar'}
                  disabled={userReactions[job.id]?.hasReported}
                >
                  🚨 {userReactions[job.id]?.hasReported ? 'Denunciado' : 'Reportar'}
                </button>
                <button
                  className="btn-contact"
                  onClick={() => {
                    // Intenta múltiples fuentes de email
                    const email = job.contactEmail 
                      || job.email 
                      || job.postedByEmail
                      || job.postedBy?.email;
                    
                    console.log('📧 Trying email:', email, 'from job:', job);
                    
                    if (email && String(email).trim()) {
                      window.location.href = `mailto:${String(email).trim()}`;
                    } else {
                      console.warn('❌ No email found in job object:', job);
                      alert('❌ Email no disponible para este contacto. Por favor contacta al administrador.');
                    }
                  }}
                  title="Contactar con el empleador"
                >
                  ✉️ Contactar
                </button>
                {(user?.role === 'admin' || user?.id === job.createdBy) && (
                  <button
                    onClick={() => handleDelete(job.id, job)}
                    title={user?.role === 'admin' ? 'Eliminar oferta de empleo (admin)' : 'Eliminar tu oferta de empleo'}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#ff5252'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
                    style={{
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    🗑️ Eliminar
                  </button>
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
