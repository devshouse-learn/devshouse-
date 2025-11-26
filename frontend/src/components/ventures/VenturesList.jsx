import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { venturesService } from '../../services/registration.service';
import './VenturesList.css';

const VenturesList = () => {
  const navigate = useNavigate();
  const [ventures, setVentures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReactions, setUserReactions] = useState({});

  useEffect(() => {
    loadVentures();
  }, []);

  const loadVentures = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await venturesService.getAll();
      const loadedVentures = response.data || [];
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
        setError('⚠️ No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      } else if (err.message.includes('timeout')) {
        setError('⚠️ La conexión tardó demasiado. Por favor, intenta de nuevo.');
      } else {
        setError('⚠️ Error al cargar los emprendimientos. Por favor, intenta de nuevo más tarde.');
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
        
        alert('🚨 Denuncia registrada correctamente');
      }
    } catch (err) {
      console.error('Error al reportar:', err);
      alert('Error al registrar denuncia: ' + err.message);
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
          >
            ← Volver
          </button>
        </div>
        <div className="header-content">
          <h1>🚀 Emprendimientos</h1>
          <p>Descubre startups y emprendimientos en busca de talento</p>
        </div>
        <button 
          className="btn-primary-large"
          onClick={() => navigate('/ventures/form')}
        >
          ➕ Registrar el tuyo
        </button>
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
          >
            🔄 Reintentar
          </button>
        </div>
      )}

      {ventures.length === 0 ? (
        <div className="empty-state">
          <h2>📭 Sin emprendimientos aún</h2>
          <p>Sé el primero en registrar tu emprendimiento</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/ventures/form')}
          >
            ➕ Registrar Emprendimiento
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {ventures.map((venture) => (
            <div key={venture.id} className="item-card">
              <div className="card-header">
                <h3>{venture.companyName}</h3>
                <span className="badge">{venture.investmentStage}</span>
              </div>

              <div className="card-content">
                <div className="info-row">
                  <span className="label">🏢 Industria:</span>
                  <span className="value">{venture.industry}</span>
                </div>

                <div className="info-row">
                  <span className="label">📍 Ubicación:</span>
                  <span className="value">{venture.location}</span>
                </div>

                <div className="info-row">
                  <span className="label">✉️ Email:</span>
                  <span className="value">{venture.founderEmail}</span>
                </div>

                <div className="info-row">
                  <span className="label">👤 Fundador:</span>
                  <span className="value">{venture.founderName || 'No disponible'}</span>
                </div>

                {venture.website && (
                  <div className="info-row">
                    <span className="label">🌐 Web:</span>
                    <span className="value">
                      <a href={venture.website} target="_blank" rel="noopener noreferrer">
                        {venture.website}
                      </a>
                    </span>
                  </div>
                )}

                {venture.description && (
                  <div className="description">
                    <p>{venture.description}</p>
                  </div>
                )}

                <div className="card-stats">
                  <span>👁️ {venture.views} vistas</span>
                  <span>❤️ {venture.likes} likes</span>
                  <span>🚨 {venture.reports} reportes</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className={`btn-like ${userReactions[venture.id]?.hasLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(venture.id)}
                  title={userReactions[venture.id]?.hasLiked ? 'Remover like' : 'Me gusta'}
                >
                  {userReactions[venture.id]?.hasLiked ? '❤️ Liked' : '🤍 Like'}
                </button>
                <button
                  className={`btn-report ${userReactions[venture.id]?.hasReported ? 'reported' : ''}`}
                  onClick={() => handleReport(venture.id)}
                  title={userReactions[venture.id]?.hasReported ? 'Ya denunciado' : 'Reportar'}
                  disabled={userReactions[venture.id]?.hasReported}
                >
                  🚨 {userReactions[venture.id]?.hasReported ? 'Denunciado' : 'Reportar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenturesList;
