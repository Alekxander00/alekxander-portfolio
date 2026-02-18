import React from 'react';
import { useParams } from 'react-router-dom';
import CRTFilter from '../components/CRTFilter';
import HeatCube from '../components/HeatCube';
import '../styles/project-detail.css';

const ProjectDetail = () => {
  const { id } = useParams();

  if (id !== 'heatcube') {
    return <div>Proyecto no encontrado</div>;
  }

  return (
    <div className="project-detail-page">
      <CRTFilter intensity="medium">
        <div className="detail-container">
          <div className="detail-header">
            <h1 className="detail-title">Cubo de Calor</h1>
            <div className="detail-meta">
              <span className="meta-tag">Three.js</span>
              <span className="meta-tag">Shader</span>
              <span className="meta-tag">2025</span>
            </div>
          </div>

          <div className="detail-content">
            <div className="detail-visual">
              <HeatCube />
            </div>
            <div className="detail-description">
              <h2>Descripción del proyecto</h2>
              <p>
                Este proyecto explora la interacción entre geometría y material mediante 
                un shader que simula la radiación de calor. Inspirado en efectos de 
                postproducción de cine, el cubo cambia de color según la proximidad del 
                cursor en el espacio 3D, creando un efecto visual que recuerda a la termografía.
              </p>
              <p>
                Modelado en Blender con topology optimizada para web, y material 
                desarrollado en Three.js usando shaders GLSL. La superficie reacciona 
                en tiempo real a la posición del mouse, generando un punto caliente 
                que se desplaza sobre las caras del cubo.
              </p>
              <h3>Proceso de creación</h3>
              <ul>
                <li>Modelado low-poly en Blender para mantener rendimiento.</li>
                <li>UV mapping para controlar la influencia del calor.</li>
                <li>Shader personalizado que mezcla colores basado en distancia en el mundo.</li>
                <li>Integración con React Three Fiber para interactividad.</li>
                <li>Optimización de renderizado para dispositivos móviles.</li>
              </ul>
            </div>
          </div>
        </div>
      </CRTFilter>
    </div>
  );
};

export default ProjectDetail;