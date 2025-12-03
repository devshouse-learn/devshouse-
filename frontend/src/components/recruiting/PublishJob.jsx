import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsService } from '../../services/registration.service';
import '../forms/forms.css';

const PublishJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    location: '',
    jobType: 'full-time',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    contactEmail: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validar campos requeridos
      if (!formData.position || !formData.company || !formData.contactEmail || !formData.description) {
        setError('Por favor completa los campos requeridos');
        setLoading(false);
        return;
      }

      // Preparar datos para enviar a la API
      const jobData = {
        position: formData.position,
        company: formData.company,
        location: formData.location || null,
        jobType: formData.jobType,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        currency: formData.currency,
        contactEmail: formData.contactEmail,
        description: formData.description,
        status: 'active', // Publicar inmediatamente
      };

      // Llamar a la API para crear el empleo
      const response = await jobsService.create(jobData);
      console.log('✅ Oferta de empleo creada:', response);

      setSuccess('✅ Oferta publicada exitosamente');
      
      // Limpiar formulario
      setFormData({
        position: '',
        company: '',
        location: '',
        jobType: 'full-time',
        salaryMin: '',
        salaryMax: '',
        currency: 'USD',
        contactEmail: '',
        description: ''
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (err) {
      console.error('Error al publicar oferta:', err);
      setError('Error al publicar la oferta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
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
          <h1>💼 Publicar Oferta de Empleo</h1>
          <p>Comparte una oportunidad laboral</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-section">
          <h2>Información de la Posición</h2>
          
          <div className="form-group">
            <label htmlFor="position">Puesto *</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Ej: Desarrollador Full Stack"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Empresa *</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Nombre de la empresa"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Ubicación *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Ciudad o Remoto"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobType">Tipo de Trabajo *</label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="full-time">Tiempo Completo</option>
              <option value="part-time">Tiempo Parcial</option>
              <option value="contract">Contrato</option>
              <option value="temporary">Temporal</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2>Compensación</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salaryMin">Salario Mínimo</label>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleInputChange}
                placeholder="0"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="salaryMax">Salario Máximo</label>
              <input
                type="number"
                id="salaryMax"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleInputChange}
                placeholder="0"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Moneda</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="ARS">ARS</option>
                <option value="COP">COP</option>
                <option value="MXN">MXN</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Contacto</h2>
          
          <div className="form-group">
            <label htmlFor="contactEmail">Email de Contacto *</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="contacto@empresa.com"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Descripción</h2>
          
          <div className="form-group">
            <label htmlFor="description">Descripción de la Oferta</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe los detalles de la posición, responsabilidades y requisitos..."
              disabled={loading}
              rows="6"
            />
          </div>
        </div>

        {error && <div className="form-error">⚠️ {error}</div>}
        {success && <div className="form-success">{success}</div>}

        <div className="form-actions">
          <button
            type="submit"
            className="btn"
            disabled={loading}
          >
            {loading ? 'Publicando...' : '📢 Publicar Oferta'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/recruiting')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublishJob;
