import './Description.css';

const Description = () => {
  return (
    <section className="description">
      <div className="description-content">
        <h2>¿Qué es DEVSHOUSE?</h2>
        
        <p className="description-text">
          DEVSHOUSE es una plataforma educativa innovadora que conecta a estudiantes, emprendedores y empresas en un ecosistema colaborativo. Nuestro objetivo es democratizar el acceso a la educación en tecnología y crear puentes entre la academia y el mundo laboral.
        </p>

        <div className="description-features">
          <div className="feature">
            <div className="feature-icon">�️</div>
            <h3>Educación Colaborativa</h3>
            <p>Acceso a convenios educativos y programas de formación en tecnología</p>
          </div>

          <div className="feature">
            <div className="feature-icon">▪️</div>
            <h3>Emprendimiento</h3>
            <p>Conecta con otros emprendedores y desarrolla tus proyectos innovadores</p>
          </div>

          <div className="feature">
            <div className="feature-icon">◼️</div>
            <h3>Oportunidades Laborales</h3>
            <p>Encuentra empleos en tecnología y desarrolla tu carrera profesional</p>
          </div>

          <div className="feature">
            <div className="feature-icon">■</div>
            <h3>Comunidad</h3>
            <p>Sé parte de una comunidad global de desarrolladores y profesionales</p>
          </div>
        </div>

        <div className="description-mission">
          <div className="mission-item">
            <h4>● Nuestra Misión</h4>
            <p>Transformar el acceso a la educación en tecnología y crear oportunidades reales para estudiantes, emprendedores y profesionales del sector.</p>
          </div>

          <div className="mission-item">
            <h4>◆ Nuestra Visión</h4>
            <p>Ser la plataforma líder que conecta talento, educación y oportunidades en la industria tecnológica a nivel global.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Description;
