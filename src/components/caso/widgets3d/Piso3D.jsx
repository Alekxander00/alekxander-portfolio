import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useIdioma } from '../../../lib/idioma'
import { ANCLAS, HABITACIONES } from '../logica/pisoHotel'
import Piso from '../widgets/Piso'
import './widget3d.css'

// Del SVG de la planta (480×240, pasillo en y = 120) al mundo, en metros.
const aMundo = (a) => ({ x: (a.x - 240) / 100, z: (a.y - 120) / 100, rot: a.y < 120 ? 0 : Math.PI })

// Ajusta la distancia de la cámara para que el piso entero, del ascensor a la escalera, quepa en el lienzo.
function Encuadre() {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspecto = size.width / size.height
    const mitad = THREE.MathUtils.degToRad(camera.fov / 2)
    const horizontal = Math.atan(Math.tan(mitad) * aspecto)
    const d = Math.max(3.1, 2.95 / Math.tan(horizontal))
    camera.position.set(0, d * 0.74, d * 0.67)
    camera.lookAt(0, 0, -0.18)
  }, [camera, size])
  return null
}

function MallaDeco({ id }) {
  switch (id) {
    case 'vela':
      return (
        <group>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
            <meshStandardMaterial color="#b08d57" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.18, 12]} />
            <meshStandardMaterial color="#efe7d6" />
          </mesh>
          <mesh position={[0, 0.26, 0]} scale={[1, 1.5, 1]}>
            <sphereGeometry args={[0.03, 10, 8]} />
            <meshStandardMaterial color="#f2b45a" emissive="#f2b45a" emissiveIntensity={1.4} />
          </mesh>
        </group>
      )
    case 'retrato':
      return (
        <group position={[0, 0.22, -0.26]}>
          <mesh>
            <boxGeometry args={[0.3, 0.36, 0.03]} />
            <meshStandardMaterial color="#b08d57" metalness={0.3} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.017]}>
            <planeGeometry args={[0.22, 0.28]} />
            <meshStandardMaterial color="#2a2420" />
          </mesh>
          <mesh position={[0, 0.03, 0.02]} scale={[1, 1.2, 0.3]}>
            <sphereGeometry args={[0.05, 12, 10]} />
            <meshStandardMaterial color="#c9bea9" />
          </mesh>
        </group>
      )
    case 'planta':
      return (
        <group>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.07, 0.05, 0.12, 14]} />
            <meshStandardMaterial color="#8a5a3c" />
          </mesh>
          <mesh position={[0, 0.27, 0]} scale={[1, 1.3, 1]}>
            <sphereGeometry args={[0.12, 14, 10]} />
            <meshStandardMaterial color="#5f7a4e" roughness={0.9} />
          </mesh>
        </group>
      )
    case 'radio':
      return (
        <group position={[0, 0.11, 0]}>
          <mesh>
            <boxGeometry args={[0.26, 0.16, 0.12]} />
            <meshStandardMaterial color="#3a2e26" />
          </mesh>
          <mesh position={[-0.05, 0, 0.061]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
            <meshStandardMaterial color="#efe7d6" />
          </mesh>
          <mesh position={[0.08, 0.16, 0]} rotation-z={-0.4}>
            <cylinderGeometry args={[0.006, 0.006, 0.2, 6]} />
            <meshStandardMaterial color="#c9bea9" />
          </mesh>
        </group>
      )
    case 'alfombra':
      return (
        <group position={[0, 0.035, 0.02]}>
          <mesh>
            <boxGeometry args={[0.5, 0.01, 0.34]} />
            <meshStandardMaterial color="#c9a36a" />
          </mesh>
          <mesh position={[0, 0.006, 0]}>
            <boxGeometry args={[0.44, 0.01, 0.28]} />
            <meshStandardMaterial color="#6b2a24" />
          </mesh>
        </group>
      )
    default:
      return null
  }
}

// La decoración nueva crece desde cero; con movimiento reducido aparece entera.
function Deco({ id, reducido }) {
  const g = useRef(null)
  useFrame((_, dtReal) => {
    const s = g.current.scale.x
    if (s >= 0.999) return
    const k = 1 - Math.exp(-12 * Math.min(dtReal, 0.05))
    g.current.scale.setScalar(Math.min(1, s + (1 - s) * k + 0.002))
  })
  return (
    <group ref={g} scale={reducido ? 1 : 0.001}>
      <MallaDeco id={id} />
    </group>
  )
}

function Habitacion({ h, ancla, deco, reducido, onTocar }) {
  const g = useRef(null)
  const objetivo = aMundo(ANCLAS[ancla])
  const [inicial] = useState(objetivo)
  useFrame((_, dtReal) => {
    const o = g.current
    const k = reducido ? 1 : 1 - Math.exp(-8 * Math.min(dtReal, 0.05))
    o.position.x += (objetivo.x - o.position.x) * k
    o.position.z += (objetivo.z - o.position.z) * k
    o.rotation.y += (objetivo.rot - o.rotation.y) * k
  })
  const pared = <meshStandardMaterial color={h.pared} roughness={0.9} />
  return (
    <group
      ref={g}
      position={[inicial.x, 0, inicial.z]}
      rotation-y={inicial.rot}
      onClick={(e) => {
        e.stopPropagation()
        onTocar(h.id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => (document.body.style.cursor = '')}
    >
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[0.9, 0.03, 0.7]} />
        {pared}
      </mesh>
      {/* Paredes bajas: el fondo y los dos lados; el lado del pasillo queda abierto */}
      <mesh position={[0, 0.1, -0.335]}>
        <boxGeometry args={[0.9, 0.2, 0.03]} />
        {pared}
      </mesh>
      <mesh position={[-0.435, 0.1, 0]}>
        <boxGeometry args={[0.03, 0.2, 0.7]} />
        {pared}
      </mesh>
      <mesh position={[0.435, 0.1, 0]}>
        <boxGeometry args={[0.03, 0.2, 0.7]} />
        {pared}
      </mesh>
      <Deco key={deco} id={deco} reducido={reducido} />
    </group>
  )
}

function Escenario({ orden, deco, reducido, onTocar }) {
  useEffect(() => () => (document.body.style.cursor = ''), [])
  return (
    <>
      <Encuadre />
      <hemisphereLight args={['#fff1d6', '#1c1915', 1.15]} />
      <directionalLight position={[-2, 5, 4]} intensity={1.6} />
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[5, 0.04, 2]} />
        <meshStandardMaterial color="#24201b" roughness={1} />
      </mesh>
      {/* Pasillo, ascensor y escalera: fijos */}
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[3.6, 0.01, 0.4]} />
        <meshStandardMaterial color="#2b2620" roughness={1} />
      </mesh>
      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[3.6, 0.01, 0.12]} />
        <meshStandardMaterial color="#4a2a26" roughness={1} />
      </mesh>
      <group position={[-2.05, 0, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.5, 0.8, 0.5]} />
          <meshStandardMaterial color="#3a332b" roughness={0.8} />
        </mesh>
        <mesh position={[0.251, 0.32, 0]} rotation-y={Math.PI / 2}>
          <planeGeometry args={[0.36, 0.6]} />
          <meshStandardMaterial color="#8a7a62" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
      {/* Escalera: cuatro peldaños que suben hacia fuera */}
      {[0, 1, 2, 3].map((i) => {
        const desde = 1.82 + i * 0.12
        const alto = (i + 1) * 0.12
        return (
          <mesh key={i} position={[(desde + 2.3) / 2, alto / 2, 0]}>
            <boxGeometry args={[2.3 - desde, alto, 0.5]} />
            <meshStandardMaterial color="#3a332b" roughness={0.9} />
          </mesh>
        )
      })}
      {HABITACIONES.map((h) => (
        <Habitacion key={h.id} h={h} ancla={orden.indexOf(h.id)} deco={deco[h.id]} reducido={reducido} onTocar={onTocar} />
      ))}
    </>
  )
}

function Lado3D(props) {
  const { t } = useIdioma()
  return (
    <div role="img" aria-label={t({ es: 'Un piso del hotel visto desde arriba', en: 'A floor of the hotel seen from above' })} style={{ position: 'absolute', inset: 0 }}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 3.2, 3], fov: 40 }} onCreated={({ scene }) => (scene.background = new THREE.Color('#1c1915'))}>
        <Escenario {...props} />
      </Canvas>
    </div>
  )
}

export default function Piso3D() {
  return <Piso Lado3D={Lado3D} />
}
