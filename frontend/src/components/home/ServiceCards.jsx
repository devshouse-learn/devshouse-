import { Link } from 'react-router-dom';
import './ServiceCards.css';

const servicesData = [
  {
    icon: '🏫',
    title: 'Convenios con Colegios',
    description: 'Establece alianzas educativas y programas de formación con instituciones académicas.',
    technologies: 'Aprenderán: Visual Studio Code, Git, API REST, IA para todos los proyectos y más tecnologías actuales.',
    benefits: [
      'Programas de capacitación',
      'Prácticas profesionales',
      'IA disponible para todos los proyectos'
    ],
    link: '/agreements',
    buttonText: 'Registrar Convenio'
  },
  {
    icon: '🚀',
    title: 'Emprendimientos',
    description: 'Publica y promociona tu empresa o emprendimiento para alcanzar nuevos mercados.',
    benefits: [
      'Visibilidad empresarial',
      'Networking',
      'Oportunidades de inversión',
      'IA para optimizar tu emprendimiento'
    ],
    link: '/ventures',
    buttonText: 'Publicar Emprendimiento'
  },
  {
    icon: '💼',
    title: 'Ofertas de Empleo',
    description: 'Conectamos empresas con talento calificado.',
    aiNote: 'IA disponible para optimizar búsquedas y matching.',
    options: [
      {
        icon: '🏢',
        title: 'Soy Empresa',
        description: 'Publica vacantes disponibles',
        link: '/jobs',
        buttonText: 'Publicar Empleo',
        buttonClass: 'btn-primary'
      },
      {
        icon: '👤',
        title: 'Busco Empleo',
        description: 'Encuentra oportunidades laborales',
        link: '/job-search',
        buttonText: 'Buscar Empleo',
        buttonClass: 'btn-secondary'
      }
    ]
  }
];

const ServiceCards = () => {
  return (
    <section className="services-section">
      <div className="services-header">
        <h2>Nuestros Servicios</h2>
        <p>Selecciona el tipo de registro que necesitas</p>
      </div>
      
      <div className="cards-container">
        {servicesData.map((service, index) => (
          <div key={index} className="card">
            <div className="card-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            
            {service.technologies && (
              <p><strong>{service.technologies}</strong></p>
            )}
            
            {service.aiNote && (
              <p><strong>{service.aiNote}</strong></p>
            )}
            
            {service.benefits && (
              <ul className="benefits">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            )}
            
            {service.options ? (
              <div className="card-options">
                {service.options.map((option, idx) => (
                  <div key={idx} className="option-box">
                    <h4>{option.icon} {option.title}</h4>
                    <p>{option.description}</p>
                    <Link to={option.link} className={`btn ${option.buttonClass}`}>
                      {option.buttonText}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <Link to={service.link} className="btn btn-primary">
                {service.buttonText}
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceCards;
