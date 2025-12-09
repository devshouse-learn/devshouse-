import './Impact.css';

const featuresData = [
  {
    icon: '',
    title: 'Rápido y Eficiente',
    description: 'Acceso inmediato a oportunidades sin trámites complicados'
  },
  {
    icon: '',
    title: 'Seguro y Confiable',
    description: 'Tu información está protegida con los más altos estándares'
  },
  {
    icon: '',
    title: 'Alcance Global',
    description: 'Conecta con profesionales y oportunidades en todo el mundo'
  },
  {
    icon: '',
    title: 'Accesible en Cualquier Lugar',
    description: 'Plataforma responsive optimizada para todos los dispositivos'
  }
];

const Impact = () => {
  return (
    <section className="impact-section">
      <h3>¿Por qué elegir DEVSHOUSE?</h3>
      <div className="impact-grid">
        {featuresData.map((item, index) => (
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
