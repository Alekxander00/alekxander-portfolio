import { motion } from 'framer-motion';
import { useState } from 'react';
import LogoImage from '../components/ui/LogoImage';
import { useMenu } from '../contexts/MenuContext';
import ConstellationWater from '../components/ui/ConstellationWater';

export default function About() {
  const { setIsOpen } = useMenu();
  const [clickPosition, setClickPosition] = useState(null);
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => setIsOpen(true);
  const handleBackgroundClick = (e) => {
    setClickPosition({ x: e.clientX, y: e.clientY });
    setClickCount(prev => prev + 1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6 } },
  };

  return (
    <div
      className="relative min-h-screen bg-black text-white overflow-x-hidden"
      onClick={handleBackgroundClick}
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ConstellationWater clickPosition={clickPosition} clickId={clickCount} />
      </div>

      <div
        className="absolute top-4 left-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 z-30 cursor-pointer"
        onClick={handleLogoClick}
      >
        <LogoImage opacity={1} size="w-full h-full" />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 py-16 md:py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-trajan text-center mb-8 md:mb-12"
          style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
        >
          Sobre mí
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 mb-10"
        >
          <p className="text-base md:text-lg leading-relaxed mb-4">
            Soy un apasionado del desarrollo de <span className="text-white font-semibold">videojuegos</span> y <span className="text-white font-semibold">aplicaciones web</span>. 
            Me encanta crear experiencias que no solo funcionen, sino que <span className="text-white font-semibold">conecten con las personas</span>. 
            Para mí, la tecnología es un lienzo donde la lógica se encuentra con la expresividad.
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            Mi trabajo se centra en la <span className="text-white font-semibold">calidad hacia el usuario</span>: cada interacción debe ser fluida, cada animación debe contar algo, 
            y cada detalle debe tener una razón de ser. Me obsesiona la <span className="text-white font-semibold">interactividad</span> y la <span className="text-white font-semibold">expresividad</span> 
            porque creo que el software puede ser funcional y, al mismo tiempo, emocionante.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            Desde sistemas complejos de <span className="text-white font-semibold">movimiento en 3D</span> hasta interfaces web elegantes, busco que cada proyecto tenga 
            <span className="text-white font-semibold"> identidad propia</span>. Mi portafolio es el reflejo de esa filosofía: oscuridad, luz, transiciones dramáticas y 
            una narrativa que invita a explorar.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-2xl md:text-3xl font-trajan text-center mb-6 border-b border-white/20 inline-block w-full pb-2">
            Lo que me mueve
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Interactividad", desc: "Cada clic, cada hover, cada transición debe sentirse viva." },
              { title: "Expresividad", desc: "El código no solo resuelve problemas: también comunica emociones." },
              { title: "Calidad UX", desc: "Pienso en la persona que usa lo que creo, desde el primer boceto." },
              { title: "Identidad visual", desc: "Estética coherente, detalles que cuentan una historia." }
            ].map((item, idx) => (
              <div
                key={idx}
                className="border border-white/20 rounded-lg p-4 bg-black/20 hover:border-white/60 transition-all duration-300 hover:shadow-[0_0_12px_rgba(255,255,255,0.2)]"
              >
                <h3 className="text-xl font-trajan text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-2xl md:text-3xl font-trajan mb-6">Descarga mi CV</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/cv-estilizado.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-white/60 text-white font-semibold transition-all duration-300 hover:border-white hover:shadow-[0_0_12px_rgba(255,255,255,0.5)]"
            >
              📄 CV Estilizado
            </a>
            <a
              href="/cv-ats.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-white/60 text-white font-semibold transition-all duration-300 hover:border-white hover:shadow-[0_0_12px_rgba(255,255,255,0.5)]"
            >
              📄 CV ATS (Legible)
            </a>
          </div>
          <p className="text-gray-400 text-sm mt-4">*Ambos en formato PDF, una página cada uno.</p>
        </motion.div>

        {/* Bloque de redes sociales */}
        <motion.div variants={itemVariants} className="text-center mt-10">
          <h2 className="text-2xl md:text-3xl font-trajan mb-6">Conéctate conmigo</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.instagram.com/alekxander____/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-white/60 text-white font-semibold transition-all duration-300 hover:border-white hover:shadow-[0_0_12px_rgba(255,255,255,0.5)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/alekxander-ordo%C3%B1ez-2797133b7/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-white/60 text-white font-semibold transition-all duration-300 hover:border-white hover:shadow-[0_0_12px_rgba(255,255,255,0.5)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              LinkedIn
            </a>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center text-gray-500 text-sm mt-16 border-t border-white/10 pt-6"
        >
          <p>“Construyo puentes entre la lógica y la emoción”</p>
        </motion.div>
      </motion.div>
    </div>
  );
}