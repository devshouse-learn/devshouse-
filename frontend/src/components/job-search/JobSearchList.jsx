import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidatesService } from '../../services/registration.service';
import './JobSearchList.css';

const JobSearchList = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReactions, setUserReactions] = useState({});

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError('');
      console.log(' Cargando candidatos desde API...');
      const response = await candidatesService.getAll();
      console.log(' Respuesta del API:', response);
      const loadedCandidates = response.data || [];
      console.log(' Candidatos cargados:', loadedCandidates);
      setCandidates(loadedCandidates);
      
      // Cargar reacciones del usuario
      const reactions = {};
      for (const candidate of loadedCandidates) {
        const userReaction = await candidatesService.getUserReactions(candidate.id);
        reactions[candidate.id] = userReaction;
      }
      setUserReactions(reactions);
      console.log(' Candidatos y reacciones cargados exitosamente');
    } catch (err) {
      console.error(' Error loading candidates:', err);
      if (err.message.includes('Failed to fetch')) {
        setError(' No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      } else if (err.message.includes('timeout')) {
        setError(' La conexión tardó demasiado. Por favor, intenta de nuevo.');
      } else {
        setError(' Error al cargar los candidatos. Por favor, intenta de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const result = await candidatesService.like(id);
      console.log('Like response:', result);
      
      const isLiking = result.action === 'liked';
      setCandidates(prevCandidates => 
        prevCandidates.map(candidate => 
          candidate.id === id 
            ? { ...candidate, likes: isLiking ? (candidate.likes || 0) + 1 : (candidate.likes || 1) - 1 }
            : candidate
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
        const result = await candidatesService.report(id, reason);
        console.log('Report response:', result);
        
        setCandidates(prevCandidates => 
          prevCandidates.map(candidate => 
            candidate.id === id 
              ? { ...candidate, reports: (candidate.reports || 0) + 1 }
              : candidate
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
      alert('Error al registrar denuncia: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">⏳ Cargando candidatos...</div>;
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <div className="header-top">
          <button 
            className="btn-back"
            onClick={() => navigate('/')}
            title="Volver al inicio"
          ><span className="emoji">↩️</span> Volver </button>
        </div>
        <div className="header-content">
          <h1> Buscar Empleo</h1>
          <p>Encuentra candidatos talentosos o publica tu perfil profesional</p>
        </div>
      </div>

      <button 
        className="btn-primary-large"
        onClick={() => navigate('/recruiting/publish-profile')}
      >
         Registrar Perfil
      </button>

      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={loadCandidates}
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

      {candidates.length === 0 ? (
        <div className="empty-state">
          <h2> Sin perfiles de candidatos aún</h2>
          <p>Sé el primero en registrar tu perfil profesional</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/recruiting/publish-profile')}
          >
             Registrar Perfil
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="item-card">
              <div className="card-header">
                <h3>{candidate.name || 'Candidato'}</h3>
                <span className="badge">{candidate.profession || 'Profesional'}</span>
              </div>

              <div className="card-content">
                {candidate.email && (
                  <div className="info-row">
                    <span className="label"><span className="emoji">📧</span> Email:</span>
                    <span className="value">{candidate.email}</span>
                  </div>
                )}

                {candidate.phone && (
                  <div className="info-row">
                    <span className="label"><span className="emoji">📱</span> Teléfono:</span>
                    <span className="value">{candidate.phone}</span>
                  </div>
                )}

                {candidate.location && (
                  <div className="info-row">
                    <span className="label"><span className="emoji">📍</span> Ubicación:</span>
                    <span className="value">{candidate.location}</span>
                  </div>
                )}

                {candidate.salary_expectation && (
                  <div className="info-row">
                    <span className="label"> Salario Esperado:</span>
                    <span className="value">{candidate.salary_expectation}</span>
                  </div>
                )}

                {candidate.availability && (
                  <div className="info-row">
                    <span className="label"> Disponibilidad:</span>
                    <span className="value">{candidate.availability}</span>
                  </div>
                )}

                {candidate.experience && (
                  <div className="info-row">
                    <span className="label"><span className="emoji">📈</span> Experiencia:</span>
                    <span className="value">
                      {Array.isArray(candidate.experience) 
                        ? candidate.experience.map((exp, i) => (
                            <div key={i}>{typeof exp === 'object' ? exp.description : exp}</div>
                          ))
                        : candidate.experience}
                    </span>
                  </div>
                )}

                {candidate.skills && (
                  <div className="info-row">
                    <span className="label"> Habilidades:</span>
                    <span className="value">{candidate.skills}</span>
                  </div>
                )}

                {candidate.education && (
                  <div className="info-row">
                    <span className="label"><span className="emoji">🎓</span> Educación:</span>
                    <span className="value">{candidate.education}</span>
                  </div>
                )}

                {candidate.certifications && (
                  <div className="info-row">
                    <span className="label"> Certificaciones:</span>
                    <span className="value">{candidate.certifications}</span>
                  </div>
                )}

                {candidate.resume && (
                  <div className="info-row">
                    <span className="label"> CV:</span>
                    <span className="value">{candidate.resume}</span>
                  </div>
                )}

                {candidate.linkedin && (
                  <div className="info-row">
                    <span className="label"> LinkedIn:</span>
                    <span className="value">
                      <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer">
                        {candidate.linkedin}
                      </a>
                    </span>
                  </div>
                )}

                {candidate.portfolio && (
                  <div className="info-row">
                    <span className="label"> Portafolio:</span>
                    <span className="value">
                      <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer">
                        {candidate.portfolio}
                      </a>
                    </span>
                  </div>
                )}

                {candidate.bio && (
                  <div className="description">
                    <p>{candidate.bio}</p>
                  </div>
                )}

                <div className="card-stats">
                  <span> {candidate.views || 0} vistas</span>
                  <span> {candidate.likes || 0} likes</span>
                  <span> {candidate.reports || 0} reportes</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className={`btn-like ${userReactions[candidate.id]?.hasLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(candidate.id)}
                  title={userReactions[candidate.id]?.hasLiked ? 'Remover like' : 'Me gusta'}
                >
                  {userReactions[candidate.id]?.hasLiked ? ' Liked' : ' Like'}
                </button>
                <button
                  className={`btn-report ${userReactions[candidate.id]?.hasReported ? 'reported' : ''}`}
                  onClick={() => handleReport(candidate.id)}
                  title={userReactions[candidate.id]?.hasReported ? 'Ya denunciado' : 'Reportar'}
                  disabled={userReactions[candidate.id]?.hasReported}
                >
                   {userReactions[candidate.id]?.hasReported ? 'Denunciado' : 'Reportar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSearchList;
