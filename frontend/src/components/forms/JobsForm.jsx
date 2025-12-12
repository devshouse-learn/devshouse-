import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsService } from '../../services/registration.service';
import validationRules from '../../services/validation.service';
import './forms.css';

const JobsForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    logoUrl: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    jobType: 'full-time',
    experience: 'mid',
    industry: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    contactEmail: '',
    contactPhone: '',
    applicationDeadline: '',
    benefits: '',
    gmailVerified: false,
  });

  const getInitials = (value = '') =>
    value
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'LOGO';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFormData((prev) => ({ ...prev, logoUrl: '' }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('El logo debe ser un archivo de imagen');
      e.target.value = '';
      return;
    }

    const maxFileSize = 2 * 1024 * 1024;
    if (file.size > maxFileSize) {
      setError('El logo no debe superar los 2 MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = typeof reader.result === 'string' ? reader.result : '';
      setFormData((prev) => ({ ...prev, logoUrl: base64 }));
      setError('');
    };
    reader.onerror = () => {
      setError('No se pudo leer el archivo del logo');
      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.position || !formData.company || !formData.description) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      // Validar que el email sea Gmail
      if (formData.contactEmail) {
        const gmailError = validationRules.gmail(formData.contactEmail);
        if (gmailError) {
          throw new Error(gmailError);
        }
      }

      if (!formData.gmailVerified) {
        throw new Error('Debes confirmar que tienes acceso a este Gmail');
      }

      if (formData.salaryMin && formData.salaryMax) {
        if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
          throw new Error('El salario mínimo no puede ser mayor que el máximo');
        }
      }

      const jobData = {
        ...formData,
        createdBy: user?.id,
        postedBy: user?.id || 'admin',
        postedByEmail: user?.email || formData.contactEmail,
        postedByName: user?.name || 'Administrador',
      };

      const response = await jobsService.create(jobData);
      console.log(' Empleo guardado en BD:', response.data);
      
      setSuccess(true);
      setFormData({
        position: '',
        company: '',
        logoUrl: '',
        description: '',
        requirements: '',
        responsibilities: '',
        location: '',
        jobType: 'full-time',
        experience: 'mid',
        industry: '',
        salaryMin: '',
        salaryMax: '',
        currency: 'USD',
        contactEmail: '',
        contactPhone: '',
        applicationDeadline: '',
        benefits: '',
        gmailVerified: false,
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Error al publicar empleo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="list-header form-page-header">
        <div className="header-top">
          <button 
            className="btn-back"
            onClick={() => navigate('/jobs')}
            title="Volver a Empleos"
          ><span className="emoji">↩️</span> Volver </button>
        </div>
        <div className="header-content">
          <h1> Publicar Oportunidad de Empleo</h1>
          <p>Publica una nueva oferta laboral y llega a candidatos calificados</p>
        </div>
        <button 
          className="btn-primary-large"
          onClick={() => window.scrollTo(0, document.querySelector('.jobs-form').offsetTop)}
          title="Ir al formulario"
        >
           Registrar el tuyo
        </button>
      </div>

      {success && (
        <div className="success-message">
           ¡Empleo publicado exitosamente! Los candidatos podrán verlo en la plataforma.
        </div>
      )}

      {error && (
        <div className="error-message">
           {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="jobs-form">
        <div className="form-type-badge"> Formulario de Empleos</div>
        <fieldset>
          <legend>Información de la Posición</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="position">Título de la Posición *</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Ej: Desarrollador Full Stack"
                required
                disabled={loading}
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
                placeholder="Ej: Tech Company Inc."
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="companyLogo">Logo de la empresa</label>
            <input
              type="file"
              id="companyLogo"
              name="companyLogo"
              accept="image/*"
              onChange={handleLogoChange}
              disabled={loading}
            />
            {formData.logoUrl && (
              <div className="logo-preview">
                <div className="logo-preview-circle">
                  <img src={formData.logoUrl} alt={`Logo de ${formData.company || 'la empresa'}`} />
                </div>
                <span>Así se mostrará el logo junto al nombre de la empresa.</span>
              </div>
            )}
            {!formData.logoUrl && formData.company && (
              <div className="logo-preview">
                <div className="logo-preview-circle">
                  <span>{getInitials(formData.company)}</span>
                </div>
                <span>Si no subes un logo, mostraremos las iniciales de la empresa.</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción del Puesto *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe en detalle la posición, responsabilidades principales..."
              rows="5"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="responsibilities">Responsabilidades Principales</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleInputChange}
              placeholder="Lista las responsabilidades principales del cargo"
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Requisitos y Qualificaciones *</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder="Experiencia requerida, skills técnicos, educación..."
              rows="4"
              required
              disabled={loading}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Detalles del Empleo</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Ubicación *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ej: Medellín, Hybrid, Remote"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="jobType">Tipo de Contrato</label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="full-time">Tiempo Completo</option>
                <option value="part-time">Medio Tiempo</option>
                <option value="contract">Contrato</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="experience">Nivel de Experiencia</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="junior">Junior (0-2 años)</option>
                <option value="mid">Mid-Level (2-5 años)</option>
                <option value="senior">Senior (5+ años)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="industry">Sector / Industria</label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Selecciona un sector...</option>
                <option value="technology">Tecnología</option>
                <option value="fintech">FinTech</option>
                <option value="healthcare">Salud</option>
                <option value="education">Educación</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Compensación y Beneficios</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salaryMin">Salario Mínimo</label>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleInputChange}
                placeholder="Ej: 2000"
                min="0"
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
                placeholder="Ej: 5000"
                min="0"
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
                <option value="USD">USD - Dólar Americano</option>
                <option value="EUR">EUR - Euro</option>
                <option value="COP">COP - Peso Colombiano</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="benefits">Beneficios</label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleInputChange}
              placeholder="Ej: Seguro de salud, Trabajo remoto, Flexibilidad horaria..."
              rows="3"
              disabled={loading}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Información de Contacto</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactEmail">Email de Contacto *</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="hr@empresa.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Teléfono de Contacto</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="+57 (1) 1234-5678"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="applicationDeadline">Fecha Límite de Aplicación</label>
            <input
              type="date"
              id="applicationDeadline"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              disabled={loading}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Verificación de Gmail</legend>
          <div className="form-group checkbox-group">
            <label htmlFor="gmailVerified" className="checkbox-label">
              <input
                type="checkbox"
                id="gmailVerified"
                name="gmailVerified"
                checked={formData.gmailVerified}
                onChange={handleInputChange}
                disabled={loading}
              />
              <span> Confirmo que tengo acceso a este Gmail y que es correcto</span>
            </label>
          </div>
        </fieldset>

        <div className="form-actions">
          <div className="btn-group-left">
            <button
              type="button"
              className="btn"
              onClick={() => navigate(-1)}
            >
               Atrás
            </button>
          </div>
          <div className="btn-group-center">
            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? '⏳ Publicando...' : ' Publicar'}
            </button>
            <button
              type="reset"
              className="btn"
              disabled={loading}
              onClick={() => setError('')}
            >
               Limpiar
            </button>
          </div>
        </div>
      </form>

      <div className="form-info">
        <h3> Recomendaciones para tu Publicación</h3>
        <ul>
          <li>Sé claro y específico en la descripción del puesto</li>
          <li>Lista todos los requisitos técnicos y habilidades blandas necesarias</li>
          <li>Incluye información clara sobre compensación y beneficios</li>
          <li>Proporciona una fecha límite de aplicación realista</li>
          <li>Asegúrate que el email de contacto sea monitoreado regularmente</li>
          <li>Usa un lenguaje inclusivo y atrayente para candidatos</li>
        </ul>
      </div>
    </div>
  );
};

export default JobsForm;
