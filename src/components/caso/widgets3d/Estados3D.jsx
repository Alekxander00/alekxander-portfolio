 
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Estados from '../widgets/Estados'
import './widget3d.css'

// Pose de la cápsula según el estado (metros y radianes).
function poseDe(estado, vengoDe) {
  return {
    suelo: { x: -0.6, y: 0.5, rz: 0, sx: 1, sy: 1 },
    aire: { x: -0.4, y: 1.5, rz: 0, sx: 0.92, sy: 1.08 },
    dash: { x: 0.4, y: vengoDe === 'suelo' ? 0.5 : 1.4, rz: 0, sx: 1.35, sy: 0.75 },
    pared: { x: 1.65, y: 1.7, rz: 0, sx: 0.9, sy: 1 },
    planeo: { x: 0.6, y: 1.25, rz: -0.15, sx: 1.1, sy: 0.9 },
  }[estado]
}

function Capsula({ estado, vengoDe }) {
  const g = useRef(null)
  const capa = useRef(null)
  const estela = useRef(null)
  useFrame((_, dtReal) => {
    const dt = Math.min(dtReal, 0.05)
    const p = poseDe(estado, vengoDe)
    const k = 1 - Math.exp(-14 * dt)
    const o = g.current
    o.position.x += (p.x - o.position.x) * k
    o.position.y += (p.y - o.position.y) * k
    o.rotation.z += (p.rz - o.rotation.z) * k
    o.scale.x += (p.sx - o.scale.x) * k
    o.scale.y += (p.sy - o.scale.y) * k
    capa.current.visible = estado === 'planeo'
    estela.current.visible = estado === 'dash'
  })
  return (
    <group ref={g} position={[-0.6, 0.5, 0]}>
      <mesh>
        <capsuleGeometry args={[0.22, 0.5, 6, 12]} />
        <meshStandardMaterial color="#d9b48f" roughness={0.6} />
      </mesh>
      <mesh position={[0.17, 0.18, 0.12]}>
        <boxGeometry args={[0.14, 0.1, 0.1]} />
        <meshStandardMaterial color="#3b2614" />
      </mesh>
      <mesh ref={capa} position={[-0.35, 0.1, 0]} rotation-z={0.5}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial color="#efe7d6" side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>
      <group ref={estela}>
        {[0.15, 0, -0.15].map((y, i) => (
          <mesh key={y} position={[-0.55 - i * 0.05, y, 0]}>
            <boxGeometry args={[0.5 - i * 0.1, 0.03, 0.03]} />
            <meshBasicMaterial color="#efe7d6" />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Lado3D({ estado, vengoDe }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.4, 5.2], fov: 40 }} onCreated={({ scene, camera }) => {
      scene.background = new THREE.Color('#1c1915')
      camera.lookAt(0.3, 1, 0)
    }}>
      <hemisphereLight args={['#fff1d6', '#1c1915', 0.8]} />
      <directionalLight position={[-2, 4, 4]} intensity={1.3} />
      {/* Suelo, plataforma y pared: el blocking del Mundo 1 */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[6, 0.4, 1.4]} />
        <meshStandardMaterial color="#5a5144" roughness={1} />
      </mesh>
      <mesh position={[-0.2, 0.95, -0.3]}>
        <boxGeometry args={[1, 0.15, 0.8]} />
        <meshStandardMaterial color="#6b6152" roughness={1} />
      </mesh>
      <mesh position={[2.2, 1.4, 0]}>
        <boxGeometry args={[0.5, 3, 1.4]} />
        <meshStandardMaterial color="#4a4238" roughness={1} />
      </mesh>
      <Capsula estado={estado} vengoDe={vengoDe} />
    </Canvas>
  )
}

export default function Estados3D() {
  return <Estados Lado3D={Lado3D} />
}
