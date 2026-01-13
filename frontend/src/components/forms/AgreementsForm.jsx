import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { agreementsService } from '../../services/registration.service';
import { useAuth } from '../../context/AuthContext';
import { validateField } from '../../services/validation.service';
import validationRules from '../../services/validation.service';
import BackButton from '../common/BackButton';
import './forms.css';

const AgreementsForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolType: 'university',
    location: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    agreementType: 'educational_agreement',
    startDate: '',
    endDate: '',
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
    setFieldErrors({});

    try {
      // Validaciones mejoradas
      const errors = {};

      if (!formData.schoolName?.trim()) {
        errors.schoolName = 'Nombre de institución es requerido';
      }

      if (!formData.contactEmail?.trim()) {
        errors.contactEmail = 'Email es requerido';
      } else {
        const emailError = validationRules.email(formData.contactEmail);
        if (emailError) errors.contactEmail = emailError;
        else {
          const gmailError = validationRules.gmail(formData.contactEmail);
          if (gmailError) errors.contactEmail = gmailError;
        }
      }

      if (!formData.location?.trim()) {
        errors.location = 'Ubicación es requerida';
      }

      if (formData.contactPhone && formData.contactPhone.trim()) {
        const phoneError = validationRules.phone(formData.contactPhone);
        if (phoneError) errors.contactPhone = phoneError;
      }

      if (!formData.gmailVerified) {
        errors.gmailVerified = 'Debes confirmar que tienes acceso a este Gmail';
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        throw new Error('Por favor completa todos los campos requeridos correctamente');
      }

      // Guardar en base de datos a través del API
      const dataToSubmit = {
        ...formData,
        createdBy: user?.id,
      };
      const response = await agreementsService.create(dataToSubmit);
      console.log(' Convenio guardado en BD:', response.data);
      
      setSuccess(true);
      setFormData({
        schoolName: '',
        schoolType: 'university',
        location: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        description: '',
        agreementType: 'educational_agreement',
        startDate: '',
        endDate: '',
        gmailVerified: false,
      });

      // Limpiar mensaje de éxito después de 3 segundos y navegar
      setTimeout(() => {
        setSuccess(false);
        navigate('/agreements');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al enviar formulario');
      console.error('Error en formulario:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <BackButton />
      <div className="list-header form-page-header">
        <div className="header-content">
          <h1>Convenios</h1>
          <p>Registra tu institución educativa y establece convenios con empresas</p>
        </div>
      </div>

      {success && (
        <div className="success-message">
           ¡Convenio registrado exitosamente! Nos pondremos en contacto pronto.
        </div>
      )}

      {error && (
        <div className="error-message">
           {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="agreement-form">
        <div className="form-type-badge"> Formulario de Convenios</div>
        <fieldset>
          <legend>Información de la Institución</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="schoolName">Institución *</label>
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
                <option value="university">Universidad</option>
                <option value="technical">Educación Técnica</option>
                <option value="bootcamp">Bootcamp / Academia</option>
                <option value="high-school">Secundaria</option>
              </select>
            </div>

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
          </div>

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
          <legend>Detalles del Convenio</legend>

          <div className="form-row">
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
              rows="3"
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
            {fieldErrors.gmailVerified && (
              <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                {fieldErrors.gmailVerified}
              </p>
            )}
          </div>
        </fieldset>

        <div className="form-actions">
          
          <div className="btn-group-center">
            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? '⏳ Enviando...' : ' Registrar Convenio'}
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
        <h3>ℹ Información Importante</h3>
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
