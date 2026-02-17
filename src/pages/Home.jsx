import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import CRTFilter from '../components/CRTFilter';
import GlitchText from '../components/GlitchText';
import ParticleBackground from '../components/ParticleBackground';
import TriangleBackground from '../components/TriangleBackground';
import '../styles/home.css';

const Home = () => {
  const [activeConcept, setActiveConcept] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const currentConceptRef = useRef(0);
  const typingIntervalRef = useRef(null);
  
  const concepts = [
    {
      title: "Autonomía",
      description: "Tomar decisiones propias sin delegarlas al sistema, avanzar sin depender de promesas externas y sostener el rumbo incluso cuando hacerlo implica ir más lento o más solo.",
      color: "#00ff88",
      icon: "⟠"
    },
    {
      title: "Adaptabilidad",
      description: "Responder al cambio sin quebrarse, ajustarse a entornos inestables y seguir en movimiento cuando el contexto obliga a replantear la forma, pero no la intención.",
      color: "#00ffff",
      icon: "⟣"
    },
    {
      title: "Autenticidad",
      description: "Permanecer fiel a quién eres y a lo que representas, sin venderte ni diluirte, incluso cuando el entorno recompensa más la apariencia que la coherencia.",
      color: "#ff00ff",
      icon: "⟡"
    }
  ];

  // Función para iniciar el efecto de escritura
  const startTypingEffect = (text) => {
    // Limpiar intervalo anterior
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    
    // Resetear texto
    setDisplayText('');
    setIsTyping(true);
    
    let index = 0;
    const typingSpeed = 30; // ms por carácter
    
    typingIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayText(prev => {
          const newText = text.substring(0, index + 1);
          index++;
          return newText;
        });
      } else {
        setIsTyping(false);
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }, typingSpeed);
  };

  // Cuando cambia el concepto activo
  useEffect(() => {
    if (currentConceptRef.current !== activeConcept) {
      currentConceptRef.current = activeConcept;
      startTypingEffect(concepts[activeConcept].description);
    }
  }, [activeConcept]);

  // Efecto inicial al montar
  useEffect(() => {
    startTypingEffect(concepts[0].description);
    
    // Rotación automática cada 10 segundos
    const rotationInterval = setInterval(() => {
      setActiveConcept(prev => (prev + 1) % concepts.length);
    }, 10000);
    
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      clearInterval(rotationInterval);
    };
  }, []);

  // Efecto de glitch en el título
  useEffect(() => {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        title.classList.add('glitching');
        setTimeout(() => {
          title.classList.remove('glitching');
        }, 200);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Efecto de seguimiento del mouse en tarjetas
  useEffect(() => {
    const cards = document.querySelectorAll('.navigation-card');
    
    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };
    
    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove);
    });
    
    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
      });
    };
  }, []);

  const navigationCards = [
    {
      title: "Sobre mí",
      path: "/about",
      description: "Explora mi enfoque creativo, formación en ingeniería multimedia y visión interdisciplinaria donde la tecnología se encuentra con la narrativa.",
      color: "#00ff88",
      icon: "⟣",
      delay: "0.1s"
    },
  ];

  return (
    <div className="home-page">
      <TriangleBackground />
      <CRTFilter intensity="low">
        <main className="home-hero">
          <div className="hero-content">
            <div className="hero-title-container">
              <GlitchText text="ALEKXANDER" tag="h1" className="hero-title" />
              <div className="title-underline"></div>
            </div>
            
            <div className="hero-subtitle">
              <p className="subtitle-text">
                Creador digital · Ingeniería en Multimedia · Experiencias interactivas
              </p>
            </div>
            
            <div className="concepts-container">
              <div className="concepts-selector">
                {concepts.map((concept, index) => (
                  <button
                    key={index}
                    className={`concept-tab ${activeConcept === index ? 'active' : ''}`}
                    onClick={() => setActiveConcept(index)}
                    style={{
                      '--concept-color': concept.color,
                      borderColor: activeConcept === index ? concept.color : 'transparent'
                    }}
                  >
                    <span className="tab-icon" style={{ color: concept.color }}>
                      {concept.icon}
                    </span>
                    <span className="tab-title">{concept.title}</span>
                  </button>
                ))}
              </div>
              
              <div className="concepts-display">
                <div 
                  className="concept-content"
                  style={{ '--concept-color': concepts[activeConcept].color }}
                >
                  <div className="concept-title-container">
                    <h3 
                      className="concept-title"
                      style={{ color: concepts[activeConcept].color }}
                    >
                      {concepts[activeConcept].title}
                    </h3>
                    <div className="concept-line"></div>
                  </div>
                  
                  <div className="concept-description-wrapper">
                    <p className="concept-description">
                      {displayText}
                      {isTyping && <span className="typing-cursor">|</span>}
                    </p>
                  </div>
                  
                  <div className="concept-nav">
                    <button 
                      className="concept-nav-btn prev"
                      onClick={() => {
                        const prevIndex = activeConcept === 0 ? concepts.length - 1 : activeConcept - 1;
                        setActiveConcept(prevIndex);
                      }}
                      style={{ color: concepts[activeConcept].color }}
                    >
                      ←
                    </button>
                    
                    <div className="concept-indicators">
                      {concepts.map((_, index) => (
                        <button
                          key={index}
                          className={`concept-indicator ${activeConcept === index ? 'active' : ''}`}
                          onClick={() => setActiveConcept(index)}
                          style={{
                            backgroundColor: activeConcept === index 
                              ? concepts[activeConcept].color 
                              : 'rgba(255, 255, 255, 0.1)'
                          }}
                        />
                      ))}
                    </div>
                    
                    <button 
                      className="concept-nav-btn next"
                      onClick={() => {
                        const nextIndex = (activeConcept + 1) % concepts.length;
                        setActiveConcept(nextIndex);
                      }}
                      style={{ color: concepts[activeConcept].color }}
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hero-manifesto">
              <blockquote className="manifesto-text">
                "Donde el código encuentra la narrativa,<br />
                y la tecnología se vuelve experiencia sensorial"
              </blockquote>
            </div>

            <div className="hero-navigation">
              <div className="navigation-grid">
                {navigationCards.map((card, index) => (
                  <Link 
                    to={card.path} 
                    key={index}
                    className="navigation-card"
                    style={{ 
                      '--card-color': card.color,
                      '--delay': card.delay 
                    }}
                  >
                    <div className="card-inner">
                      <div className="card-icon" style={{ color: card.color }}>
                        {card.icon}
                      </div>
                      <h3 className="card-title">{card.title}</h3>
                      <p className="card-description">{card.description}</p>
                      <div className="card-arrow">
                        <span className="arrow-icon">↗</span>
                      </div>
                    </div>
                    <div className="card-glow"></div>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="hero-footer">
              <div className="footer-tagline">
                <p>Explora mi universo digital</p>
                <div className="pulse-dots">
                  <span style={{ backgroundColor: '#00ff88' }}></span>
                  <span style={{ backgroundColor: '#00ffff' }}></span>
                  <span style={{ backgroundColor: '#ff00ff' }}></span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </CRTFilter>
    </div>
  );
};

export default Home;