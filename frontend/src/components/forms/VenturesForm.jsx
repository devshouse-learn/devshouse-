import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { venturesService } from '../../services/registration.service';
import { useAuth } from '../../context/AuthContext';
import validationRules from '../../services/validation.service';
import './forms.css';

const VenturesForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    foundedYear: new Date().getFullYear(),
    location: '',
    founderName: '',
    founderEmail: '',
    founderPhone: '',
    description: '',
    website: '',
    socialMedia: '',
    investmentStage: 'idea',
    teamSize: '',
    showInSearch: true,
    gmailVerified: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.companyName || !formData.founderEmail || !formData.description) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      // Validar que el email sea Gmail
      const gmailError = validationRules.gmail(formData.founderEmail);
      if (gmailError) {
        throw new Error(gmailError);
      }

      if (!formData.gmailVerified) {
        throw new Error('Debes confirmar que tienes acceso a este Gmail');
      }

      const response = await venturesService.create({
        ...formData,
        createdBy: user?.id,
      });
      console.log(' Emprendimiento guardado en BD:', response.data);
      
      setSuccess(true);
      setFormData({
        companyName: '',
        industry: '',
        foundedYear: new Date().getFullYear(),
        location: '',
        founderName: '',
        founderEmail: '',
        founderPhone: '',
        description: '',
        website: '',
        socialMedia: '',
        investmentStage: 'idea',
        teamSize: '',
        showInSearch: true,
        gmailVerified: false,
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Error al enviar formulario');
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
            onClick={() => navigate('/ventures')}
            title="Volver a Emprendimientos"
          >
            ← Volver
          </button>
        </div>
        <div className="header-content">
          <h1> Publica Tu<br/>Emprendimiento</h1>
          <p>Comparte tu idea y conecta con inversores, mentores y posibles clientes</p>
        </div>
        <button 
          className="btn-primary-large"
          onClick={() => window.scrollTo(0, document.querySelector('.ventures-form').offsetTop)}
          title="Ir al formulario"
        >
           Registrar el tuyo
        </button>
      </div>

      {success && (
        <div className="success-message">
           ¡Emprendimiento publicado exitosamente! Pronto será visible en la plataforma.
        </div>
      )}

      {error && (
        <div className="error-message">
           {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ventures-form">
        <div className="form-type-badge"> Formulario de Emprendimientos</div>
        <fieldset>
          <legend>Información de la Empresa</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="companyName">Nombre de la Empresa *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Ej: TechStart Innovations"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="industry">Sector / Industria *</label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
                disabled={loading}
              >
                <option value="">Selecciona un sector...</option>
                <option value="technology">Tecnología</option>
                <option value="fintech">FinTech</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="healthcare">Salud</option>
                <option value="education">Educación</option>
                <option value="energy">Energía</option>
                <option value="agritech">AgraTech</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="foundedYear">Año de Fundación</label>
              <input
                type="number"
                id="foundedYear"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleInputChange}
                min="2000"
                max={new Date().getFullYear()}
                disabled={loading}
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
                placeholder="Ej: Medellín, Colombia"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción del Proyecto *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe tu emprendimiento, qué problema resuelve, por qué es único..."
              rows="6"
              required
              disabled={loading}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Información de Contacto</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="founderName">Nombre del Fundador</label>
              <input
                type="text"
                id="founderName"
                name="founderName"
                value={formData.founderName}
                onChange={handleInputChange}
                placeholder="Ej: Carlos García"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="founderPhone">Teléfono</label>
              <input
                type="tel"
                id="founderPhone"
                name="founderPhone"
                value={formData.founderPhone}
                onChange={handleInputChange}
                placeholder="+57 (1) 1234-5678"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="founderEmail">Email *</label>
            <input
              type="email"
              id="founderEmail"
              name="founderEmail"
              value={formData.founderEmail}
              onChange={handleInputChange}
              placeholder="contacto@empresa.com"
              required
              disabled={loading}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Detalles del Emprendimiento</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="investmentStage">Etapa de Inversión</label>
              <select
                id="investmentStage"
                name="investmentStage"
                value={formData.investmentStage}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="idea">Idea</option>
                <option value="prototype">Prototipo</option>
                <option value="mvp">MVP (Producto Mínimo Viable)</option>
                <option value="seed">Seed Funding</option>
                <option value="series-a">Series A</option>
                <option value="growth">Growth Stage</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="teamSize">Tamaño del Equipo</label>
              <input
                type="number"
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleInputChange}
                placeholder="Ej: 5"
                min="1"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="website">Sitio Web</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://www.tuempresa.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="socialMedia">Redes Sociales</label>
              <input
                type="text"
                id="socialMedia"
                name="socialMedia"
                value={formData.socialMedia}
                onChange={handleInputChange}
                placeholder="LinkedIn, Twitter, Instagram..."
                disabled={loading}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Visibilidad</legend>
          <div className="form-group checkbox-group">
            <label htmlFor="showInSearch" className="checkbox-label">
              <input
                type="checkbox"
                id="showInSearch"
                name="showInSearch"
                checked={formData.showInSearch}
                onChange={handleInputChange}
                disabled={loading}
              />
              <span> Mostrar en "Buscar Empresa"</span>
            </label>
            <p className="checkbox-help">
              Si está marcado, tu emprendimiento será visible cuando otros usuarios busquen empresas en la plataforma.
            </p>
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
        <h3> Consejos para tu Perfil</h3>
        <ul>
          <li>Sé claro y conciso en la descripción de tu proyecto</li>
          <li>Incluye el problema que resuelves y tu propuesta de valor</li>
          <li>Comparte tus redes sociales para que te contacten</li>
          <li>Actualiza tu perfil regularmente con avances</li>
          <li>Mantén tus datos de contacto actualizados</li>
        </ul>
      </div>
    </div>
  );
};

export default VenturesForm;
