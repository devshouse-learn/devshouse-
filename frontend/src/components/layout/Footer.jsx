import './Footer.css';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      emoji: '👍',
      url: 'https://www.facebook.com/share/1G9QVn3rdd/'
    },
    {
      name: 'Instagram',
      emoji: '📷',
      url: 'https://www.instagram.com/devshouseorg'
    },
    {
      name: 'YouTube',
      emoji: '🎥',
      url: 'https://www.youtube.com/@devshouse'
    }
  ];

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section social-section">
          <h4>Síguenos en nuestras redes</h4>
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
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 DEVSHOUSE. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
