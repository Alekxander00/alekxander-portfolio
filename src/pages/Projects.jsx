import React from 'react';
import CRTFilter from '../components/CRTFilter';
import ProjectCard from '../components/ProjectCard';
import '../styles/projects.css';

const projectsData = [
  {
    id: 'heatcube',
    title: 'Cubo de Calor',
    description: 'Modelo 3D interactivo con shader que simula radiación térmica. Reacciona al movimiento del mouse en tiempo real.',
    image: '/images/Calor.jpg', // Reemplaza con tu imagen real
    tags: ['Three.js', 'Shader', 'Interactivo'],
    color: '#ff5500'
  },
  {
    id: 'proyecto2',
    title: 'Proyecto 2',
    description: 'Descripción breve del segundo proyecto. Aquí puedes poner detalles interesantes.',
    image: '/images/project2.jpg',
    tags: ['React', 'CSS', 'Animación'],
    color: '#3399ff'
  },
  {
    id: 'proyecto3',
    title: 'Proyecto 3',
    description: 'Un proyecto en Blender con modelado 3D y texturizado. Incluye animación y renderizado.',
    image: '/images/project3.jpg',
    tags: ['Blender', '3D', 'Animación'],
    color: '#9966ff'
  }
];

const Projects = () => {
  return (
    <div className="projects-page">
      <CRTFilter intensity="medium">
        <div className="projects-container">
          <div className="projects-header">
            <h1 className="projects-title">
              <span className="title-text">PROYECTOS</span>
              <span className="title-glitch"></span>
            </h1>
            <div className="title-subtitle">
              Una colección de trabajos que fusionan tecnología y creatividad
            </div>
          </div>

          <div className="projects-grid-cards">
            {projectsData.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </CRTFilter>
    </div>
  );
};

export default Projects;