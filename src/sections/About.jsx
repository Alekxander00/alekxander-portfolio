import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LogoImage from '../components/ui/LogoImage';
import DarknessOverlay from '../components/ui/DarknessOverlay';
import ConstellationWater from '../components/ui/ConstellationWater';

export default function About() {
  const navigate = useNavigate();
  const [darkness, setDarkness] = useState({ active: false, position: { x: 0, y: 0 } });

  const handleLogoClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setDarkness({ active: true, position: { x: centerX, y: centerY } });
  };

  const handleDarknessComplete = () => {
    setDarkness({ active: false, position: { x: 0, y: 0 } });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      

      {darkness.active && (
        <DarknessOverlay
          position={darkness.position}
          onComplete={handleDarknessComplete}
        />
      )}
      <div
        className="absolute top-2 left-2 sm:top-4 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 cursor-pointer z-30"
        onClick={handleLogoClick}
      >
        <LogoImage opacity={1} size="w-full h-full" />
      </div>
      <div className="max-w-3xl mx-auto pt-16 sm:pt-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-trajan mb-4 sm:mb-6">Sobre Mí</h1>
        <p className="text-base sm:text-lg text-gray-300">
          WIP
        </p>
        {/* ... más contenido */}
      </div>
    </div>
  );
}