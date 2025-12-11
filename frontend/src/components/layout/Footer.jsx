import './Footer.css';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      emoji: '👍',
      url: 'https://facebook.com/devshouse'
    },
    {
      name: 'Instagram',
      emoji: '📷',
      url: 'https://instagram.com/devshouse'
    },
    {
      name: 'YouTube',
      emoji: '🎥',
      url: 'https://youtube.com/@devshouse'
    }
  ];

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h4>Síguenos en Redes</h4>
          <div className="social-links">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title={social.name}
              >
                <span className="social-emoji">{social.emoji}</span>
                <span className="social-name">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-section">
          <h4>Transparencia</h4>
          <a href="/esal" className="transparency-link">
            📋 ESAL
          </a>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 DEVSHOUSE. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
