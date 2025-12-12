import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agreementsService } from '../../services/registration.service';
import { useAuth } from '../../context/AuthContext';
import './AgreementsList.css';

const AgreementsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReactions, setUserReactions] = useState({}); // Rastrear reacciones del usuario
  const [openMenuId, setOpenMenuId] = useState(null); // Rastrear cuál menú está abierto

  useEffect(() => {
    loadAgreements();
  }, []);

  const loadAgreements = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await agreementsService.getAll();
      console.log('Response from API:', response);
      const loadedAgreements = response.data || [];
      setAgreements(loadedAgreements);
      
      // Cargar reacciones del usuario para cada item
      const reactions = {};
      for (const agreement of loadedAgreements) {
        const userReaction = await agreementsService.getUserReactions(agreement.id);
        reactions[agreement.id] = userReaction;
      }
      setUserReactions(reactions);
    } catch (err) {
      console.error('Error loading agreements:', err);
      if (err.message.includes('Failed to fetch')) {
        setError(' No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      } else if (err.message.includes('timeout')) {
        setError(' La conexión tardó demasiado. Por favor, intenta de nuevo.');
      } else {
        setError(' Error al cargar los convenios. Por favor, intenta de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const result = await agreementsService.like(id);
      console.log('Like response:', result);
      
      // Actualizar contadores según la acción
      const action = result.action || 'liked'; // 'liked' o 'unliked'
      const isLiking = action === 'liked';
      
      setAgreements(prevAgreements => 
        prevAgreements.map(agreement => 
          agreement.id === id 
            ? { ...agreement, likes: isLiking ? (agreement.likes || 0) + 1 : (agreement.likes || 1) - 1 }
            : agreement
        )
      );
      
      // Actualizar estado de reacciones
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
        const result = await agreementsService.report(id, reason);
        console.log('Report response:', result);
        
        // Actualizar contadores
        setAgreements(prevAgreements => 
          prevAgreements.map(agreement => 
            agreement.id === id 
              ? { ...agreement, reports: (agreement.reports || 0) + 1 }
              : agreement
          )
        );
        
        // Actualizar estado de reacciones
        setUserReactions(prev => ({
          ...prev,
          [id]: { ...prev[id], hasReported: true }
        }));
      }
    } catch (err) {
      console.error('Error al reportar:', err);
      alert('Error al registrar denuncia: ' + err.message);
    }
  };

  const handleDelete = async (id, agreement) => {
    // Solo admin o el creador del formulario pueden eliminar
    const isAdmin = user?.role === 'admin';
    const isCreator = user?.id === agreement.createdBy;

    if (!isAdmin && !isCreator) {
      alert(' No tienes permiso para eliminar este convenio');
      return;
    }

    if (window.confirm(' ¿Estás seguro de que quieres eliminar este convenio? Esta acción no se puede deshacer.')) {
      try {
        await agreementsService.delete(id);
        console.log(' Convenio eliminado');
        setAgreements(prevAgreements => prevAgreements.filter(a => a.id !== id));
      } catch (err) {
        console.error('Error al eliminar convenio:', err);
        alert(' Error al eliminar el convenio: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>⏳ Cargando convenios...</p>
        <p style={{ fontSize: '12px', color: '#666' }}>Conectando a {import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}</p>
      </div>
    );
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
          <h1> Convenios Educativos</h1>
          <p>Descubre instituciones educativas que buscan convenios con empresas</p>
        </div>
      </div>

      <button 
        className="btn-primary-large"
        onClick={() => navigate('/agreements/form')}
      >
         Registrar el tuyo
      </button>

      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={loadAgreements}
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

      {agreements.length === 0 ? (
        <div className="empty-state">
          <h2> Sin convenios aún</h2>
          <p>Sé el primero en registrar un convenio educativo</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/agreements/form')}
          >
             Registrar Convenio
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {agreements.map((agreement) => (
            <div key={agreement.id} className="item-card">
              <div className="card-header">
                <div className="header-title">
                  <h3>{agreement.schoolName}</h3>
                  <span className="badge">{agreement.schoolType}</span>
                </div>
                <div className="header-menu">
                  <button
                    className="menu-btn"
                    onClick={() => setOpenMenuId(openMenuId === agreement.id ? null : agreement.id)}
                    title="Más opciones"
                  >
                    ⋮
                  </button>
                  {openMenuId === agreement.id && (
                    <div className="menu-dropdown">
                      <button
                        className="menu-item"
                        onClick={() => {
                          handleReport(agreement.id);
                          setOpenMenuId(null);
                        }}
                        disabled={userReactions[agreement.id]?.hasReported}
                      >
                        {userReactions[agreement.id]?.hasReported ? '🚨 Denunciado' : '🚨 Reportar'}
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
                    <span className="value">{agreement.location}</span>
                  </div>

                  {agreement.level && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📚</span> Nivel:</span>
                      <span className="value">{agreement.level}</span>
                    </div>
                  )}

                  {agreement.areaOfInterest && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">🎯</span> Área:</span>
                      <span className="value">{agreement.areaOfInterest}</span>
                    </div>
                  )}

                  {agreement.studentCount && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">👥</span> Estudiantes:</span>
                      <span className="value">{agreement.studentCount}</span>
                    </div>
                  )}

                  {agreement.establishmentYear && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📅</span> Fundación:</span>
                      <span className="value">{agreement.establishmentYear}</span>
                    </div>
                  )}

                  <div className="info-row">
                    <span className="label"><span className="emoji">📧</span> Email:</span>
                    <span className="value">{agreement.contactEmail}</span>
                  </div>

                  <div className="info-row">
                    <span className="label"><span className="emoji">📱</span> Teléfono:</span>
                    <span className="value">{agreement.contactPhone || 'No disponible'}</span>
                  </div>

                  {agreement.website && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">🌐</span> Web:</span>
                      <span className="value">
                        <a href={agreement.website} target="_blank" rel="noopener noreferrer">
                          {agreement.website}
                        </a>
                      </span>
                    </div>
                  )}

                  {agreement.description && (
                    <div className="info-row description-preview">
                      <span className="label"><span className="emoji">📝</span> Descripción:</span>
                      <span className="value">{agreement.description.substring(0, 100)}{agreement.description.length > 100 ? '...' : ''}</span>
                    </div>
                  )}

                  <div className="info-row">
                    <span className="label"><span className="emoji">⚙️</span> Estado:</span>
                    <span className="value">{agreement.status || 'No especificado'}</span>
                  </div>
                </div>

                <div className="card-stats">
                  <span><span className="emoji">👁️</span> Vistas: {agreement.views || 0}</span>
                  <span><span className="emoji">❤️</span> Likes: {agreement.likes || 0}</span>
                  <span><span className="emoji">🚨</span> Reportes: {agreement.reports || 0}</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className={`btn-like ${userReactions[agreement.id]?.hasLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(agreement.id)}
                  title={userReactions[agreement.id]?.hasLiked ? 'Remover like' : 'Me gusta'}
                >
                  <span className="emoji">🤍</span> {userReactions[agreement.id]?.hasLiked ? 'Liked' : 'Like'}
                </button>
                {(user?.role === 'admin' || user?.id === agreement.createdBy) && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(agreement.id, agreement)}
                    title={user?.role === 'admin' ? 'Eliminar convenio (admin)' : 'Eliminar tu convenio'}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AgreementsList;
