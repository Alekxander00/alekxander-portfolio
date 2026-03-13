import { useNavigate } from 'react-router-dom';
import LogoImage from '../components/ui/LogoImage';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div
        className="absolute top-4 left-4 w-12 h-12 cursor-pointer z-30"
        onClick={() => navigate('/')}
      >
        <LogoImage opacity={1} size="w-full h-full" />
      </div>
      <div className="max-w-3xl mx-auto pt-20">
        <h1 className="text-5xl font-trajan mb-6">Sobre Mí</h1>
        <p className="text-lg text-gray-300">
          WIP
        </p>
        {/* Agrega más contenido según necesites */}
      </div>
    </div>
  );
}