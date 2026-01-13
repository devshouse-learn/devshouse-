import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { agreementsService } from '../../services/registration.service';
import { useAuth } from '../../context/AuthContext';
import validationRules from '../../services/validation.service';
import BackButton from '../common/BackButton';
import './forms.css';

const StudentForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    schoolName: '',
    schoolType: 'university',
    location: '',
    careerGoal: '',
    experience: '',
    skills: '',
    bio: '',
    availability: 'disponible',
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
      if (!formData.studentName || !formData.studentEmail || !formData.schoolName) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      // Validar que el email sea Gmail
      const gmailError = validationRules.gmail(formData.studentEmail);
      if (gmailError) {
        throw new Error(gmailError);
      }

      if (!formData.gmailVerified) {
        throw new Error('Debes confirmar que tienes acceso a este Gmail');
      }

      // Crear un registro de convenio con la información del estudiante
      const dataToSubmit = {
        schoolName: formData.schoolName,
        schoolType: formData.schoolType,
        location: formData.location,
        contactPerson: formData.studentName,
        contactEmail: formData.studentEmail,
        contactPhone: formData.studentPhone,
        description: `Estudiante buscando oportunidades de aprendizaje y experiencia.\n\nCarrera: ${formData.careerGoal}\nExperiencia: ${formData.experience}\nHabilidades: ${formData.skills}\n\n${formData.bio}`,
        createdBy: user?.id,
        gmailVerified: formData.gmailVerified,
      };

      const response = await agreementsService.create(dataToSubmit);
      console.log(' Perfil de estudiante guardado:', response.data);
      
      setSuccess(true);
      setFormData({
        studentName: '',
        studentEmail: '',
        studentPhone: '',
        schoolName: '',
        schoolType: 'university',
        location: '',
        careerGoal: '',
        experience: '',
        skills: '',
        bio: '',
        availability: 'disponible',
        gmailVerified: false,
      });

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
          <h1>Estudiantes</h1>
          <p>Registra tu perfil y encuentra oportunidades de aprendizaje y experiencia</p>
        </div>
      </div>

      {success && (
        <div className="success-message">
           ¡Perfil registrado exitosamente! Pronto verás oportunidades disponibles.
        </div>
      )}

      {error && (
        <div className="error-message">
           {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="student-form">
        <fieldset>
          <legend>Información Personal</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentName">Nombre Completo *</label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                placeholder="Ej: Juan García López"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentPhone">Teléfono</label>
              <input
                type="tel"
                id="studentPhone"
                name="studentPhone"
                value={formData.studentPhone}
                onChange={handleInputChange}
                placeholder="+57 (1) 1234-5678"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="studentEmail">Email *</label>
            <input
              type="email"
              id="studentEmail"
              name="studentEmail"
              value={formData.studentEmail}
              onChange={handleInputChange}
              placeholder="juan@ejemplo.com"
              required
              disabled={loading}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Información Académica</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="schoolName">Institución Educativa *</label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                placeholder="Ej: Universidad Nacional de Colombia"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="schoolType">Tipo de Institución</label>
              <select
                id="schoolType"
                name="schoolType"
                value={formData.schoolType}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="university">Universidad</option>
                <option value="technical">Instituto Técnico</option>
                <option value="bootcamp">Bootcamp</option>
                <option value="high-school">Educación Media</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="careerGoal">Carrera / Especialidad *</label>
            <input
              type="text"
              id="careerGoal"
              name="careerGoal"
              value={formData.careerGoal}
              onChange={handleInputChange}
              placeholder="Ej: Ingeniería de Sistemas"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Ubicación</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Ej: Medellín, Colombia"
              disabled={loading}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Experiencia y Habilidades</legend>

          <div className="form-group">
            <label htmlFor="experience">Experiencia Laboral</label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Describe tu experiencia laboral previa, prácticas, proyectos..."
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Habilidades y Tecnologías</label>
            <textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="Ej: React, Node.js, Python, SQL, Git, etc."
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Cuéntanos sobre ti *</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Describe tus metas, intereses, qué tipo de oportunidades buscas..."
              rows="4"
              required
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
          <div className="btn-group-center">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? '⏳ Registrando...' : ' Registrar Perfil'}
            </button>
            <button
              type="reset"
              className="btn-reset"
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
          <li>Sé honesto y detallado en tus habilidades</li>
          <li>Destaca proyectos académicos o personales relevantes</li>
          <li>Menciona idiomas y certificaciones</li>
          <li>Explica claramente qué tipo de oportunidades buscas</li>
          <li>Mantén tus datos de contacto actualizados</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentForm;
