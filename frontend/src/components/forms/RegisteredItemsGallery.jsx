import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { venturesService, jobsService, agreementsService } from '../../services/registration.service';
import './RegisteredItemsGallery.css';

const RegisteredItemsGallery = () => {
  const navigate = useNavigate();
  const [ventures, setVentures] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [venturesRes, jobsRes, agreementsRes] = await Promise.all([
        venturesService.getAll().catch(() => ({ data: [] })),
        jobsService.getAll().catch(() => ({ data: [] })),
        agreementsService.getAll().catch(() => ({ data: [] }))
      ]);

      setVentures((venturesRes.data || []).slice(0, 10));
      setJobs((jobsRes.data || []).slice(0, 10));
      setAgreements((agreementsRes.data || []).slice(0, 10));
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">⏳ Cargando registros...</div>;
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <button 
          className="btn-back-gallery"
          onClick={() => navigate('/')}
        >
          ← Volver
        </button>
        <h1>Registros en la Plataforma</h1>
        <p>Explora todos los registros disponibles</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Emprendimientos */}
      <section className="gallery-section">
        <div className="section-header">
          <h2>🚀 Emprendimientos ({ventures.length})</h2>
          <button onClick={() => navigate('/ventures')} className="view-all-btn">
            Ver todos →
          </button>
        </div>
        <div className="items-grid-3">
          {ventures.length > 0 ? (
            ventures.map((venture) => (
              <div key={venture.id} className="item-card">
                <div className="card-badge">Emprendimiento</div>
                <h3>{venture.companyName}</h3>
                <p className="card-text"><strong>Fundador:</strong> {venture.founderName || 'N/A'}</p>
                <p className="card-text"><strong>Email:</strong> {venture.founderEmail}</p>
                <p className="card-text"><strong>Ubicación:</strong> {venture.location || 'N/A'}</p>
                <p className="card-text"><strong>Industria:</strong> {venture.industry || 'N/A'}</p>
                <button 
                  onClick={() => navigate('/ventures')}
                  className="card-link-btn"
                >
                  Ver más detalles →
                </button>
              </div>
            ))
          ) : (
            <div className="empty-message">No hay emprendimientos registrados</div>
          )}
        </div>
      </section>

      {/* Empleos */}
      <section className="gallery-section">
        <div className="section-header">
          <h2>🎯 Empleos ({jobs.length})</h2>
          <button onClick={() => navigate('/jobs')} className="view-all-btn">
            Ver todos →
          </button>
        </div>
        <div className="items-grid-3">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="item-card">
                <div className="card-badge">Empleo</div>
                <h3>{job.position}</h3>
                <p className="card-text"><strong>Empresa:</strong> {job.company}</p>
                <p className="card-text"><strong>Email:</strong> {job.contactEmail}</p>
                <p className="card-text"><strong>Ubicación:</strong> {job.location || 'N/A'}</p>
                <p className="card-text"><strong>Tipo:</strong> {job.jobType || 'N/A'}</p>
                <button 
                  onClick={() => navigate('/jobs')}
                  className="card-link-btn"
                >
                  Ver más detalles →
                </button>
              </div>
            ))
          ) : (
            <div className="empty-message">No hay empleos registrados</div>
          )}
        </div>
      </section>

      {/* Convenios */}
      <section className="gallery-section">
        <div className="section-header">
          <h2>📋 Convenios Educativos ({agreements.length})</h2>
          <button onClick={() => navigate('/agreements')} className="view-all-btn">
            Ver todos →
          </button>
        </div>
        <div className="items-grid-3">
          {agreements.length > 0 ? (
            agreements.map((agreement) => (
              <div key={agreement.id} className="item-card">
                <div className="card-badge">Convenio</div>
                <h3>{agreement.schoolName}</h3>
                <p className="card-text"><strong>Tipo:</strong> {agreement.schoolType || 'N/A'}</p>
                <p className="card-text"><strong>Email:</strong> {agreement.contactEmail}</p>
                <p className="card-text"><strong>Ubicación:</strong> {agreement.location || 'N/A'}</p>
                <p className="card-text"><strong>Contacto:</strong> {agreement.contactPerson || 'N/A'}</p>
                <button 
                  onClick={() => navigate('/agreements')}
                  className="card-link-btn"
                >
                  Ver más detalles →
                </button>
              </div>
            ))
          ) : (
            <div className="empty-message">No hay convenios registrados</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RegisteredItemsGallery;
