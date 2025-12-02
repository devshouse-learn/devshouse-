import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { venturesService } from '../../services/registration.service';
import { useAuth } from '../../context/AuthContext';
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

      const response = await venturesService.create({
        ...formData,
        createdBy: user?.id,
      });
      console.log('✅ Emprendimiento guardado en BD:', response.data);
      
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
      <div className="form-header">
        <h1>� Publica Tu Emprendimiento</h1>
        <p>Comparte tu idea y conecta con inversores, mentores y posibles clientes</p>
      </div>

      {success && (
        <div className="success-message">
          ✅ ¡Emprendimiento publicado exitosamente! Pronto será visible en la plataforma.
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ventures-form">
        <div className="form-type-badge">🚀 Formulario de Emprendimientos</div>
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

        <div className="form-actions">
          <div className="btn-group-left">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate(-1)}
            >
              ⬅️ Atrás
            </button>
          </div>
          <div className="btn-group-center">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? '⏳ Publicando...' : '✅ Publicar'}
            </button>
            <button
              type="reset"
              className="btn-reset"
              disabled={loading}
              onClick={() => setError('')}
            >
              🔄 Limpiar
            </button>
          </div>
          <div className="btn-group-right">
            <button
              type="button"
              className="btn-close"
              onClick={() => navigate('/')}
            >
              ✕ Cerrar
            </button>
          </div>
        </div>
      </form>

      <div className="form-info">
        <h3>💡 Consejos para tu Perfil</h3>
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
