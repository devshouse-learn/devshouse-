import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidatesService } from '../../services/registration.service';
import '../forms/JobSearchForm.css';

const PublishProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    skills: '',
    bio: ''
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
      if (!formData.name || !formData.email || !formData.profession) {
        setError('Por favor completa los campos requeridos (Nombre, Email, Profesión)');
        setLoading(false);
        return;
      }

      // Preparar datos para enviar a la API
      const candidateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        location: formData.location || null,
        bio: formData.bio || null,
        resume: formData.experience || null,
        technologies: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        availability: 'disponible',
      };

      // Llamar a la API para crear el candidato
      const response = await candidatesService.create(candidateData);
      console.log('✅ Hoja de vida creada:', response);

      setSuccess('✅ Perfil publicado exitosamente');
      
      // Limpiar formulario
      setFormData({
        name: '',
        profession: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        skills: '',
        bio: ''
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/job-search');
      }, 2000);
    } catch (err) {
      console.error('Error al publicar perfil:', err);
      setError('Error al publicar el perfil: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <button 
          className="btn-back"
          onClick={() => navigate('/recruiting')}
          title="Volver al Centro de Reclutamiento"
        >
          ← Volver
        </button>
        <h1>📄 Publicar Perfil Profesional</h1>
        <p>Comparte tu hoja de vida con empleadores</p>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-section">
          <h2>Información Personal</h2>
          
          <div className="form-group">
            <label htmlFor="name">Nombre Completo *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Tu nombre"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profession">Profesión *</label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              placeholder="Ej: Desarrollador Full Stack"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@email.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 234 567 8900"
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
              placeholder="Ciudad o País"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Experiencia Profesional</h2>
          
          <div className="form-group">
            <label htmlFor="experience">Experiencia Laboral</label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Describe tu experiencia laboral..."
              disabled={loading}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Habilidades</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="Ej: JavaScript, React, Node.js, SQL"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Descripción</h2>
          
          <div className="form-group">
            <label htmlFor="bio">Biografía Profesional</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Cuéntanos sobre ti, tus logros y metas profesionales..."
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
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Publicando...' : '📄 Publicar Perfil'}
          </button>
          <button
            type="button"
            className="btn-cancel"
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

export default PublishProfile;
