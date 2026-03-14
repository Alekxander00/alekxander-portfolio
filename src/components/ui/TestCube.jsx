import { Canvas } from '@react-three/fiber';

function Cube() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export default function TestCube() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'black' }}>
      <Canvas camera={{ position: [2, 2, 2] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <Cube />
      </Canvas>
    </div>
  );
}