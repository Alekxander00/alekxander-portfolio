/* eslint-disable react-hooks/immutability -- bucle de juego: el mundo se muta cada fotograma */
import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useIdioma } from '../../../lib/idioma'
import { despertarAudio, sonar } from '../../../lib/sonido'
import { MAX_ENEMIGOS, ritmoHorda } from '../logica/horda'
import './widget3d.css'

const DIA = new THREE.Color('#d6a052')
const NOCHE = new THREE.Color('#121422')
const RADIO = 4.2
const CHISPAS = 60
const nada = new THREE.Matrix4().makeScale(0, 0, 0)

// La arena en miniatura: la niebla suelta enemigos hacia el Núcleo.
function Arena({ horaRef, mundo, alGolpe }) {
  const scene = useThree((s) => s.scene)
  const enemigos = useRef(null)
  const chispas = useRef(null)
  const nucleo = useRef(null)
  const luz = useRef(null)
  const suelo = useRef(null)
  const aux = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  useFrame((_, dtReal) => {
    const dt = Math.min(dtReal, 0.05)
    const m = mundo.current
    const h = horaRef.current
    m.acumulado += ritmoHorda(h) * dt
    while (m.acumulado > 1) {
      m.acumulado -= 1
      if (m.enemigos.length >= MAX_ENEMIGOS) break
      const a = Math.random() * Math.PI * 2
      m.enemigos.push({ x: Math.cos(a) * RADIO, z: Math.sin(a) * RADIO, v: 0.5 + Math.random() * 0.4 + h * 0.6, fase: Math.random() * 6 })
    }
    for (const e of m.enemigos) {
      const d = Math.hypot(e.x, e.z) || 1
      e.x -= (e.x / d) * e.v * dt
      e.z -= (e.z / d) * e.v * dt
      e.fase += dt * 9
      if (d < 0.45) {
        e.muerto = true
        m.brillo = 1
      }
    }
    m.enemigos = m.enemigos.filter((e) => !e.muerto)
    m.brillo *= Math.exp(-4 * dt)
    m.kick *= Math.exp(-14 * dt)

    // Enemigos
    const im = enemigos.current
    for (let i = 0; i < MAX_ENEMIGOS; i++) {
      const e = m.enemigos[i]
      if (!e) {
        im.setMatrixAt(i, nada)
        continue
      }
      aux.position.set(e.x, 0.32 + Math.abs(Math.sin(e.fase)) * 0.06, e.z)
      aux.rotation.set(0, Math.atan2(e.x, e.z), Math.sin(e.fase) * 0.12)
      aux.scale.setScalar(1)
      aux.updateMatrix()
      im.setMatrixAt(i, aux.matrix)
    }
    im.instanceMatrix.needsUpdate = true

    // Chispas
    const ch = chispas.current
    m.chispas = m.chispas.filter((p) => (p.vida -= dt) > 0)
    for (let i = 0; i < CHISPAS; i++) {
      const p = m.chispas[i]
      if (!p) {
        ch.setMatrixAt(i, nada)
        continue
      }
      p.vy -= 9 * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.z += p.vz * dt
      aux.position.set(p.x, Math.max(0.03, p.y), p.z)
      aux.rotation.set(p.vida * 9, p.vida * 7, 0)
      aux.scale.setScalar(Math.min(1, p.vida * 3))
      aux.updateMatrix()
      ch.setMatrixAt(i, aux.matrix)
    }
    ch.instanceMatrix.needsUpdate = true

    // Día y noche
    color.copy(DIA).lerp(NOCHE, h)
    scene.background = color.clone()
    scene.fog.color.copy(color)
    suelo.current.color.copy(DIA).multiplyScalar(0.75).lerp(NOCHE, h * 0.8)
    nucleo.current.emissive.set(m.brillo > 0.3 ? '#ff7a6b' : '#fff3c9')
    luz.current.intensity = 6 + Math.sin(performance.now() / 300) * 0.8
  })

  return (
    <group>
      <mesh
        rotation-x={-Math.PI / 2}
        onPointerDown={(e) => {
          e.stopPropagation()
          alGolpe(e.point, e.pointerType === 'touch')
        }}
      >
        <circleGeometry args={[RADIO + 1.5, 48]} />
        <meshStandardMaterial ref={suelo} color="#a8783c" roughness={1} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.3, 24, 16]} />
        <meshStandardMaterial ref={nucleo} color="#fff3c9" emissive="#fff3c9" emissiveIntensity={2} />
      </mesh>
      <pointLight ref={luz} position={[0, 0.8, 0]} distance={6} color="#ffecaa" />
      <instancedMesh ref={enemigos} args={[undefined, undefined, MAX_ENEMIGOS]} frustumCulled={false}>
        <capsuleGeometry args={[0.13, 0.32, 4, 8]} />
        <meshStandardMaterial color="#1a120c" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={chispas} args={[undefined, undefined, CHISPAS]} frustumCulled={false}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshBasicMaterial color="#fff3c9" />
      </instancedMesh>
    </group>
  )
}

function Kick({ mundo }) {
  const camera = useThree((s) => s.camera)
  useFrame(() => {
    const k = mundo.current.kick
    camera.position.set(0 + (Math.random() - 0.5) * k * 0.05, 5 + (Math.random() - 0.5) * k * 0.05, 5.5)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Horda3D() {
  const { t } = useIdioma()
  const [hora, setHora] = useState(20)
  const horaRef = useRef(0.2)
  const [derribados, setDerribados] = useState(0)
  const mundo = useRef({ enemigos: [], chispas: [], acumulado: 0, kick: 0, brillo: 0 })

  const reventar = (e) => {
    const m = mundo.current
    e.muerto = true
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * Math.PI * 2
      const v = 1 + Math.random() * 2
      m.chispas.push({ x: e.x, y: 0.4, z: e.z, vx: Math.cos(a) * v, vy: 2 + Math.random() * 2, vz: Math.sin(a) * v, vida: 0.5 + Math.random() * 0.4 })
    }
    m.kick = 9
    sonar('golpe', { volumen: 0.6, tono: 1.3 })
    setDerribados((n) => n + 1)
  }

  const alGolpe = (punto, tactil) => {
    despertarAudio()
    const m = mundo.current
    let mejor = null
    let dMin = tactil ? 0.9 : 0.55
    for (const e of m.enemigos) {
      const d = Math.hypot(e.x - punto.x, e.z - punto.z)
      if (d < dMin) {
        dMin = d
        mejor = e
      }
    }
    if (mejor) reventar(mejor)
    else {
      m.kick = 4
      sonar('aterrizar', { volumen: 0.3 })
    }
  }

  const golpeCercano = () => {
    despertarAudio()
    const m = mundo.current
    let mejor = null
    let dMin = Infinity
    for (const e of m.enemigos) {
      const d = Math.hypot(e.x, e.z)
      if (d < dMin) {
        dMin = d
        mejor = e
      }
    }
    if (mejor) reventar(mejor)
  }

  return (
    <div className="widget widget3d">
      <div className="widget3d__lienzo" style={{ cursor: 'crosshair' }}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 5, 5.5], fov: 40 }}
          onCreated={({ scene }) => {
            scene.background = DIA.clone()
            scene.fog = new THREE.Fog(DIA.clone(), 5, 11)
          }}
        >
          <hemisphereLight args={['#ffe8c0', '#3a2a1a', 0.9]} />
          <directionalLight position={[3, 6, 2]} intensity={1.2} />
          <Arena horaRef={horaRef} mundo={mundo} alGolpe={alGolpe} />
          <Kick mundo={mundo} />
        </Canvas>
      </div>
      <div className="widget__barra" style={{ alignItems: 'center' }}>
        <span aria-hidden="true">☀</span>
        <input
          className="widget__deslizador"
          style={{ flex: 1, width: 'auto' }}
          type="range"
          min="0"
          max="100"
          value={hora}
          onChange={(e) => {
            setHora(Number(e.target.value))
            horaRef.current = Number(e.target.value) / 100
          }}
          aria-label={t({ es: 'Del día a la noche', en: 'From day to night' })}
        />
        <span aria-hidden="true">☾</span>
        <button type="button" className="widget__tecla" onClick={golpeCercano}>
          {t({ es: 'Golpe', en: 'Strike' })}
        </button>
        <span className="widget3d__contador" aria-live="polite">
          {derribados}
        </span>
      </div>
    </div>
  )
}
