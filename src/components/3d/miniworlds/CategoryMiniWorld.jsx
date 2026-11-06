import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import SkyboxStars from '../SkyboxStars';
import WizardCharacter from '../wizard/WizardCharacter';
import { projects } from '../../../constants/projects';

export default function CategoryMiniWorld({
  category,
  onSelectProject,
  onReturnToHub,
  hideHtml,
}) {
  const [wizardPos, setWizardPos] = useState(new THREE.Vector3(0, 0, 0));
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const hasReturnedRef = useRef(false);

  const filteredProjects = projects.filter((p) => p.category === category);

  // Cámara sigue suavemente al Mago y detecta toque de portal de retorno
  useFrame((state, delta) => {
    const targetCamX = wizardPos.x;
    const targetCamY = wizardPos.y + 7;
    const targetCamZ = wizardPos.z + 11;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, delta * 4);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, delta * 4);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, delta * 4);

    cameraTargetRef.current.lerp(wizardPos, delta * 6);
    state.camera.lookAt(cameraTargetRef.current.x, cameraTargetRef.current.y + 0.8, cameraTargetRef.current.z);

    // Si el Mago toca el portal de retorno (borde norte)
    const returnPos = new THREE.Vector3(0, 0, -8.5);
    if (wizardPos.distanceTo(returnPos) < 1.3 && onReturnToHub && !hasReturnedRef.current) {
      hasReturnedRef.current = true;
      onReturnToHub();
    }
  });

  return (
    <>
      {/* Iluminación clara y potente para el Mini-Mundo */}
      <ambientLight intensity={1.2} color="#ffffff" />
      <hemisphereLight skyColor="#ffffff" groundColor="#334466" intensity={1.5} />
      <directionalLight position={[15, 25, 15]} intensity={2.5} castShadow />
      <directionalLight position={[-15, 15, -15]} intensity={1.2} color="#99ccff" />
      <pointLight position={[0, 8, 0]} intensity={3.0} color="#60a5fa" distance={25} />

      {/* Fondo estelar */}
      <SkyboxStars />

      {/* Isla Flotante del Mini-Mundo */}
      <group position={[0, -1, 0]}>
        {/* Plataforma principal clara */}
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[11, 10, 0.8, 6]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Anillo de resplandor interior */}
        <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[9.5, 10.2, 32]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* Título Central de la Categoría */}
      <group position={[0, 1.2, 0]}>
        <mesh>
          <cylinderGeometry args={[1.8, 2.0, 0.4, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.8} />
        </mesh>

        {!hideHtml && (
          <Html position={[0, 1.4, 0]} center distanceFactor={14} zIndexRange={[10, 0]}>
            <div className="flex flex-col items-center bg-black/85 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-blue-400/50 text-center select-none shadow-[0_0_25px_rgba(59,130,246,0.7)]">
              <span className="text-blue-300 text-[10px] font-sans uppercase tracking-widest font-semibold">
                Dimensión Mágica
              </span>
              <h2 className="font-trajan text-2xl font-bold text-white tracking-wider">
                {category}
              </h2>
            </div>
          </Html>
        )}
      </group>

      {/* Portales / Altares de los Proyectos */}
      {filteredProjects.map((project, index) => {
        const total = filteredProjects.length;
        const angle = (index * (Math.PI * 2)) / Math.max(total, 1) - Math.PI / 2;
        const radius = 6.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const pVector = new THREE.Vector3(x, 0, z);
        const distToWizard = wizardPos ? wizardPos.distanceTo(pVector) : 99;
        const isNear = distToWizard < 2.5;

        return (
          <group
            key={project.id}
            position={[x, 1.6, z]}
            rotation={[0, -angle - Math.PI / 2, 0]}
          >
            {/* Marco de Altar 3D */}
            <mesh
              castShadow
              onClick={() => onSelectProject(project)}
              onPointerOver={() => (document.body.style.cursor = 'pointer')}
              onPointerOut={() => (document.body.style.cursor = 'auto')}
            >
              <boxGeometry args={[2.8, 1.8, 0.2]} />
              <meshStandardMaterial
                color={isNear ? '#1e293b' : '#334155'}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* Resplandor del marco */}
            <mesh position={[0, 0, 0.11]}>
              <planeGeometry args={[2.6, 1.6]} />
              <meshStandardMaterial
                color={isNear ? '#ffffff' : '#38bdf8'}
                emissive={isNear ? '#60a5fa' : '#1d4ed8'}
                emissiveIntensity={isNear ? 2.5 : 1.2}
              />
            </mesh>

            {/* Partículas alrededor del Altar */}
            <Sparkles count={30} scale={[2.5, 2.5, 1]} size={4} speed={1.2} color="#60a5fa" />
            <pointLight position={[0, 0, 0.6]} intensity={isNear ? 3.5 : 1.5} color="#38bdf8" />

            {/* UI Overlay con Título e Imagen */}
            {!hideHtml && (
              <Html position={[0, 1.8, 0]} center distanceFactor={14} zIndexRange={[10, 0]}>
                <div
                  onClick={() => onSelectProject(project)}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 cursor-pointer select-none max-w-xs ${
                    isNear
                      ? 'bg-black/90 border-blue-400 text-white shadow-[0_0_30px_rgba(59,130,246,0.9)] scale-105'
                      : 'bg-black/80 border-white/20 text-white shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-48 h-28 object-cover rounded-xl mb-2 border border-white/20"
                  />
                  <h3 className="font-trajan text-sm font-bold text-center text-white line-clamp-1">
                    {project.title}
                  </h3>
                  <span className={`text-[10px] uppercase tracking-widest mt-1 font-sans font-bold ${isNear ? 'text-blue-300 animate-pulse' : 'text-blue-400'}`}>
                    {isNear ? 'Haz clic para Ver Proyecto' : 'Ver Proyecto'}
                  </span>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Portal de Retorno al Hub del Mago (En el borde norte) */}
      <group position={[0, 1.5, -8.5]}>
        <mesh
          onClick={onReturnToHub}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <torusGeometry args={[1.4, 0.15, 12, 24]} />
          <meshStandardMaterial color="#818cf8" emissive="#6366f1" emissiveIntensity={2.5} />
        </mesh>

        {!hideHtml && (
          <Html position={[0, 2.4, 0]} center distanceFactor={14} zIndexRange={[10, 0]}>
            <button
              onClick={onReturnToHub}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950/90 border border-indigo-400 text-white font-trajan text-sm font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.8)]"
            >
              <span>Regresar al Hub del Mago</span>
            </button>
          </Html>
        )}
      </group>

      {/* Personaje Mago Controlable dentro del Mini-Mundo */}
      <WizardCharacter onPositionChange={setWizardPos} />
    </>
  );
}
