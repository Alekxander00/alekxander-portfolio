import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cargarBbmodel } from '../components/maquina/bbmodel'
import { useEscena } from './estado'

const MAX = 40
const RADIO = 0.018
const ALTO = 0.005
// Una ficha de Blockbench con cuatro texturas (verde, roja, negra, blanca): cada
// textura es una malla instanciada que comparte la geometría.
const MODELO = '/Fichas/FichasBlackJack.bbmodel'
const TIPOS = 4
const RESPALDO = ['#2f5d50', '#b3302a', '#1c1915', '#efe7d6']
const nada = new THREE.Matrix4().makeScale(0, 0, 0)

// La geometría del modelo, centrada y escalada a una ficha de RADIO de ancho.
async function cargarFicha() {
  const m = await cargarBbmodel(MODELO)
  m.raiz.updateWorldMatrix(true, true)
  let malla = null
  m.raiz.traverse((o) => (malla ||= o.isMesh ? o : null))
  if (!malla) throw new Error('El modelo de la ficha no tiene malla')
  const geo = malla.geometry.clone().applyMatrix4(malla.matrixWorld)
  geo.clearGroups()
  geo.computeBoundingBox()
  const caja = geo.boundingBox
  const centro = caja.getCenter(new THREE.Vector3())
  const tam = caja.getSize(new THREE.Vector3())
  geo.translate(-centro.x, -centro.y, -centro.z)
  const k = (RADIO * 2) / Math.max(tam.x, tam.z)
  geo.scale(k, k, k)
  geo.computeVertexNormals()
  return { geo, mats: m.materiales.slice(0, TIPOS), alto: tam.y * k }
}

// Fichas de casino que saltan sobre el paño con gravedad.
export default function Fichas() {
  const mallas = useRef([])
  const fichas = useMemo(() => Array.from({ length: MAX }, () => ({ vida: 0 })), [])
  const siguiente = useRef(0)
  const aux = useMemo(() => new THREE.Object3D(), [])
  const [modelo, setModelo] = useState(null)
  const respaldo = useMemo(
    () => ({
      geo: new THREE.CylinderGeometry(RADIO, RADIO, ALTO, 20),
      mats: RESPALDO.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5 })),
      alto: ALTO,
    }),
    [],
  )
  const ficha = modelo || respaldo

  useEffect(() => {
    let vigente = true
    cargarFicha()
      .then((f) => vigente && setModelo(f))
      .catch((e) => console.warn('Las fichas de Blockbench no cargaron; quedan las de respaldo', e))
    return () => {
      vigente = false
    }
  }, [])

  // Al cambiar de geometría las mallas son nuevas: se vacían.
  useEffect(() => {
    for (const m of mallas.current) {
      if (!m) continue
      for (let i = 0; i < MAX / TIPOS; i++) m.setMatrixAt(i, nada)
      m.instanceMatrix.needsUpdate = true
    }
  }, [ficha])

  useEffect(() => {
    const soltar = ([x, z], cantidad, fuerza) => {
      for (let n = 0; n < Math.min(cantidad, MAX); n++) {
        const f = fichas[siguiente.current]
        siguiente.current = (siguiente.current + 1) % MAX
        const a = Math.random() * Math.PI * 2
        const v = fuerza * (0.4 + Math.random() * 0.8)
        Object.assign(f, {
          x, y: 0.03, z,
          vx: Math.cos(a) * v * 0.6, vy: fuerza * (0.6 + Math.random() * 0.6), vz: Math.sin(a) * v * 0.6,
          rx: Math.random() * 6, rz: Math.random() * 6, ry: Math.random() * 6, wr: (Math.random() - 0.5) * 20,
          vida: 1.6 + Math.random() * 0.8,
        })
      }
    }
    useEscena.getState().registrarFichas(soltar)
    return () => useEscena.getState().registrarFichas(() => {})
  }, [fichas])

  useFrame((_, dtReal) => {
    const dt = Math.min(dtReal, 0.033)
    const cambiadas = new Set()
    const suelo = ficha.alto / 2 + 0.002
    fichas.forEach((f, i) => {
      if (f.vida <= 0) return
      // La ficha i usa la textura i % TIPOS, en el hueco i / TIPOS de esa malla.
      const m = mallas.current[i % TIPOS]
      if (!m) return
      const hueco = Math.floor(i / TIPOS)
      cambiadas.add(m)
      f.vida -= dt
      if (f.vida <= 0) {
        m.setMatrixAt(hueco, nada)
        return
      }
      f.vy -= 9.8 * dt
      f.x += f.vx * dt
      f.y += f.vy * dt
      f.z += f.vz * dt
      f.rx += f.wr * dt
      if (f.y < suelo) {
        f.y = suelo
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
      aux.rotation.set(f.rx, f.ry, f.rz)
      // Al acabar su vida se encoge hasta desaparecer (no se esfuma de golpe).
      const s = Math.min(1, f.vida * 3)
      aux.scale.set(s, s, s)
      aux.updateMatrix()
      m.setMatrixAt(hueco, aux.matrix)
    })
    for (const m of cambiadas) m.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {ficha.mats.map((mat, t) => (
        <instancedMesh
          key={`${modelo ? 'modelo' : 'respaldo'}-${t}`}
          ref={(m) => (mallas.current[t] = m)}
          args={[ficha.geo, mat, MAX / TIPOS]}
          frustumCulled={false}
        />
      ))}
    </group>
  )
}
