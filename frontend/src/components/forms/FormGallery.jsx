import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormGallery.css';

const FormGallery = () => {
  const navigate = useNavigate();
  const [venturesData, setVenturesData] = useState({
    companyName: '',
    founderEmail: '',
    location: '',
  });
  const [jobsData, setJobsData] = useState({
    position: '',
    company: '',
    contactEmail: '',
  });
  const [agreementsData, setAgreementsData] = useState({
    schoolName: '',
    contactEmail: '',
    location: '',
  });

  const handleVenturesChange = (e) => {
    setVenturesData({ ...venturesData, [e.target.name]: e.target.value });
  };

  const handleJobsChange = (e) => {
    setJobsData({ ...jobsData, [e.target.name]: e.target.value });
  };

  const handleAgreementsChange = (e) => {
    setAgreementsData({ ...agreementsData, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-gallery-container">
      <div className="gallery-header">
        <button 
          className="btn-back"
          onClick={() => navigate('/')}
          title="Volver al inicio"
        >
          ← Volver
        </button>
        <h1>Formularios de Registro</h1>
        <p>Completa cualquiera de estos formularios para registrarte</p>
      </div>

      <div className="forms-grid">
        {/* Formulario de Emprendimientos */}
        <div className="form-column">
          <div className="form-header-compact">
            <h2>🚀 Emprendimientos</h2>
            <p>Publica tu startup</p>
          </div>
          <form className="form-compact">
            <div className="form-group-compact">
              <label>Nombre de la Empresa *</label>
              <input
                type="text"
                name="companyName"
                value={venturesData.companyName}
                onChange={handleVenturesChange}
                placeholder="Tu empresa"
              />
            </div>
            <div className="form-group-compact">
              <label>Email del Fundador *</label>
              <input
                type="email"
                name="founderEmail"
                value={venturesData.founderEmail}
                onChange={handleVenturesChange}
                placeholder="tu@email.com"
              />
            </div>
            <div className="form-group-compact">
              <label>Ubicación</label>
              <input
                type="text"
                name="location"
                value={venturesData.location}
                onChange={handleVenturesChange}
                placeholder="Ciudad"
              />
            </div>
            <button 
              type="button"
              className="btn-submit-compact"
              onClick={() => navigate('/ventures/form')}
            >
              Continuar →
            </button>
          </form>
        </div>

        {/* Formulario de Empleos */}
        <div className="form-column">
          <div className="form-header-compact">
            <h2>🎯 Empleos</h2>
            <p>Publica una oferta</p>
          </div>
          <form className="form-compact">
            <div className="form-group-compact">
              <label>Título de la Posición *</label>
              <input
                type="text"
                name="position"
                value={jobsData.position}
                onChange={handleJobsChange}
                placeholder="Ej: Developer"
              />
            </div>
            <div className="form-group-compact">
              <label>Empresa *</label>
              <input
                type="text"
                name="company"
                value={jobsData.company}
                onChange={handleJobsChange}
                placeholder="Nombre empresa"
              />
            </div>
            <div className="form-group-compact">
              <label>Email de Contacto *</label>
              <input
                type="email"
                name="contactEmail"
                value={jobsData.contactEmail}
                onChange={handleJobsChange}
                placeholder="contacto@empresa.com"
              />
            </div>
            <button 
              type="button"
              className="btn-submit-compact"
              onClick={() => navigate('/jobs/form')}
            >
              Continuar →
            </button>
          </form>
        </div>

        {/* Formulario de Convenios */}
        <div className="form-column">
          <div className="form-header-compact">
            <h2>📋 Convenios</h2>
            <p>Registra tu institución</p>
          </div>
          <form className="form-compact">
            <div className="form-group-compact">
              <label>Nombre de la Institución *</label>
              <input
                type="text"
                name="schoolName"
                value={agreementsData.schoolName}
                onChange={handleAgreementsChange}
                placeholder="Universidad..."
              />
            </div>
            <div className="form-group-compact">
              <label>Email de Contacto *</label>
              <input
                type="email"
                name="contactEmail"
                value={agreementsData.contactEmail}
                onChange={handleAgreementsChange}
                placeholder="contacto@institución.com"
              />
            </div>
            <div className="form-group-compact">
              <label>Ubicación</label>
              <input
                type="text"
                name="location"
                value={agreementsData.location}
                onChange={handleAgreementsChange}
                placeholder="Ciudad"
              />
            </div>
            <button 
              type="button"
              className="btn-submit-compact"
              onClick={() => navigate('/agreements/form')}
            >
              Continuar →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormGallery;
