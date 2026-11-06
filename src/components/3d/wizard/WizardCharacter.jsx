import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useKeyboardControls } from '../../../hooks/useKeyboardControls';

export default function WizardCharacter({ onPositionChange }) {
  const wizardGroupRef = useRef();
  const bodyRef = useRef();
  const staffOrbRef = useRef();
  const positionRef = useRef(new THREE.Vector3(0, 0, 0));
  const targetRotationRef = useRef(0);
  const keys = useKeyboardControls();

  const MOVE_SPEED = 6.5;
  const MAX_RADIUS = 10.5;

  useFrame((state, delta) => {
    if (!wizardGroupRef.current) return;

    // Calcular dirección de movimiento según teclas
    let moveX = 0;
    let moveZ = 0;

    if (keys.forward) moveZ -= 1;
    if (keys.backward) moveZ += 1;
    if (keys.left) moveX -= 1;
    if (keys.right) moveX += 1;

    const isMoving = moveX !== 0 || moveZ !== 0;

    if (isMoving) {
      // Normalizar vector de dirección
      const moveVec = new THREE.Vector2(moveX, moveZ).normalize();
      const dx = moveVec.x * MOVE_SPEED * delta;
      const dz = moveVec.y * MOVE_SPEED * delta;

      // Nueva posición calculada
      const newX = positionRef.current.x + dx;
      const newZ = positionRef.current.z + dz;

      // Delimitar dentro de la plataforma circular del observatorio
      const distFromCenter = Math.hypot(newX, newZ);
      if (distFromCenter <= MAX_RADIUS) {
        positionRef.current.x = newX;
        positionRef.current.z = newZ;
      } else {
        // Deslizar por el borde si se supera el límite
        const angle = Math.atan2(newZ, newX);
        positionRef.current.x = Math.cos(angle) * MAX_RADIUS;
        positionRef.current.z = Math.sin(angle) * MAX_RADIUS;
      }

      // Calcular ángulo de rotación del personaje
      targetRotationRef.current = Math.atan2(moveX, moveZ);

      // Bamboleo de caminata
      if (bodyRef.current) {
        bodyRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 12) * 0.08;
        bodyRef.current.position.y = 0.8 + Math.abs(Math.sin(state.clock.elapsedTime * 12)) * 0.1;
      }
    } else {
      if (bodyRef.current) {
        bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, 0, delta * 8);
        bodyRef.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
      }
    }

    // Aplicar traslación al grupo 3D
    wizardGroupRef.current.position.copy(positionRef.current);

    // Suavizar rotación del mago
    const currentRot = wizardGroupRef.current.rotation.y;
    const targetRot = targetRotationRef.current;
    const diff = Math.atan2(Math.sin(targetRot - currentRot), Math.cos(targetRot - currentRot));
    wizardGroupRef.current.rotation.y += diff * Math.min(delta * 12, 1);

    // Rotación del orbe mágico del báculo
    if (staffOrbRef.current) {
      staffOrbRef.current.rotation.y += delta * 2;
    }

    // Notificar la posición actualizada al componente padre (para cámara y portales)
    if (onPositionChange) {
      onPositionChange(positionRef.current.clone());
    }
  });

  return (
    <group ref={wizardGroupRef} position={[0, 0, 0]}>
      <group ref={bodyRef} position={[0, 0.8, 0]}>
        {/* Túnica del Mago (Cuerpo) */}
        <mesh castShadow position={[0, 0, 0]}>
          <coneGeometry args={[0.45, 1.2, 12]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Borde inferior de la túnica */}
        <mesh position={[0, -0.55, 0]}>
          <torusGeometry args={[0.42, 0.04, 8, 16]} />
          <meshStandardMaterial color="#818cf8" emissive="#4338ca" emissiveIntensity={0.8} />
        </mesh>

        {/* Capucha / Cabeza */}
        <mesh castShadow position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.28, 12, 12]} />
          <meshStandardMaterial color="#312e81" roughness={0.5} />
        </mesh>

        {/* Ojos resplandecientes mágicos */}
        <mesh position={[-0.09, 0.58, 0.22]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={3} />
        </mesh>
        <mesh position={[0.09, 0.58, 0.22]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={3} />
        </mesh>

        {/* Sombrero de Mago Cónico */}
        <group position={[0, 0.72, 0]} rotation={[-0.1, 0, 0]}>
          {/* Ala del sombrero */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.04, 16]} />
            <meshStandardMaterial color="#1e1b4b" roughness={0.3} />
          </mesh>
          {/* Cono del sombrero */}
          <mesh position={[0, 0.45, 0]}>
            <coneGeometry args={[0.38, 0.9, 12]} />
            <meshStandardMaterial color="#1e1b4b" roughness={0.3} />
          </mesh>
          {/* Cinta dorada/azul del sombrero */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.08, 16]} />
            <meshStandardMaterial color="#818cf8" emissive="#6366f1" emissiveIntensity={1} />
          </mesh>
        </group>

        {/* Báculo Mágico en la mano derecha */}
        <group position={[0.42, 0.1, 0.15]}>
          {/* Vara de madera */}
          <mesh castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 1.4, 8]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
          {/* Engaste del orbe */}
          <mesh position={[0, 0.72, 0]}>
            <torusGeometry args={[0.09, 0.02, 8, 12]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Orbe Mágico Flotante Resplandeciente */}
          <mesh ref={staffOrbRef} position={[0, 0.82, 0]}>
            <octahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={3} />
          </mesh>
          <pointLight position={[0, 0.82, 0]} color="#38bdf8" intensity={2} distance={4} />
        </group>
      </group>

      {/* Rastro de Partículas Mágicas bajo los pies del Mago */}
      <Sparkles
        count={25}
        scale={[1.2, 0.5, 1.2]}
        size={2}
        speed={0.8}
        opacity={0.7}
        color="#818cf8"
      />
    </group>
  );
}
