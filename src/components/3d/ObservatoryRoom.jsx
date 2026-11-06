import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function ObservatoryRoom() {
  const runeRingRef = useRef();

  useFrame((_, delta) => {
    if (runeRingRef.current) {
      runeRingRef.current.rotation.z -= delta * 0.05;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Plataforma principal flotante (diorama circular iluminado) */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[12, 11, 0.8, 32]} />
        <meshStandardMaterial color="#2d3748" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Borde exterior resplandeciente */}
      <mesh position={[0, 0.41, 0]}>
        <ringGeometry args={[11.8, 12.1, 64]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.8} />
      </mesh>

      {/* Anillo de glifos/runas central giratorio */}
      <mesh ref={runeRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.42, 0]}>
        <ringGeometry args={[5, 5.4, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#60a5fa" emissiveIntensity={2.0} transparent opacity={0.85} />
      </mesh>

      {/* Plataforma central de mando */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[2.5, 2.8, 0.2, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.05, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#93c5fd" emissiveIntensity={2.5} />
      </mesh>

      {/* Columnas decorativas del observatorio */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const radius = 11.5;
        const x = Math.cos(rad) * radius;
        const z = Math.sin(rad) * radius;

        return (
          <group key={i} position={[x, 2, z]}>
            {/* Pilar */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.3, 0.4, 4, 8]} />
              <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Luz de remate superior */}
            <mesh position={[0, 2.1, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={3.0} />
            </mesh>
            <pointLight position={[0, 2.1, 0]} color="#38bdf8" intensity={2.5} distance={8} />
          </group>
        );
      })}
    </group>
  );
}
