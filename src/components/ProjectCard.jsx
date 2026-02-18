import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/project-card.css';

const ProjectCard = ({ project }) => {
  const { id, title, description, image, tags, color } = project;
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };
    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className="project-card"
      style={{ '--card-color': color }}
    >
      <div className="card-image">
        <img src={image} alt={title} />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-tags">
          {tags.map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
        <Link to={`/projects/${id}`} className="card-link">
          <span className="link-text">Ver proyecto</span>
          <span className="link-arrow">↗</span>
        </Link>
      </div>
      <div className="card-glow"></div>
    </div>
  );
};

export default ProjectCard;