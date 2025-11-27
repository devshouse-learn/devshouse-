import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsService } from '../../services/registration.service';
import './forms.css';

const JobSearchForm = () => {
  const navigate = useNavigate();
  
  const [searchCriteria, setSearchCriteria] = useState({
    jobTitle: '',
    industry: '',
    location: '',
    experienceLevel: '',
    jobType: 'any',
    salaryMin: '',
    salaryMax: '',
    keywords: '',
  });

  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar empleos de la base de datos al inicio
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const response = await jobsService.getAll({ status: 'active' });
        const jobs = response.data || [];
        setAllJobs(jobs);
        console.log('📋 Empleos cargados desde BD:', jobs.length);
      } catch (error) {
        console.error('Error al cargar empleos:', error);
        setAllJobs([]);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Búsqueda real en empleos guardados
    const filtered = allJobs.filter((job) => {
      const matchesTitle = !searchCriteria.jobTitle || 
        job.position.toLowerCase().includes(searchCriteria.jobTitle.toLowerCase());
      
      const matchesIndustry = !searchCriteria.industry || 
        job.industry === searchCriteria.industry;
      
      const matchesLocation = !searchCriteria.location || 
        job.location.toLowerCase().includes(searchCriteria.location.toLowerCase());
      
      const matchesExperience = !searchCriteria.experienceLevel || 
        job.experience === searchCriteria.experienceLevel;
      
      const matchesType = searchCriteria.jobType === 'any' || 
        job.jobType === searchCriteria.jobType;
      
      const minSalary = searchCriteria.salaryMin ? parseInt(searchCriteria.salaryMin) : 0;
      const maxSalary = searchCriteria.salaryMax ? parseInt(searchCriteria.salaryMax) : Infinity;
      const matchesSalary = job.salaryMin >= minSalary && job.salaryMax <= maxSalary;
      
      return matchesTitle && matchesIndustry && matchesLocation && 
             matchesExperience && matchesType && matchesSalary;
    });

    setResults(filtered);
    setSearched(true);
  };

  const handleReset = () => {
    setSearchCriteria({
      jobTitle: '',
      industry: '',
      location: '',
      experienceLevel: '',
      jobType: 'any',
      salaryMin: '',
      salaryMax: '',
      keywords: '',
    });
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>🔍 Busca Tu Próxima Oportunidad</h1>
        <p>Encuentra empleos que se adapten a tu perfil y experiencia</p>
      </div>

      <form onSubmit={handleSearch} className="job-search-form">
        <fieldset>
          <legend>Criterios de Búsqueda</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="jobTitle">Título del Puesto</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={searchCriteria.jobTitle}
                onChange={handleInputChange}
                placeholder="Ej: Desarrollador, Diseñador..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Ubicación</label>
              <input
                type="text"
                id="location"
                name="location"
                value={searchCriteria.location}
                onChange={handleInputChange}
                placeholder="Ej: Medellín, Virtual..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="industry">Sector / Industria</label>
              <select
                id="industry"
                name="industry"
                value={searchCriteria.industry}
                onChange={handleInputChange}
              >
                <option value="">Todos los sectores</option>
                <option value="technology">Tecnología</option>
                <option value="marketing">Marketing</option>
                <option value="healthcare">Salud</option>
                <option value="finance">Finanzas</option>
                <option value="education">Educación</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experienceLevel">Nivel de Experiencia</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={searchCriteria.experienceLevel}
                onChange={handleInputChange}
              >
                <option value="">Todos los niveles</option>
                <option value="junior">Junior (0-2 años)</option>
                <option value="mid">Mid-Level (2-5 años)</option>
                <option value="senior">Senior (5+ años)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="jobType">Tipo de Contrato</label>
              <select
                id="jobType"
                name="jobType"
                value={searchCriteria.jobType}
                onChange={handleInputChange}
              >
                <option value="any">Todos los tipos</option>
                <option value="full-time">Tiempo Completo</option>
                <option value="part-time">Medio Tiempo</option>
                <option value="contract">Contrato</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="salaryMin">Salario Mínimo (USD)</label>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                value={searchCriteria.salaryMin}
                onChange={handleInputChange}
                placeholder="Ej: 1000"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="salaryMax">Salario Máximo (USD)</label>
            <input
              type="number"
              id="salaryMax"
              name="salaryMax"
              value={searchCriteria.salaryMax}
              onChange={handleInputChange}
              placeholder="Ej: 5000"
            />
          </div>

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
              <button type="submit" className="btn-submit">
                🔍 Buscar Empleos
              </button>
              <button type="button" className="btn-reset" onClick={handleReset}>
                🔄 Limpiar Filtros
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
        </fieldset>
      </form>

      {searched && (
        <div className="results-section">
          <h2>{results.length} Empleos Encontrados</h2>

          {results.length === 0 ? (
            <div className="no-results">
              <p>😔 No encontramos empleos que coincidan con tu búsqueda.</p>
              <p>Intenta con diferentes criterios o ajusta tus filtros.</p>
            </div>
          ) : (
            <div className="jobs-list">
              {results.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <div>
                      <h3>{job.position}</h3>
                      <p className="company">{job.company}</p>
                    </div>
                    <div className="job-type-badge" data-type={job.jobType}>
                      {job.jobType === 'full-time' && '💼 Tiempo Completo'}
                      {job.jobType === 'part-time' && '⏰ Medio Tiempo'}
                      {job.jobType === 'contract' && '📋 Contrato'}
                      {job.jobType === 'freelance' && '🎯 Freelance'}
                    </div>
                  </div>

                  <div className="job-details">
                    <span className="detail">📍 {job.location}</span>
                    <span className="detail">💼 {job.experience}</span>
                    <span className="detail">💵 {job.currency} {job.salaryMin} - {job.salaryMax}</span>
                  </div>

                  <p className="job-description">{job.description}</p>

                  {job.requirements && (
                    <div className="job-keywords">
                      {job.requirements.split(',').map((req, idx) => (
                        <span key={idx} className="keyword">
                          {req.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="job-footer">
                    <span className="posted">Publicado: {new Date(job.createdAt).toLocaleDateString()}</span>
                    <button className="btn-apply">Aplicar Ahora</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="search-tips">
        <h3>💡 Consejos para tu Búsqueda</h3>
        <ul>
          <li>Sé específico en tus criterios para mejores resultados</li>
          <li>Explora diferentes ubicaciones, incluyendo oportunidades virtuales</li>
          <li>Revisa regularmente para ver nuevas ofertas</li>
          <li>Personaliza tu CV según el puesto que buscas</li>
          <li>Prepárate para la entrevista investigando la empresa</li>
        </ul>
      </div>
    </div>
  );
};

export default JobSearchForm;
