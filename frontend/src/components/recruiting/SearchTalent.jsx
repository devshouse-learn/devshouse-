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
  const [openMenuId, setOpenMenuId] = useState(null);

  const getInitials = (name = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'EM';

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
      <button 
        className="btn-back"
        onClick={() => navigate('/recruiting')}
        title="Volver al Centro de Reclutamiento"
        style={{ position: 'fixed', top: '90px', left: '20px', zIndex: 100 }}
      ><span className="emoji">↩️</span> Volver </button>

      <div className="list-header">
        <div className="header-content">
          <button 
            className="btn-primary"
            onClick={() => navigate('/recruiting/publish-profile')}
            title="Registra tu perfil"
            style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}
          >
             Registra el tuyo
          </button>
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
                <div className="header-title">
                  <div className="talent-photo">
                    {talent.profile_photo ? (
                      <img src={talent.profile_photo} alt={talent.name || 'Talento'} />
                    ) : (
                      <span>{getInitials(talent.name || talent.full_name)}</span>
                    )}
                  </div>
                  <div className="header-info">
                    <h3>{talent.name || talent.full_name || 'Talento'}</h3>
                  </div>
                </div>
                <div className="header-menu">
                  <button
                    className="menu-btn"
                    onClick={() => setOpenMenuId(openMenuId === talent.id ? null : talent.id)}
                    title="Más opciones"
                  >
                    ⋮
                  </button>
                  {openMenuId === talent.id && (
                    <div className="menu-dropdown">
                      <button
                        className="menu-item"
                        onClick={() => {
                          handleReport(talent.id, 'Contenido inapropiado');
                          setOpenMenuId(null);
                        }}
                        disabled={userReactions[talent.id]?.hasReported}
                      >
                        {userReactions[talent.id]?.hasReported ? '🚨 Denunciado' : '🚨 Reportar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-content">
                <div className="card-body">
                  {/* Información Básica */}
                  {(talent.profession || talent.professional_title) && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">💼</span> Profesión:</span>
                      <span className="value">{talent.profession || talent.professional_title}</span>
                    </div>
                  )}

                  {(talent.experience || talent.years_experience) && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📈</span> Experiencia:</span>
                      <span className="value">{talent.experience || `${talent.years_experience} años`}</span>
                    </div>
                  )}

                  {talent.location && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📍</span> Ubicación:</span>
                      <span className="value">{talent.location}</span>
                    </div>
                  )}

                  {(talent.phone || talent.contact_phone) && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📱</span> Teléfono:</span>
                      <span className="value">{talent.phone || talent.contact_phone}</span>
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

                  {(talent.education || talent.education_level) && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">🎓</span> Educación:</span>
                      <span className="value">{talent.education || talent.education_level}</span>
                    </div>
                  )}

                  {(talent.salaryExpectation || (talent.salary_expectation_min && talent.salary_expectation_max)) && (
                    <div className="info-row salary-row">
                      <span className="label"><span className="emoji">💰</span> Salario esperado:</span>
                      <span className="value">
                        {talent.salaryExpectation 
                          ? talent.salaryExpectation
                          : `${talent.currency || 'USD'} ${talent.salary_expectation_min?.toLocaleString()} - ${talent.salary_expectation_max?.toLocaleString()}`
                        }
                      </span>
                    </div>
                  )}

                  {(talent.technologies || talent.skills) && (
                    <div className="info-row requirements-preview">
                      <span className="label"><span className="emoji">✅</span> Tecnologías:</span>
                      <span className="value">
                        {Array.isArray(talent.technologies || talent.skills) 
                          ? (talent.technologies || talent.skills).slice(0, 3).join(', ')
                          : (talent.technologies || talent.skills)
                        }
                        {Array.isArray(talent.technologies || talent.skills) && (talent.technologies || talent.skills).length > 3 ? '...' : ''}
                      </span>
                    </div>
                  )}

                  {(talent.skills && !talent.technologies || talent.skills) && (
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

                  {(talent.bio || talent.professional_summary) && (
                    <div className="info-row description-preview">
                      <span className="label"><span className="emoji">📝</span> Descripción:</span>
                      <span className="value">
                        {((talent.bio || talent.professional_summary).substring(0, 100))}
                        {(talent.bio || talent.professional_summary).length > 100 ? '...' : ''}
                      </span>
                    </div>
                  )}

                  {talent.availability && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📅</span> Disponibilidad:</span>
                      <span className="value">{talent.availability}</span>
                    </div>
                  )}

                  {(talent.portfolio || talent.portfolio_url) && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">🌐</span> Portfolio:</span>
                      <span className="value">
                        <a href={talent.portfolio || talent.portfolio_url} target="_blank" rel="noopener noreferrer">
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
                  className="btn-contact"
                  onClick={() => {
                    const email = talent.email 
                      || talent.contactEmail 
                      || talent.emailProfile
                      || talent.contact?.email;
                    
                    if (email && String(email).trim()) {
                      window.location.href = `mailto:${String(email).trim()}`;
                    } else {
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
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchTalent;
