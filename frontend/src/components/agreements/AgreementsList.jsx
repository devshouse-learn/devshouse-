import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agreementsService } from '../../services/registration.service';
import './AgreementsList.css';

const AgreementsList = () => {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReactions, setUserReactions] = useState({}); // Rastrear reacciones del usuario

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
        setError('⚠️ No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      } else if (err.message.includes('timeout')) {
        setError('⚠️ La conexión tardó demasiado. Por favor, intenta de nuevo.');
      } else {
        setError('⚠️ Error al cargar los convenios. Por favor, intenta de nuevo más tarde.');
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
      
      // Mostrar confirmación
      const message = isLiking ? '❤️ Like registrado' : '💔 Like removido';
      alert(message);
    } catch (err) {
      console.error('Error al dar like:', err);
      alert('Error al registrar like: ' + err.message);
    }
  };

  const handleReport = async (id) => {
    // Si ya reportó, mostrar mensaje
    if (userReactions[id]?.hasReported) {
      alert('⚠️ Ya has denunciado este contenido');
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
        
        alert('🚨 Denuncia registrada correctamente');
      }
    } catch (err) {
      console.error('Error al reportar:', err);
      alert('Error al registrar denuncia: ' + err.message);
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
          >
            ← Volver
          </button>
        </div>
        <div className="header-content">
          <h1>📋 Convenios Educativos</h1>
          <p>Descubre instituciones educativas que buscan convenios con empresas</p>
        </div>
        <button 
          className="btn-primary-large"
          onClick={() => navigate('/agreements/form')}
        >
          ➕ Registrar el tuyo
        </button>
      </div>

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
          >
            🔄 Reintentar
          </button>
        </div>
      )}

      {agreements.length === 0 ? (
        <div className="empty-state">
          <h2>📭 Sin convenios aún</h2>
          <p>Sé el primero en registrar un convenio educativo</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/agreements/form')}
          >
            ➕ Registrar Convenio
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {agreements.map((agreement) => (
            <div key={agreement.id} className="item-card">
              <div className="card-header">
                <h3>{agreement.schoolName}</h3>
                <span className="badge">{agreement.schoolType}</span>
              </div>

              <div className="card-content">
                <div className="info-row">
                  <span className="label">📍 Ubicación:</span>
                  <span className="value">{agreement.location}</span>
                </div>

                <div className="info-row">
                  <span className="label">✉️ Email:</span>
                  <span className="value">{agreement.contactEmail}</span>
                </div>

                <div className="info-row">
                  <span className="label">📱 Teléfono:</span>
                  <span className="value">{agreement.contactPhone || 'No disponible'}</span>
                </div>

                <div className="info-row">
                  <span className="label">📅 Estado:</span>
                  <span className="value">{agreement.status || 'No especificado'}</span>
                </div>

                {agreement.description && (
                  <div className="description">
                    <p>{agreement.description}</p>
                  </div>
                )}

                <div className="card-stats">
                  <span>👁️ {agreement.views} vistas</span>
                  <span>❤️ {agreement.likes} likes</span>
                  <span>🚨 {agreement.reports} reportes</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className={`btn-like ${userReactions[agreement.id]?.hasLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(agreement.id)}
                  title={userReactions[agreement.id]?.hasLiked ? 'Remover like' : 'Me gusta'}
                >
                  {userReactions[agreement.id]?.hasLiked ? '❤️ Liked' : '🤍 Like'}
                </button>
                <button
                  className={`btn-report ${userReactions[agreement.id]?.hasReported ? 'reported' : ''}`}
                  onClick={() => handleReport(agreement.id)}
                  title={userReactions[agreement.id]?.hasReported ? 'Ya denunciado' : 'Reportar'}
                  disabled={userReactions[agreement.id]?.hasReported}
                >
                  🚨 {userReactions[agreement.id]?.hasReported ? 'Denunciado' : 'Reportar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgreementsList;
