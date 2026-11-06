/* eslint-disable react-hooks/immutability -- animación: el agua y la vela se mutan cada fotograma */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useIdioma } from '../../../lib/idioma'
import { ZONA_MUERTA, aperturaBotavara, empuje, norm } from '../logica/vela'
import './widget3d.css'

const ANILLO = 2.6
const rad = THREE.MathUtils.degToRad

// Agua con olas suaves; corre hacia atrás más rápido cuanto más empuja la vela.
function Agua({ fRef }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(14, 14, 56, 56)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])
  const fase = useRef(0)
  useFrame((_, dt) => {
    fase.current += Math.min(dt, 0.05) * (0.4 + fRef.current * 2.2)
    const pos = geo.attributes.position
    const t = performance.now() / 1000
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      pos.setY(i, Math.sin(z * 1.1 + fase.current * 3) * 0.08 + Math.cos(x * 0.7 + t * 0.8) * 0.05)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })
  return (
    <mesh geometry={geo} position-y={-0.15}>
      <meshStandardMaterial color="#1f4a5e" roughness={0.6} flatShading />
    </mesh>
  )
}

function Barco({ rel }) {
  const vela = useRef(null)
  const casco = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, -1.1)
    s.bezierCurveTo(0.45, -0.6, 0.45, 0.6, 0.3, 0.9)
    s.lineTo(-0.3, 0.9)
    s.bezierCurveTo(-0.45, 0.6, -0.45, -0.6, 0, -1.1)
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.28, bevelEnabled: false })
    g.rotateX(Math.PI / 2)
    g.translate(0, 0.2, 0)
    return g
  }, [])
  const enZona = Math.abs(norm(rel)) < ZONA_MUERTA
  const lado = norm(rel) >= 0 ? -1 : 1
  const angulo = rad(aperturaBotavara(rel)) * lado
  useFrame(() => {
    const g = vela.current
    const objetivo = angulo + (enZona ? Math.sin(performance.now() / 45) * 0.12 : 0)
    g.rotation.y += (objetivo - g.rotation.y) * 0.15
  })
  return (
    <group>
      <mesh geometry={casco}>
        <meshStandardMaterial color="#7a5233" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.9, -0.15]}>
        <cylinderGeometry args={[0.035, 0.04, 1.6, 8]} />
        <meshStandardMaterial color="#3b2614" />
      </mesh>
      <group ref={vela} position={[0, 0.25, -0.15]}>
        <mesh position={[0, 0, 0.45]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.025, 0.025, 0.9, 6]} />
          <meshStandardMaterial color="#3b2614" />
        </mesh>
        <mesh position={[0, 0.65, 0.45]} rotation-y={Math.PI / 2}>
          <planeGeometry args={[0.9, 1.2]} />
          <meshStandardMaterial color="#efe7d6" side={THREE.DoubleSide} roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

function Viento({ rel, setRel }) {
  const arrastrando = useRef(false)
  const x = Math.sin(rad(rel)) * ANILLO
  const z = -Math.cos(rad(rel)) * ANILLO
  const enZona = Math.abs(norm(rel)) < ZONA_MUERTA
  const desde = (p) => setRel(Math.round(THREE.MathUtils.radToDeg(Math.atan2(p.x, -p.z))))
  return (
    <group>
      {/* Plano invisible para arrastrar el viento */}
      <mesh
        rotation-x={-Math.PI / 2}
        visible={false}
        onPointerDown={(e) => {
          e.stopPropagation()
          arrastrando.current = true
          desde(e.point)
        }}
        onPointerMove={(e) => arrastrando.current && desde(e.point)}
        onPointerUp={() => (arrastrando.current = false)}
        onPointerLeave={() => (arrastrando.current = false)}
      >
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.02}>
        <ringGeometry args={[ANILLO - 0.02, ANILLO + 0.02, 64]} />
        <meshBasicMaterial color="#efe7d6" transparent opacity={0.35} />
      </mesh>
      {/* Zona muerta: solo se ve cuando el viento cae dentro */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.03} visible={enZona}>
        <circleGeometry args={[ANILLO, 32, rad(90 - ZONA_MUERTA), rad(ZONA_MUERTA * 2)]} />
        <meshBasicMaterial color="#e0645a" transparent opacity={0.3} />
      </mesh>
      <group position={[x, 0.3, z]} rotation-y={-rad(rel)}>
        <mesh>
          <sphereGeometry args={[0.18, 16, 12]} />
          <meshStandardMaterial color="#efe7d6" emissive="#efe7d6" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.45]} rotation-x={Math.PI / 2}>
          <coneGeometry args={[0.12, 0.35, 12]} />
          <meshStandardMaterial color="#efe7d6" />
        </mesh>
      </group>
    </group>
  )
}

export default function Viento3D() {
  const { t } = useIdioma()
  const [rel, setRel] = useState(100)
  const f = empuje(rel)
  const fRef = useRef(f)
  useEffect(() => {
    fRef.current = f
  }, [f])
  const enZona = Math.abs(norm(rel)) < ZONA_MUERTA

  return (
    <div className="widget widget3d">
      <div className="widget3d__lienzo">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 5.2, 4.6], fov: 42 }}
          onCreated={({ scene, camera }) => {
            scene.background = new THREE.Color('#0f2230')
            camera.lookAt(0, 0, 0)
          }}
        >
          <hemisphereLight args={['#cfe6f0', '#0b1820', 0.9]} />
          <directionalLight position={[3, 6, 2]} intensity={1.3} />
          <Agua fRef={fRef} />
          <Barco rel={rel} />
          <Viento rel={rel} setRel={setRel} />
        </Canvas>
      </div>
      <div className="widget__barra" style={{ alignItems: 'center', gap: 12 }}>
        <input
          className="widget__deslizador"
          style={{ flex: 1, width: 'auto' }}
          type="range"
          min="-180"
          max="180"
          value={rel}
          onChange={(e) => setRel(Number(e.target.value))}
          aria-label={t({ es: 'Dirección del viento', en: 'Wind direction' })}
          aria-valuetext={`${rel}°`}
        />
        <span style={{ fontSize: '0.9rem', color: '#c9bea9' }}>{t({ es: 'Empuje', en: 'Drive' })}</span>
        <span style={{ width: 90, height: 8, borderRadius: 4, background: 'rgba(239,231,214,0.12)', overflow: 'hidden' }} aria-hidden="true">
          <span
            className="viento3d__barra"
            style={{ display: 'block', height: '100%', width: `${f * 100}%`, background: enZona ? 'var(--rojo-claro)' : 'var(--marfil)', transition: 'width 0.3s' }}
          />
        </span>
      </div>
    </div>
  )
}
