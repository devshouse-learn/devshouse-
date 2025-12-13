import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { venturesService } from '../../services/registration.service';
import { useAuth } from '../../context/AuthContext';
import './VenturesList.css';

const VenturesList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ventures, setVentures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReactions, setUserReactions] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const getCompanyName = (venture) => venture.company_name || venture.companyName || 'Emprendimiento';
  const getLogoUrl = (venture) => venture.logoUrl || venture.logo_url || venture.logo || '';
  const getInitials = (value = '') =>
    value
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'EM';

  useEffect(() => {
    loadVentures();
  }, []);

  const loadVentures = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await venturesService.getAll();
      const loadedVentures = response.data || [];
      console.log(' Ventures loaded:', loadedVentures);
      setVentures(loadedVentures);
      
      // Cargar reacciones del usuario
      const reactions = {};
      for (const venture of loadedVentures) {
        const userReaction = await venturesService.getUserReactions(venture.id);
        reactions[venture.id] = userReaction;
      }
      setUserReactions(reactions);
    } catch (err) {
      console.error('Error loading ventures:', err);
      if (err.message.includes('Failed to fetch')) {
        setError(' No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      } else if (err.message.includes('timeout')) {
        setError(' La conexión tardó demasiado. Por favor, intenta de nuevo.');
      } else {
        setError(' Error al cargar los emprendimientos. Por favor, intenta de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const result = await venturesService.like(id);
      console.log('Like response:', result);
      
      const isLiking = result.action === 'liked';
      setVentures(prevVentures => 
        prevVentures.map(venture => 
          venture.id === id 
            ? { ...venture, likes: isLiking ? (venture.likes || 0) + 1 : (venture.likes || 1) - 1 }
            : venture
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
        const result = await venturesService.report(id, reason);
        console.log('Report response:', result);
        
        setVentures(prevVentures => 
          prevVentures.map(venture => 
            venture.id === id 
              ? { ...venture, reports: (venture.reports || 0) + 1 }
              : venture
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

  const handleDelete = async (id, venture) => {
    // Solo admin o el creador del formulario pueden eliminar
    const isAdmin = user?.role === 'admin';
    const isCreator = user?.id === venture.createdBy;

    if (!isAdmin && !isCreator) {
      alert(' No tienes permiso para eliminar este emprendimiento');
      return;
    }

    if (window.confirm(' ¿Estás seguro de que quieres eliminar este emprendimiento? Esta acción no se puede deshacer.')) {
      try {
        await venturesService.delete(id);
        console.log(' Emprendimiento eliminado');
        setVentures(prevVentures => prevVentures.filter(v => v.id !== id));
      } catch (err) {
        console.error('Error al eliminar emprendimiento:', err);
        alert(' Error al eliminar el emprendimiento: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className="loading">⏳ Cargando emprendimientos...</div>;
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <div className="header-top">
          <button 
            className="btn-back"
            onClick={() => navigate('/')}
            title="Volver al inicio"
            style={{ position: 'fixed', top: '90px', left: '20px', zIndex: 100 }}
          ><span className="emoji">↩️</span> Volver </button>
          <button 
            className="btn-primary-large"
            onClick={() => navigate('/ventures/form')}
          >
             Registrar el tuyo
          </button>
        </div>
        <div className="header-content">
          <h1> Emprendimientos</h1>
          <p>Descubre startups y emprendimientos</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={loadVentures}
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

      {ventures.length === 0 ? (
        <div className="empty-state">
          <h2> Sin emprendimientos aún</h2>
          <p>Sé el primero en registrar tu emprendimiento</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/ventures/form')}
          >
             Registrar Emprendimiento
          </button>
        </div>
      ) : (
        <div className="items-grid">
            {ventures.map((venture) => {
              const companyName = getCompanyName(venture);
              const logoUrl = getLogoUrl(venture);
              const logoFallback = getInitials(companyName);

              return (
                <div key={venture.id} className="item-card">
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
                        <h3>{companyName}</h3>
                      </div>
                      <span className="badge">{venture.investment_stage}</span>
                    </div>
                <div className="header-menu">
                  <button
                    className="menu-btn"
                    onClick={() => setOpenMenuId(openMenuId === venture.id ? null : venture.id)}
                    title="Más opciones"
                  >
                    ⋮
                  </button>
                  {openMenuId === venture.id && (
                    <div className="menu-dropdown">
                      <button
                        className="menu-item"
                        onClick={() => {
                          handleReport(venture.id);
                          setOpenMenuId(null);
                        }}
                        disabled={userReactions[venture.id]?.hasReported}
                      >
                        {userReactions[venture.id]?.hasReported ? '🚨 Denunciado' : '🚨 Reportar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

                <div className="card-content">
                <div className="card-body">
                  {/* Información Básica */}
                  <div className="info-row">
                    <span className="label"><span className="emoji">🏭</span> Industria:</span>
                    <span className="value">{venture.industry}</span>
                  </div>

                  <div className="info-row">
                    <span className="label"><span className="emoji">📍</span> Ubicación:</span>
                    <span className="value">{venture.location}</span>
                  </div>

                  <div className="info-row">
                    <span className="label"><span className="emoji">👤</span> Fundador:</span>
                    <span className="value">{venture.founderName || venture.founder_name || 'No disponible'}</span>
                  </div>

                  {(venture.founded_year || venture.foundedYear) && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📅</span> Año:</span>
                      <span className="value">{venture.founded_year || venture.foundedYear}</span>
                    </div>
                  )}

                  <div className="info-row">
                    <span className="label"><span className="emoji">📈</span> Etapa:</span>
                    <span className="value">{venture.investment_stage}</span>
                  </div>

                  {(venture.funding_needed || venture.fundingNeeded) && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">💰</span> Financiamiento:</span>
                      <span className="value">{venture.funding_needed || venture.fundingNeeded}</span>
                    </div>
                  )}

                  {(venture.team_size || venture.teamSize) && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">👥</span> Equipo:</span>
                      <span className="value">{venture.team_size || venture.teamSize}</span>
                    </div>
                  )}

                  {(venture.revenue_model || venture.revenueModel) && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">💼</span> Modelo:</span>
                      <span className="value">{venture.revenue_model || venture.revenueModel}</span>
                    </div>
                  )}

                  <div className="info-row">
                    <span className="label"><span className="emoji">📧</span> Email:</span>
                    <span className="value">{venture.founderEmail}</span>
                  </div>

                  {venture.website && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">🌐</span> Web:</span>
                      <span className="value">
                        <a href={venture.website} target="_blank" rel="noopener noreferrer">
                          {venture.website}
                        </a>
                      </span>
                    </div>
                  )}

                  {venture.description && (
                    <div className="info-row description-preview">
                      <span className="label"><span className="emoji">📝</span> Descripción:</span>
                      <span className="value">{venture.description.substring(0, 100)}{venture.description.length > 100 ? '...' : ''}</span>
                    </div>
                  )}
                </div>

                <div className="card-stats">
                  <span><span className="emoji">👁️</span> Vistas: {venture.views || 0}</span>
                  <span><span className="emoji">❤️</span> Likes: {venture.likes || 0}</span>
                  <span><span className="emoji">🚨</span> Reportes: {venture.reports || 0}</span>
                </div>
              </div>

                <div className="card-actions">
                <button
                  className={`btn-like ${userReactions[venture.id]?.hasLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(venture.id)}
                  title={userReactions[venture.id]?.hasLiked ? 'Remover like' : 'Me gusta'}
                >
                  <span className="emoji">🤍</span> {userReactions[venture.id]?.hasLiked ? 'Liked' : 'Like'}
                </button>
                <button
                  className="btn-contact"
                  onClick={() => {
                    // Intenta múltiples fuentes de email
                    const email = venture.founderEmail 
                      || venture.contact?.email 
                      || venture.email 
                      || venture.contactEmail
                      || venture.contactPerson?.email;
                    
                    console.log(' Trying email:', email, 'from venture:', venture);
                    
                    if (email && String(email).trim()) {
                      window.location.href = `mailto:${String(email).trim()}`;
                    } else {
                      console.warn(' No email found in venture object:', venture);
                      alert(' Email no disponible para este contacto. Por favor contacta al administrador.');
                    }
                  }}
                  title="Contactar con el fundador"
                ><span className="emoji">📬</span> Contactar </button>
                {(user?.role === 'admin' || user?.id === venture.createdBy) && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(venture.id, venture)}
                    title={user?.role === 'admin' ? 'Eliminar emprendimiento (admin)' : 'Eliminar tu emprendimiento'}
                    style={{
                      background: 'transparent',
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

export default VenturesList;
