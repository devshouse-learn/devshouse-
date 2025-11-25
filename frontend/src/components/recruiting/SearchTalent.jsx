import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../job-search/JobSearchList.css';

const SearchTalent = () => {
  const navigate = useNavigate();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTalents();
  }, []);

  const loadTalents = async () => {
    try {
      setLoading(true);
      // Por ahora, simulamos con datos vacíos
      setTalents([]);
      setError('');
    } catch (err) {
      setError('Error al cargar los talentos');
      console.error(err);
    } finally {
      setLoading(false);
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
          >
            ← Volver
          </button>
        </div>
        <div className="header-content">
          <h1>👤 Buscar Talentos</h1>
          <p>Encuentra profesionales capacitados</p>
        </div>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      {talents.length === 0 ? (
        <div className="empty-state">
          <h2>📭 Sin talentos registrados aún</h2>
          <p>Sé el primero en registrar tu perfil profesional</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/recruiting/publish-profile')}
          >
            ➕ Registra el tuyo
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {talents.map((talent) => (
            <div key={talent.id} className="item-card">
              <div className="card-header">
                <h3>{talent.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchTalent;
