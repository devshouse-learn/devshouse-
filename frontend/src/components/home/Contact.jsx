import './Contact.css';

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="contact-content">
        <h2>Contacto Directo</h2>
        
        <div className="contact-grid">
          <div className="contact-item">
            <span className="contact-icon">📱</span>
            <h3>WhatsApp</h3>
            <a href="https://wa.me/573223590300" target="_blank" rel="noopener noreferrer">
              +57 3223590300
            </a>
          </div>

          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <h3>Email</h3>
            <a href="mailto:info@devshouse.org">
              info@devshouse.org
            </a>
          </div>

          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <h3>Oficinas</h3>
            <p>Ibague, Tolima</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
