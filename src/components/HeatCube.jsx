import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const HeatMaterial = {
  uniforms: {
    time: { value: 0 },
    hotspot: { value: new THREE.Vector3(0, 0, 2) },
    colorHot: { value: new THREE.Color(0xff3300) },
    colorWarm: { value: new THREE.Color(0xffaa00) },
    colorCool: { value: new THREE.Color(0x3355aa) },
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 hotspot;
    uniform vec3 colorHot;
    uniform vec3 colorWarm;
    uniform vec3 colorCool;
    varying vec3 vWorldPosition;
    
    void main() {
      float dist = distance(vWorldPosition, hotspot);
      float heat = 1.0 - smoothstep(0.0, 2.5, dist);
      heat = clamp(heat, 0.0, 1.0);
      
      vec3 color;
      if (heat < 0.33) {
        color = mix(colorCool, colorWarm, heat * 3.0);
      } else if (heat < 0.66) {
        color = mix(colorWarm, colorHot, (heat - 0.33) * 3.0);
      } else {
        color = mix(colorHot, vec3(1.0, 1.0, 1.0), (heat - 0.66) * 3.0);
      }
      
      float pulse = sin(time * 5.0 + vWorldPosition.x * 2.0) * 0.1;
      color += pulse * vec3(0.5, 0.2, 0.0);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const Cube = ({ hotspot }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
      meshRef.current.material.uniforms.hotspot.value = hotspot;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <shaderMaterial
        uniforms={HeatMaterial.uniforms}
        vertexShader={HeatMaterial.vertexShader}
        fragmentShader={HeatMaterial.fragmentShader}
      />
    </mesh>
  );
};

const HotspotUpdater = ({ setHotspot }) => {
  const { camera, mouse, raycaster } = useThree();

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera);
    const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2.0);
    const intersection = new THREE.Vector3();
    if (raycaster.ray.intersectSphere(sphere, intersection)) {
      setHotspot(intersection.clone());
    } else {
      const farPoint = raycaster.ray.at(10, new THREE.Vector3());
      setHotspot(farPoint);
    }
  });

  return null;
};

const HeatCube = () => {
  const [hotspot, setHotspot] = useState(new THREE.Vector3(0, 0, 2));

  return (
    <div style={{ width: '100%', height: '500px', background: 'transparent', position: 'relative' }}>
      <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Cube hotspot={hotspot} />
        <HotspotUpdater setHotspot={setHotspot} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <gridHelper args={[10, 20, 0x888888, 0x444444]} />
      </Canvas>
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        pointerEvents: 'none'
      }}>
        🔥 El calor sigue al mouse en 3D
      </div>
    </div>
  );
};

export default HeatCube;