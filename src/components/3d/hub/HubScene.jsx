import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SkyboxStars from '../SkyboxStars';
import ObservatoryRoom from '../ObservatoryRoom';
import CategoryPortal3D from './CategoryPortal3D';
import WizardCharacter from '../wizard/WizardCharacter';
import { lettersData } from '../../../constants/categories';
import { projects } from '../../../constants/projects';

export default function HubScene({ onEnterCategory, isModalOpen }) {
  const [wizardPos, setWizardPos] = useState(new THREE.Vector3(0, 0, 0));
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));

  const categoryHasProjects = (category) => {
    return projects.some((p) => p.category === category);
  };

  const RADIUS = 8.5;
  const portalsWithPositions = lettersData.map((item, index) => {
    const angle = (index * (Math.PI * 2)) / lettersData.length - Math.PI / 2;
    const x = Math.cos(angle) * RADIUS;
    const z = Math.sin(angle) * RADIUS;
    const rotationY = Math.atan2(-x, -z);

    return {
      ...item,
      position: [x, 0, z],
      rotation: [0, rotationY, 0],
    };
  });

  useFrame((state, delta) => {
    const targetCamX = wizardPos.x;
    const targetCamY = wizardPos.y + 7;
    const targetCamZ = wizardPos.z + 11;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, delta * 4);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, delta * 4);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, delta * 4);

    cameraTargetRef.current.lerp(wizardPos, delta * 6);
    state.camera.lookAt(cameraTargetRef.current.x, cameraTargetRef.current.y + 0.8, cameraTargetRef.current.z);
  });

  return (
    <>
      {/* Iluminación clara y potente */}
      <ambientLight intensity={1.2} color="#ffffff" />
      <hemisphereLight skyColor="#ffffff" groundColor="#334466" intensity={1.5} />
      <directionalLight
        position={[15, 25, 15]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-15, 15, -15]} intensity={1.2} color="#99ccff" />
      <pointLight position={[0, 8, 0]} intensity={3.0} color="#88ccff" distance={25} />

      {/* Fondo estelar */}
      <SkyboxStars />

      {/* Plataforma circular del Observatorio */}
      <ObservatoryRoom />

      {/* Portales de Categorías */}
      {portalsWithPositions.map((item) => (
        <CategoryPortal3D
          key={item.index}
          item={item}
          position={item.position}
          rotation={item.rotation}
          hasProjects={categoryHasProjects(item.category)}
          wizardPosition={wizardPos}
          onEnterPortal={onEnterCategory}
          hideHtml={isModalOpen}
        />
      ))}

      {/* Personaje del Mago Controlable */}
      <WizardCharacter onPositionChange={setWizardPos} />
    </>
  );
}
