import React from 'react';
import '../styles/components.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <p className="footer-tagline">
            Portafolio conceptual · Ingeniería en Multimedia · {currentYear}
          </p>
        </div>
        
        <div className="footer-section">
          <p className="footer-manifesto">
            "La tecnología como medio expresivo, no como fin"
          </p>
        </div>
        
        <div className="footer-section">
          <div className="footer-links">
            <a 
              href="mailto: alxomao@gmail.com" 
              className="footer-link"
              onMouseEnter={(e) => {
                e.target.style.textShadow = '0 0 10px var(--color-accent-neon-cyan)';
              }}
              onMouseLeave={(e) => {
                e.target.style.textShadow = 'none';
              }}
            >
              alxomao@gmail.com
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {currentYear} Alekxander · Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;