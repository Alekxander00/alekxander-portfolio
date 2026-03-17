import { useNavigate } from 'react-router-dom';
import LogoImage from '../components/ui/LogoImage';
import { useMenu } from '../contexts/MenuContext';

export default function About() {
  const navigate = useNavigate();
  const { setIsOpen } = useMenu();

  const handleLogoClick = () => {
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div
        className="absolute top-4 left-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 cursor-pointer z-30"
        onClick={handleLogoClick}
      >
        <LogoImage opacity={1} size="w-full h-full" />
      </div>
      <div className="max-w-3xl mx-auto pt-16 sm:pt-20">
        <h1 className="text-4xl sm:text-5xl font-trajan mb-6">Sobre Mí</h1>
        <p className="text-base sm:text-lg text-gray-300">
          Aquí va tu biografía, estudios, habilidades, etc.
        </p>
      </div>
    </div>
  );
}