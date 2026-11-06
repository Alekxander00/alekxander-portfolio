import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function CategoryPortal3D({
  item,
  position,
  rotation,
  hasProjects,
  wizardPosition,
  onEnterPortal,
  hideHtml,
}) {
  const vortexRef = useRef();
  const [isNear, setIsNear] = useState(false);

  useFrame((_, delta) => {
    if (vortexRef.current && hasProjects) {
      vortexRef.current.rotation.z += delta * 1.5;
    }

    if (wizardPosition && position) {
      const pVector = new THREE.Vector3(position[0], 0, position[2]);
      const dist = wizardPosition.distanceTo(pVector);

      if (dist < 2.2) {
        if (!isNear) setIsNear(true);
        if (dist < 1.3 && hasProjects && onEnterPortal) {
          onEnterPortal(item);
        }
      } else {
        if (isNear) setIsNear(false);
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (hasProjects && onEnterPortal) {
      onEnterPortal(item);
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Marco Exterior del Portal (Arco) */}
      <mesh castShadow receiveShadow position={[0, 1.8, 0]}>
        <torusGeometry args={[1.3, 0.16, 12, 24, Math.PI]} />
        <meshStandardMaterial
          color={hasProjects ? '#312e81' : '#27272a'}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[-1.3, 0.9, 0]}>
        <cylinderGeometry args={[0.16, 0.19, 1.8, 12]} />
        <meshStandardMaterial color={hasProjects ? '#312e81' : '#27272a'} roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[1.3, 0.9, 0]}>
        <cylinderGeometry args={[0.16, 0.19, 1.8, 12]} />
        <meshStandardMaterial color={hasProjects ? '#312e81' : '#27272a'} roughness={0.3} />
      </mesh>

      {/* Vórtice Mágico Interior del Portal */}
      {hasProjects ? (
        <group position={[0, 1.3, 0]}>
          <mesh ref={vortexRef} onClick={handleClick}>
            <circleGeometry args={[1.2, 32]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive={isNear ? '#93c5fd' : '#3b82f6'}
              emissiveIntensity={isNear ? 3.5 : 2.0}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>

          <Sparkles
            count={50}
            scale={[2.2, 2.2, 0.5]}
            size={5}
            speed={1.8}
            opacity={0.9}
            color={isNear ? '#ffffff' : '#60a5fa'}
          />

          <pointLight
            position={[0, 0, 0.5]}
            color={isNear ? '#ffffff' : '#38bdf8'}
            intensity={isNear ? 4.5 : 2.5}
            distance={8}
          />
        </group>
      ) : (
        <group position={[0, 1.3, 0]}>
          <mesh>
            <circleGeometry args={[1.2, 16]} />
            <meshStandardMaterial
              color="#27272a"
              emissive="#3f3f46"
              emissiveIntensity={0.3}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[1.8, 0.25, 0.05]} />
            <meshStandardMaterial color="#a16207" emissive="#854d0e" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* UI Badge Flotante arriba del Portal (Oculto cuando los modales 2D están abiertos) */}
      {!hideHtml && (
        <Html position={[0, 3.4, 0]} center distanceFactor={16} zIndexRange={[10, 0]}>
          <div
            onClick={handleClick}
            className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-xl border transition-all duration-300 select-none cursor-pointer ${
              hasProjects
                ? isNear
                  ? 'bg-black/90 border-blue-400 text-white shadow-[0_0_25px_rgba(59,130,246,0.9)] scale-110'
                  : 'bg-black/80 border-white/30 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                : 'bg-black/60 border-zinc-800 text-zinc-500'
            }`}
          >
            <div className="flex items-center gap-1.5 font-trajan text-base font-bold tracking-wider">
              <span className={hasProjects ? 'text-blue-400' : 'text-zinc-500'}>
                {item.letter}
              </span>
              <span>-</span>
              <span>{item.category}</span>
            </div>

            <div className="text-[10px] uppercase font-sans tracking-widest mt-0.5">
              {hasProjects ? (
                <span className={isNear ? 'text-blue-300 font-bold animate-pulse' : 'text-blue-400'}>
                  {isNear ? 'Entrar al Portal' : 'Portal Activo'}
                </span>
              ) : (
                <span className="text-zinc-500">En Construcción</span>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
