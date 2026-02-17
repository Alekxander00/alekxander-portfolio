import React from 'react';
import CRTFilter from '../components/CRTFilter';
import '../styles/about.css';

const About = () => {
  return (
    <div className="about-page">
      <CRTFilter intensity="medium">
        <div className="about-container">
          <div className="about-header">
            <h1 className="about-title">
              <span className="title-text">SOBRE MÍ</span>
              <span className="title-glitch"></span>
            </h1>
            <div className="title-subtitle">
              Más allá del código, dentro de la creación
            </div>
          </div>

          <div className="about-content">
            <section className="about-section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-number">01</span>
                  PERFIL
                </h2>
                <div className="section-line"></div>
              </div>

              <div className="section-content">
                <p className="about-paragraph">
                  Soy <span className="highlight">Ingeniero en Multimedia</span> con experiencia como desarrollador fullstack, pero mi verdadera pasión reside en la intersección entre la tecnología y la expresión creativa, y no me defino por una sola herramienta o lenguaje, sino por la forma en que conecto <span className="highlight">código, imagen, sonido y experiencia</span> para crear narrativas digitales que trascienden lo meramente funcional.
                </p>


                <div className="profile-tags">
                  <span className="tag">Desarrollo Web</span>
                  <span className="tag">Experiencias Interactivas</span>
                  <span className="tag">Animación Digital</span>
                  <span className="tag">Narrativa Transmedia</span>
                  <span className="tag">Arte Generativo</span>
                </div>
              </div>
            </section>

            <section className="about-section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-number">02</span>
                  ENFOQUE CREATIVO
                </h2>
                <div className="section-line"></div>
              </div>

              <div className="section-content">
                <p className="about-paragraph">
                  Mi trabajo se centra en el desarrollo de <span className="highlight">experiencias digitales interactivas </span>
                  que combinan precisión técnica con intención artística. Creo en la tecnología como medio expresivo,
                  no como fin en sí mismo.
                </p>

                <div className="approach-grid">
                  <div className="approach-item">
                    <div className="approach-icon">⟢</div>
                    <h3 className="approach-title">Tecnología Narrativa</h3>
                    <p className="approach-description">
                      Uso del código para contar historias y crear mundos inmersivos
                    </p>
                  </div>

                  <div className="approach-item">
                    <div className="approach-icon">⟣</div>
                    <h3 className="approach-title">Estética Digital</h3>
                    <p className="approach-description">
                      Exploración de lenguajes visuales del internet y la cultura digital
                    </p>
                  </div>

                  <div className="approach-item">
                    <div className="approach-icon">⟠</div>
                    <h3 className="approach-title">Interacción Sensorial</h3>
                    <p className="approach-description">
                      Diseño de experiencias que involucran múltiples sentidos y capas de significado
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </CRTFilter>
    </div>
  );
};

export default About;