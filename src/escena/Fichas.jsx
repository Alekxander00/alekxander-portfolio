 
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useEscena } from './estado'

const MAX = 40
const RADIO = 0.012
const ALTO = 0.004
const COLORES = ['#b3302a', '#efe7d6', '#1c1915', '#2f5d50'].map((c) => new THREE.Color(c))
const nada = new THREE.Matrix4().makeScale(0, 0, 0)

// Fichas de casino que saltan sobre el paño con gravedad.
export default function Fichas() {
  const malla = useRef(null)
  const fichas = useMemo(() => Array.from({ length: MAX }, () => ({ vida: 0 })), [])
  const siguiente = useRef(0)
  const aux = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    const m = malla.current
    for (let i = 0; i < MAX; i++) {
      m.setMatrixAt(i, nada)
      m.setColorAt(i, COLORES[i % COLORES.length])
    }
    m.instanceMatrix.needsUpdate = true
    m.instanceColor.needsUpdate = true

    const soltar = ([x, z], cantidad, fuerza) => {
      for (let n = 0; n < Math.min(cantidad, MAX); n++) {
        const f = fichas[siguiente.current]
        siguiente.current = (siguiente.current + 1) % MAX
        const a = Math.random() * Math.PI * 2
        const v = fuerza * (0.4 + Math.random() * 0.8)
        Object.assign(f, {
          x, y: 0.03, z,
          vx: Math.cos(a) * v * 0.6, vy: fuerza * (0.6 + Math.random() * 0.6), vz: Math.sin(a) * v * 0.6,
          rx: Math.random() * 6, rz: Math.random() * 6, wr: (Math.random() - 0.5) * 20,
          vida: 1.6 + Math.random() * 0.8,
        })
      }
    }
    useEscena.getState().registrarFichas(soltar)
    return () => useEscena.getState().registrarFichas(() => {})
  }, [fichas])

  useFrame((_, dtReal) => {
    const dt = Math.min(dtReal, 0.033)
    const m = malla.current
    let cambio = false
    fichas.forEach((f, i) => {
      if (f.vida <= 0) return
      cambio = true
      f.vida -= dt
      if (f.vida <= 0) {
        m.setMatrixAt(i, nada)
        return
      }
      f.vy -= 9.8 * dt
      f.x += f.vx * dt
      f.y += f.vy * dt
      f.z += f.vz * dt
      f.rx += f.wr * dt
      if (f.y < ALTO / 2 + 0.002) {
        f.y = ALTO / 2 + 0.002
        f.vy *= -0.4
        f.vx *= 0.7
        f.vz *= 0.7
        f.wr *= 0.6
        if (Math.abs(f.vy) < 0.15) {
          f.vy = 0
          f.rx = 0
          f.rz = 0
        }
      }
      aux.position.set(f.x, f.y, f.z)
      aux.rotation.set(f.rx, 0, f.rz)
      const s = Math.min(1, f.vida * 3)
      aux.scale.set(s, s, s)
      aux.updateMatrix()
      m.setMatrixAt(i, aux.matrix)
    })
    if (cambio) m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={malla} args={[undefined, undefined, MAX]} frustumCulled={false}>
      <cylinderGeometry args={[RADIO, RADIO, ALTO, 20]} />
      <meshStandardMaterial roughness={0.5} />
    </instancedMesh>
  )
}
