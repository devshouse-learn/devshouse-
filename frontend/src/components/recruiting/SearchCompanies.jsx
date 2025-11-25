import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../jobs/JobsList.css';

const SearchCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      // Por ahora, simulamos con datos vacíos
      setCompanies([]);
      setError('');
    } catch (err) {
      setError('Error al cargar las empresas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>⏳ Cargando empresas...</p>
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
          <h1>🏢 Buscar Empresas</h1>
          <p>Descubre empresas y oportunidades</p>
        </div>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      {companies.length === 0 ? (
        <div className="empty-state">
          <h2>📭 Sin empresas registradas aún</h2>
          <p>Sé el primero en registrar tu empresa</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/recruiting/publish-job')}
          >
            ➕ Registra la tuya
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {companies.map((company) => (
            <div key={company.id} className="item-card">
              <div className="card-header">
                <h3>{company.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCompanies;
