import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';

export default function SkyboxStars() {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Estrellas cósmicas lejanas */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      {/* Partículas de polvo místico / resplandor cercano */}
      <Sparkles
        count={150}
        scale={[30, 20, 30]}
        size={3}
        speed={0.4}
        opacity={0.6}
        color="#ffffff"
      />
      <Sparkles
        count={80}
        scale={[25, 15, 25]}
        size={5}
        speed={0.6}
        opacity={0.4}
        color="#88ccff"
      />
    </group>
  );
}
