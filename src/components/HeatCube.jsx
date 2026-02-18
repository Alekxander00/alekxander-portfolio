import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const HeatMaterial = {
  uniforms: {
    time: { value: 0 },
    hotspot: { value: new THREE.Vector3(0, 0, 2) },
    mouseDistance: { value: 10.0 }, // distancia del mouse al cubo
    colorHot: { value: new THREE.Color(0xff3300) },
    colorWarm: { value: new THREE.Color(0xffaa00) },
    colorCool: { value: new THREE.Color(0x3355aa) },
    maxDist: { value: 8.0 }, // distancia máxima para efecto de calor
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
    uniform float mouseDistance;
    uniform vec3 colorHot;
    uniform vec3 colorWarm;
    uniform vec3 colorCool;
    uniform float maxDist;
    varying vec3 vWorldPosition;
    
    void main() {
      // Distancia desde el fragmento al hotspot
      float distToHotspot = distance(vWorldPosition, hotspot);
      float localHeat = 1.0 - smoothstep(0.0, 3.0, distToHotspot);
      localHeat = clamp(localHeat, 0.0, 1.0);
      
      // Factor global basado en la distancia del mouse al cubo
      float globalHeat = 1.0 - smoothstep(0.0, maxDist, mouseDistance);
      globalHeat = clamp(globalHeat, 0.0, 1.0);
      
      // Combinar: el calor local se modula por el global
      float heat = localHeat * globalHeat;
      
      // Mezclar colores según la temperatura
      vec3 color;
      if (heat < 0.33) {
        color = mix(colorCool, colorWarm, heat * 3.0);
      } else if (heat < 0.66) {
        color = mix(colorWarm, colorHot, (heat - 0.33) * 3.0);
      } else {
        color = mix(colorHot, vec3(1.0, 1.0, 1.0), (heat - 0.66) * 3.0);
      }
      
      // Pequeño pulso para dar vida
      float pulse = sin(time * 5.0 + vWorldPosition.x * 2.0) * 0.1;
      color += pulse * vec3(0.5, 0.2, 0.0);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const Cube = ({ hotspot, mouseDistance }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
      meshRef.current.material.uniforms.hotspot.value = hotspot;
      meshRef.current.material.uniforms.mouseDistance.value = mouseDistance;
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

const HotspotUpdater = ({ setHotspot, setMouseDistance }) => {
  const { camera, mouse, raycaster, scene } = useThree();
  const cubeRef = useRef(new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1)));

  useFrame(() => {
    // Crear un rayo desde la cámara a través del mouse
    raycaster.setFromCamera(mouse, camera);

    // Obtener la matriz del mundo del cubo (asumimos que el cubo está en el origen)
    // Para simplificar, trabajamos en el espacio del mundo y asumimos que el cubo está centrado en (0,0,0)
    const cubeMin = new THREE.Vector3(-1, -1, -1);
    const cubeMax = new THREE.Vector3(1, 1, 1);
    
    // Intersectar el rayo con el cubo
    const intersectionPoint = new THREE.Vector3();
    if (raycaster.ray.intersectBox(cubeRef.current, intersectionPoint)) {
      // Hay intersección: el hotspot es el punto de impacto
      setHotspot(intersectionPoint.clone());
      
      // Distancia desde la cámara al punto de intersección (en unidades del mundo)
      const dist = camera.position.distanceTo(intersectionPoint);
      setMouseDistance(dist);
    } else {
      // No hay intersección: calcular la distancia mínima del rayo al cubo
      const distToBox = raycaster.ray.distanceToBox(cubeRef.current);
      // Usar el punto más cercano del rayo al cubo como hotspot aproximado
      const closestPoint = raycaster.ray.at(distToBox, new THREE.Vector3());
      setHotspot(closestPoint);
      
      // La distancia del mouse al cubo es la distancia al punto más cercano del rayo
      const dist = camera.position.distanceTo(closestPoint);
      setMouseDistance(dist);
    }
  });

  return null;
};

const HeatCube = () => {
  const [hotspot, setHotspot] = useState(new THREE.Vector3(0, 0, 2));
  const [mouseDistance, setMouseDistance] = useState(10);

  return (
    <div style={{ width: '100%', height: '500px', background: 'transparent', position: 'relative' }}>
      <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Cube hotspot={hotspot} mouseDistance={mouseDistance} />
        <HotspotUpdater setHotspot={setHotspot} setMouseDistance={setMouseDistance} />
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
        🔥 Calor: {Math.round(100 * (1 - Math.min(1, mouseDistance / 8)))}% (distancia: {mouseDistance.toFixed(2)})
      </div>
    </div>
  );
};

export default HeatCube;