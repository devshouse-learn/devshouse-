import './Impact.css';

const impactData = [
  {
    icon: '🎓',
    title: 'Estudiantes',
    description: 'Formación en tecnologías actuales y oportunidades de práctica'
  },
  {
    icon: '🏫',
    title: 'Instituciones Educativas',
    description: 'Programas de capacitación y convenios educativos'
  },
  {
    icon: '🚀',
    title: 'Emprendedores',
    description: 'Visibilidad, networking y oportunidades de inversión'
  },
  {
    icon: '💼',
    title: 'Empresas',
    description: 'Acceso a talento calificado y reclutamiento eficiente'
  }
];

const Impact = () => {
  return (
    <section className="impact-section">
      <h3>¿A quiénes impacta?</h3>
      <div className="impact-grid">
        {impactData.map((item, index) => (
          <div key={index} className="impact-item">
            <span className="impact-icon">{item.icon}</span>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Impact;
