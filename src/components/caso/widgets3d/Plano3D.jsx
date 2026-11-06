 
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useIdioma } from '../../../lib/idioma'
import './widget3d.css'

// The Others: un nivel 2.5D. Con la cámara ortográfica de frente, las tres capas
// parecen un solo dibujo; al girar se ve que viven a distinta profundidad.
const CAPAS = [
  { z: -1.4, color: '#3a4250', es: 'Fondo', en: 'Background', piezas: [[-1.5, 0.4, 0.6, 1.2], [-0.4, 0.7, 0.4, 1.5], [0.7, 0.2, 0.7, 1]] },
  { z: 0, color: '#efe7d6', es: 'Juego', en: 'Gameplay', piezas: [[-1.7, -0.6, 3.4, 0.16], [-0.9, -0.1, 0.7, 0.12], [0.4, 0.2, 0.8, 0.12]] },
  { z: 1.4, color: '#6b2a24', es: 'Frente', en: 'Foreground', piezas: [[-1.85, -0.3, 0.26, 0.6], [1.4, 0.6, 0.22, 1.4]] },
]
const PROF = 0.25

function Nivel({ giroRef, pj }) {
  const grupo = useRef(null)
  const personaje = useRef(null)
  useFrame((_, dtReal) => {
    const dt = Math.min(dtReal, 0.05)
    const g = grupo.current
    const objetivo = THREE.MathUtils.degToRad(giroRef.current)
    g.rotation.y += (objetivo - g.rotation.y) * (1 - Math.exp(-10 * dt))
    g.rotation.x = g.rotation.y * 0.3
    const p = personaje.current
    p.position.x += (pj.x - p.position.x) * (1 - Math.exp(-14 * dt))
    p.position.y += (pj.y - p.position.y) * (1 - Math.exp(-14 * dt))
  })
  return (
    <group ref={grupo}>
      {CAPAS.map((capa) =>
        capa.piezas.map(([x, y, w, h], i) => (
          <mesh key={capa.z + '-' + i} position={[x + w / 2, y - h / 2 + 0.2, capa.z]}>
            <boxGeometry args={[w, h, PROF]} />
            <meshStandardMaterial color={capa.color} transparent={capa.z > 0} opacity={capa.z > 0 ? 0.85 : 1} roughness={0.8} />
          </mesh>
        )),
      )}
      <mesh ref={personaje} position={[-1, -0.2, 0.1]}>
        <capsuleGeometry args={[0.1, 0.18, 4, 10]} />
        <meshStandardMaterial color="#e0645a" />
      </mesh>
    </group>
  )
}

export default function Plano3D() {
  const { t, idioma } = useIdioma()
  const [giro, setGiro] = useState(0)
  const giroRef = useRef(0)
  const [pj, setPj] = useState({ x: -1, y: -0.2 })
  const arrastre = useRef(null)
  const salto = useRef(0)

  useEffect(() => {
    giroRef.current = giro
  }, [giro])
  useEffect(() => () => clearTimeout(salto.current), [])

  const mover = (dx) => setPj((p) => ({ ...p, x: Math.max(-1.6, Math.min(1.6, p.x + dx)) }))
  const saltar = () => {
    if (pj.y !== -0.2) return
    setPj((p) => ({ ...p, y: 0.35 }))
    salto.current = setTimeout(() => setPj((p) => ({ ...p, y: -0.2 })), 380)
  }
  const tecla = (e) => {
    if (e.key === 'ArrowLeft') mover(-0.2)
    else if (e.key === 'ArrowRight') mover(0.2)
    else if (e.key === 'ArrowUp') saltar()
    else return
    e.preventDefault()
  }

  return (
    <div className="widget widget3d" onKeyDown={tecla}>
      <div
        className="widget3d__lienzo"
        style={{ cursor: 'ew-resize' }}
        onPointerDown={(e) => {
          arrastre.current = { x: e.clientX, g: giro }
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!arrastre.current) return
          setGiro(Math.max(0, Math.min(65, arrastre.current.g + (e.clientX - arrastre.current.x) * 0.4)))
        }}
        onPointerUp={() => (arrastre.current = null)}
        role="img"
        aria-label={t({ es: 'Las tres capas de un nivel, vistas desde la cámara del juego', en: 'The three layers of a level, seen from the game camera' })}
      >
        <Canvas dpr={[1, 1.5]} orthographic camera={{ position: [0, 0, 10], zoom: 105 }} onCreated={({ scene }) => (scene.background = new THREE.Color('#16171c'))}>
          <hemisphereLight args={['#ffffff', '#202024', 1]} />
          <directionalLight position={[3, 4, 6]} intensity={1.2} />
          <Nivel giroRef={giroRef} pj={pj} />
        </Canvas>
        <div className="widget3d__leyenda" style={{ opacity: giro > 18 ? 1 : 0 }} aria-hidden="true">
          {CAPAS.map((c) => (
            <span key={c.z}>
              <i style={{ background: c.color }} />
              {c[idioma]}
            </span>
          ))}
        </div>
      </div>
      <div className="widget__barra" style={{ alignItems: 'center' }}>
        <label htmlFor="plano3d-camara" style={{ fontSize: '0.9rem', color: '#c9bea9' }}>
          {t({ es: 'Cámara', en: 'Camera' })}
        </label>
        <input id="plano3d-camara" className="widget__deslizador" style={{ flex: 1, width: 'auto' }} type="range" min="0" max="65" value={giro} onChange={(e) => setGiro(Number(e.target.value))} />
        <button type="button" className="widget__tecla" onClick={() => mover(-0.2)} aria-label={t({ es: 'Izquierda', en: 'Left' })}>
          ←
        </button>
        <button type="button" className="widget__tecla" onClick={saltar} aria-label={t({ es: 'Saltar', en: 'Jump' })}>
          ↑
        </button>
        <button type="button" className="widget__tecla" onClick={() => mover(0.2)} aria-label={t({ es: 'Derecha', en: 'Right' })}>
          →
        </button>
      </div>
    </div>
  )
}
