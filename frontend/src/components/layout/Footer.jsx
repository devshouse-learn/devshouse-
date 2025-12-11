import './Footer.css';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: 'https://www.facebook.com/share/1G9QVn3rdd/'
    },
    {
      name: 'Instagram',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.521 17.172c-.147.565-.546 1.058-1.07 1.47-.524.412-1.208.673-1.97.755-1.924.2-3.055.2-5.481.2s-3.557 0-5.481-.2c-.762-.082-1.446-.343-1.97-.755-.524-.412-.923-.905-1.07-1.47-.23-.86-.348-2.18-.348-3.672V9.5c0-1.492.118-2.812.348-3.672.147-.565.546-1.058 1.07-1.47.524-.412 1.208-.673 1.97-.755 1.924-.2 3.055-.2 5.481-.2s3.557 0 5.481.2c.762.082 1.446.343 1.97.755.524.412.923.905 1.07 1.47.23.86.348 2.18.348 3.672v4.828c0 1.492-.118 2.812-.348 3.672zm-4.08-8.98a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm0-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm3.5 2a.5.5 0 11-1 0 .5.5 0 011 0z"/>
        </svg>
      ),
      url: 'https://www.instagram.com/devshouseorg'
    },
    {
      name: 'YouTube',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
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
                <span className="social-icon">{social.icon}</span>
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
