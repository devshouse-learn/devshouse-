import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidatesService } from '../../services/registration.service';
import { useAuth } from '../../context/AuthContext';
import '../job-search/JobSearchList.css';

const SearchTalent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReactions, setUserReactions] = useState({});

  useEffect(() => {
    loadTalents();
  }, []);

  const loadTalents = async () => {
    try {
      setLoading(true);
      console.log(' Cargando talentos desde API...');
      const response = await candidatesService.getAll();
      console.log(' Respuesta del API:', response);
      const loadedTalents = response.data || [];
      console.log(' Talentos cargados:', loadedTalents);
      setTalents(loadedTalents);
      
      // Cargar reacciones del usuario
      const reactions = {};
      for (const talent of loadedTalents) {
        const userReaction = await candidatesService.getUserReactions(talent.id);
        reactions[talent.id] = userReaction;
      }
      setUserReactions(reactions);
      setError('');
    } catch (err) {
      console.error(' Error al cargar talentos:', err);
      setError(' Error al cargar los talentos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const result = await candidatesService.like(id);
      console.log('Like response:', result);
      
      const isLiking = result.action === 'liked';
      setUserReactions((prev) => ({
        ...prev,
        [id]: { ...prev[id], hasLiked: isLiking },
      }));
      
      // Actualizar el contador de likes
      setTalents((prev) =>
        prev.map((talent) =>
          talent.id === id
            ? {
                ...talent,
                likes: isLiking ? (talent.likes || 0) + 1 : Math.max(0, (talent.likes || 0) - 1),
              }
            : talent
        )
      );
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleReport = async (id, reason) => {
    try {
      const result = await candidatesService.report(id, reason);
      console.log('Report response:', result);
      
      const isReporting = result.action === 'reported';
      setUserReactions((prev) => ({
        ...prev,
        [id]: { ...prev[id], hasReported: isReporting },
      }));
      
      // Actualizar el contador de reportes
      setTalents((prev) =>
        prev.map((talent) =>
          talent.id === id
            ? {
                ...talent,
                reports: isReporting ? (talent.reports || 0) + 1 : Math.max(0, (talent.reports || 0) - 1),
              }
            : talent
        )
      );
    } catch (error) {
      console.error('Error al reportar:', error);
    }
  };

  const handleDelete = async (id, talent) => {
    // Solo admin o el creador del perfil pueden eliminar
    const isAdmin = user?.role === 'admin';
    const isCreator = user?.id === talent.createdBy;

    if (!isAdmin && !isCreator) {
      alert(' No tienes permiso para eliminar este perfil');
      return;
    }

    if (window.confirm(' ¿Estás seguro de que quieres eliminar este perfil? Esta acción no se puede deshacer.')) {
      try {
        await candidatesService.delete(id);
        console.log(' Perfil de talento eliminado');
        setTalents(prevTalents => prevTalents.filter(t => t.id !== id));
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert(' Error al eliminar el perfil: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>⏳ Cargando talentos...</p>
      </div>
    );
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
          <h1> Buscar Talentos</h1>
          <p>Encuentra profesionales capacitados</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={loadTalents}
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

      {talents.length === 0 ? (
        <div className="empty-state">
          <h2> Sin talentos registrados aún</h2>
          <p>Sé el primero en registrar tu perfil profesional</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/recruiting/publish-profile')}
          >
             Registra el tuyo
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {talents.map((talent) => (
            <div key={talent.id} className="item-card">
              <div className="card-header">
                <h3>{talent.name || 'Talento'}</h3>
                <span className="badge">{talent.bio ? talent.bio.substring(0, 30) + '...' : 'Profesional'}</span>
              </div>

              <div className="card-content">
                <div className="card-body">
                  {/* Información Básica */}
                  {talent.profession && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">💼</span> Profesión:</span>
                      <span className="value">{talent.profession}</span>
                    </div>
                  )}

                  {talent.experience && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📈</span> Experiencia:</span>
                      <span className="value">{talent.experience}</span>
                    </div>
                  )}

                  {talent.location && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📍</span> Ubicación:</span>
                      <span className="value">{talent.location}</span>
                    </div>
                  )}

                  {talent.phone && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📱</span> Teléfono:</span>
                      <span className="value">{talent.phone}</span>
                    </div>
                  )}

                  {talent.email && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📧</span> Email:</span>
                      <span className="value">
                        <a href={`mailto:${talent.email}`} style={{ color: '#1a73e8', textDecoration: 'none' }}>
                          {talent.email}
                        </a>
                      </span>
                    </div>
                  )}

                  {talent.education && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">🎓</span> Educación:</span>
                      <span className="value">{talent.education}</span>
                    </div>
                  )}

                  {talent.salaryExpectation && (
                    <div className="info-row salary-row">
                      <span className="label"><span className="emoji">💰</span> Salario esperado:</span>
                      <span className="value">{talent.salaryExpectation}</span>
                    </div>
                  )}

                  {talent.technologies && talent.technologies.length > 0 && (
                    <div className="info-row requirements-preview">
                      <span className="label"><span className="emoji">✅</span> Tecnologías:</span>
                      <span className="value">
                        {Array.isArray(talent.technologies) 
                          ? talent.technologies.slice(0, 3).join(', ')
                          : talent.technologies
                        }
                        {Array.isArray(talent.technologies) && talent.technologies.length > 3 ? '...' : ''}
                      </span>
                    </div>
                  )}

                  {talent.skills && (
                    <div className="info-row requirements-preview">
                      <span className="label"><span className="emoji">⚡</span> Habilidades:</span>
                      <span className="value">
                        {typeof talent.skills === 'string' 
                          ? talent.skills.substring(0, 100)
                          : Array.isArray(talent.skills)
                          ? talent.skills.slice(0, 3).join(', ')
                          : 'No especificadas'
                        }
                        {typeof talent.skills === 'string' && talent.skills.length > 100 ? '...' : ''}
                        {Array.isArray(talent.skills) && talent.skills.length > 3 ? '...' : ''}
                      </span>
                    </div>
                  )}

                  {talent.bio && (
                    <div className="info-row description-preview">
                      <span className="label"><span className="emoji">📝</span> Descripción:</span>
                      <span className="value">{talent.bio.substring(0, 100)}{talent.bio.length > 100 ? '...' : ''}</span>
                    </div>
                  )}

                  {talent.availability && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📅</span> Disponibilidad:</span>
                      <span className="value">{talent.availability}</span>
                    </div>
                  )}

                  {talent.portfolio && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">🌐</span> Portfolio:</span>
                      <span className="value">
                        <a href={talent.portfolio} target="_blank" rel="noopener noreferrer">
                          Ver portafolio
                        </a>
                      </span>
                    </div>
                  )}
                </div>

                <div className="card-stats">
                  <span><span className="emoji">👁️</span> Vistas: {talent.views || 0}</span>
                  <span><span className="emoji">❤️</span> Likes: {talent.likes || 0}</span>
                  <span><span className="emoji">🚨</span> Reportes: {talent.reports || 0}</span>
                </div>
              </div>

                <div className="card-actions">
                  <button
                    className={`btn-like ${userReactions[talent.id]?.hasLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(talent.id)}
                    title={userReactions[talent.id]?.hasLiked ? 'Quitar like' : 'Dar like'}
                  >
                    <span className="emoji">🤍</span> {userReactions[talent.id]?.hasLiked ? 'Liked' : 'Like'}
                  </button>
                  <button
                    className={`btn-report ${userReactions[talent.id]?.hasReported ? 'reported' : ''}`}
                    onClick={() => handleReport(talent.id, 'Contenido inapropiado')}
                    title={userReactions[talent.id]?.hasReported ? 'Ya reportado' : 'Reportar'}
                  >
                    {userReactions[talent.id]?.hasReported ? ' Reported' : ' Report'}
                  </button>
                  <button
                    className="btn-contact"
                    onClick={() => {
                      // Intenta múltiples fuentes de email
                      const email = talent.email 
                        || talent.contactEmail 
                        || talent.emailProfile
                        || talent.contact?.email;
                      
                      console.log(' Trying email:', email, 'from talent:', talent);
                      
                      if (email && String(email).trim()) {
                        window.location.href = `mailto:${String(email).trim()}`;
                      } else {
                        console.warn(' No email found in talent object:', talent);
                        alert(' Email no disponible para este contacto. Por favor contacta al administrador.');
                      }
                    }}
                    title="Contactar con el candidato"
                  ><span className="emoji">📬</span> Contactar </button>
                  {(user?.role === 'admin' || user?.id === talent.createdBy) && (
                    <button
                      onClick={() => handleDelete(talent.id, talent)}
                      title={user?.role === 'admin' ? 'Eliminar perfil (admin)' : 'Eliminar tu perfil'}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchTalent;
