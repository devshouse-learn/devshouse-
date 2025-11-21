import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { agreementsService } from '../../services/registration.service';
import './AgreementsForm.css';

const AgreementsForm = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolType: 'primaria',
    location: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    agreementType: 'educational_agreement',
    startDate: '',
    endDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validaciones básicas
      if (!formData.schoolName || !formData.contactEmail || !formData.location) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      // Enviar datos (cuando backend esté listo)
      await agreementsService.create(formData);
      
      setSuccess(true);
      setFormData({
        schoolName: '',
        schoolType: 'primaria',
        location: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        description: '',
        agreementType: 'educational_agreement',
        startDate: '',
        endDate: '',
      });

      // Limpiar mensaje de éxito después de 3 segundos
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
        <h1>📋 Convenios Educativos</h1>
        <p>Registra tu institución educativa y establece convenios con empresas</p>
      </div>

      {success && (
        <div className="success-message">
          ✅ ¡Convenio registrado exitosamente! Nos pondremos en contacto pronto.
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="agreement-form">
        <fieldset>
          <legend>Información de la Institución</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="schoolName">Nombre de la Institución *</label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                placeholder="Ej: Colegio Nacional San Martín"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="schoolType">Tipo de Institución *</label>
              <select
                id="schoolType"
                name="schoolType"
                value={formData.schoolType}
                onChange={handleInputChange}
                required
                disabled={loading}
              >
                <option value="primaria">Educación Primaria</option>
                <option value="secundaria">Educación Secundaria</option>
                <option value="tecnica">Educación Técnica</option>
                <option value="superior">Educación Superior</option>
                <option value="otra">Otra</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Ubicación *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ej: Bogotá, Colombia"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Teléfono</label>
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
        </fieldset>

        <fieldset>
          <legend>Información de Contacto</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactPerson">Persona de Contacto</label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Ej: Dr. Juan González"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactEmail">Email *</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="contacto@institucion.edu"
                required
                disabled={loading}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Detalles del Convenio</legend>

          <div className="form-group">
            <label htmlFor="agreementType">Tipo de Convenio</label>
            <select
              id="agreementType"
              name="agreementType"
              value={formData.agreementType}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="educational_agreement">Acuerdo Educativo</option>
              <option value="internship">Programa de Prácticas</option>
              <option value="training">Programa de Capacitación</option>
              <option value="research">Colaboración Investigativa</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Fecha de Inicio</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">Fecha de Fin</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción / Notas</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe los objetivos y detalles del convenio..."
              rows="5"
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
              {loading ? '⏳ Enviando...' : '✅ Registrar Convenio'}
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
        <h3>ℹ️ Información Importante</h3>
        <ul>
          <li>Los campos marcados con * son obligatorios</li>
          <li>Recibirás un email de confirmación una vez registrado</li>
          <li>Te contactaremos para detalles adicionales del convenio</li>
          <li>Puedes actualizar tu información en cualquier momento</li>
        </ul>
      </div>
    </div>
  );
};

export default AgreementsForm;
