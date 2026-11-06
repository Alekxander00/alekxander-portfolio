/* eslint-disable react-hooks/immutability -- animación: el estado de cada carta se muta cada fotograma */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useIdioma } from '../../lib/idioma'
import { sonar } from '../../lib/sonido'
import { useMovimientoReducido } from '../../lib/useMovimientoReducido'
import { proyectos } from '../../content/proyectos'
import { useEscena } from '../estado'
import { vivo } from '../vivo'
import { texturaProyecto } from '../carta/naipe'
import { texturaReverso } from '../carta/texturas'
import { posicionesMano, ANCHO_CARTA, LARGO_CARTA } from './disposicion'

const MAZO = { desk: [0.66, 0.55], movil: [0.16, 0.66] }
const REPARTO_DESDE = 0.55 // progreso del scroll a partir del cual se reparte
const ENTRE_CARTAS = 0.07 // s
const VUELO = 0.35 // s antes de abrir el caso

const suave = (actual, objetivo, k) => actual + (objetivo - actual) * k

function Carta({ p, indice, reverso, frente, estado, onAbrir }) {
  const grupo = useRef(null)
  const giro = useRef(null)
  const setResaltada = useEscena((s) => s.setResaltada)

  // Registrar el grupo para que el bucle común lo mueva.
  useEffect(() => {
    estado.grupo = grupo.current
    estado.giro = giro.current
  }, [estado])

  return (
    <group
      ref={grupo}
      onPointerOver={(e) => {
        e.stopPropagation()
        setResaltada(p.id)
        document.body.style.cursor = 'pointer'
        sonar('recoger', { volumen: 0.2 })
      }}
      onPointerOut={() => {
        setResaltada(null)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        onAbrir(p.id, indice)
      }}
    >
      <group ref={giro}>
        <mesh rotation-x={-Math.PI / 2}>
          <planeGeometry args={[ANCHO_CARTA, LARGO_CARTA]} />
          <meshStandardMaterial map={frente} transparent alphaTest={0.5} roughness={0.7} />
        </mesh>
        <mesh rotation-x={Math.PI / 2}>
          <planeGeometry args={[ANCHO_CARTA, LARGO_CARTA]} />
          <meshStandardMaterial map={reverso} transparent alphaTest={0.5} roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

// La mano: las cartas de los proyectos sobre el paño, repartidas desde un mazo.
export default function ManoMesa() {
  const { t, idioma } = useIdioma()
  const reducido = useMovimientoReducido()
  const camera = useThree((s) => s.camera)
  const palo = useEscena((s) => s.palo)
  const abierta = useEscena((s) => s.abierta)
  const [reverso, setReverso] = useState(null)
  const [frentes, setFrentes] = useState(null)

  // Estado de animación por carta (fuera de React).
  const estados = useMemo(
    () =>
      Object.fromEntries(
        proyectos.map((p) => [p.id, { x: MAZO.desk[0], y: 0.01, z: MAZO.desk[1], rotY: 0, flip: Math.PI, escala: 1, levantar: 0, mirar: 0, salida: -1 }]),
      ),
    [],
  )
  const reparto = useRef({ inicio: -1 })
  const vuelo = useRef(null)

  useEffect(() => {
    let vivoEf = true
    texturaReverso().then((tx) => vivoEf && setReverso(tx))
    return () => {
      vivoEf = false
    }
  }, [])

  useEffect(() => {
    let vivoEf = true
    Promise.all(proyectos.map((p) => texturaProyecto(p, t))).then((lista) => {
      if (!vivoEf) return lista.forEach((tx) => tx.dispose())
      setFrentes((viejas) => {
        viejas && Object.values(viejas).forEach((tx) => tx.dispose())
        return Object.fromEntries(proyectos.map((p, i) => [p.id, lista[i]]))
      })
    })
    return () => {
      vivoEf = false
    }
    // t cambia con el idioma; idioma basta como dependencia
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idioma])

  // DEV: ver la mano desde la consola o las pruebas.
  useEffect(() => {
    if (import.meta.env.DEV) window.__mano = estados
  }, [estados])

  const abrirDesde = (id) => {
    if (vuelo.current) return
    sonar('elegida')
    vuelo.current = { id, inicio: performance.now() / 1000 }
  }

  useFrame((_, dtReal) => {
    const dt = Math.min(dtReal, 0.05)
    const ahora = performance.now() / 1000
    const movil = vivo.movil
    const mazo = movil ? MAZO.movil : MAZO.desk
    const visibles = proyectos.filter((p) => !palo || p.palo === palo)
    const sitios = posicionesMano(visibles.length, movil)
    const r = reparto.current
    if (r.inicio < 0 && vivo.progreso > REPARTO_DESDE) r.inicio = ahora
    const { resaltada } = useEscena.getState()
    const k = reducido ? 1 : 1 - Math.exp(-10 * dt)

    // Vuelo hacia la cámara antes de abrir el caso.
    const v = vuelo.current
    if (v && ahora - v.inicio > VUELO && !v.abierto) {
      v.abierto = true
      useEscena.getState().abrir(v.id)
    }
    if (v && v.abierto && !abierta && ahora - v.inicio > VUELO + 0.3) vuelo.current = null

    proyectos.forEach((p) => {
      const e = estados[p.id]
      if (!e.grupo) return
      const i = visibles.indexOf(p)
      const repartida = r.inicio >= 0 && (reducido || ahora - r.inicio > i * ENTRE_CARTAS)
      let obj
      if (i >= 0 && repartida) {
        const s = sitios[i]
        obj = { x: s.x, y: 0.004 + i * 0.0004, z: s.z, rotY: s.rotY, flip: 0, escala: s.escala }
        if (e.salida < 0) {
          e.salida = ahora
          if (!reducido) setTimeout(() => sonar('aterrizar', { volumen: 0.3 }), 0)
        }
      } else {
        obj = { x: mazo[0], y: 0.006 + proyectos.indexOf(p) * 0.002, z: mazo[1], rotY: 0.08, flip: Math.PI, escala: movil ? 0.75 : 1 }
        e.salida = -1
      }
      const sube = resaltada === p.id ? 1 : 0
      const volando = v && v.id === p.id && !(v.abierto && !abierta)
      e.x = suave(e.x, obj.x, k)
      e.z = suave(e.z, obj.z, k)
      e.y = suave(e.y, obj.y, k)
      e.rotY = suave(e.rotY, obj.rotY, k)
      e.flip = suave(e.flip, obj.flip, reducido ? 1 : 1 - Math.exp(-7 * dt))
      e.escala = suave(e.escala, obj.escala, k)
      e.levantar = suave(e.levantar, sube, k)
      e.mirar = suave(e.mirar, volando ? 1 : 0, reducido ? 1 : 1 - Math.exp(-9 * dt))

      // Al volar, la carta se acerca a la cámara y se pone de cara a ella.
      const delante = new THREE.Vector3()
      camera.getWorldDirection(delante)
      const destino = camera.position.clone().addScaledVector(delante, 0.32)
      const m = e.mirar
      e.grupo.position.set(
        THREE.MathUtils.lerp(e.x, destino.x, m),
        THREE.MathUtils.lerp(e.y + e.levantar * 0.03 + Math.sin(e.flip) * 0.05, destino.y, m),
        THREE.MathUtils.lerp(e.z, destino.z, m),
      )
      // Al volar da una vuelta completa sobre sí misma.
      e.grupo.rotation.set(0, e.rotY * (1 - m) + m * Math.PI * 2, 0)
      // Y se inclina hacia la cámara (giro en X) hasta quedar casi de frente.
      e.giro.rotation.set(m * 1.2, 0, e.flip)
      e.grupo.scale.setScalar(e.escala * (1 + e.levantar * 0.05))
    })
  })

  if (!reverso || !frentes) return null

  return (
    <group>
      {/* El mazo: un taco de cartas boca abajo */}
      <mesh position={[MAZO.desk[0], 0.008, MAZO.desk[1]]} rotation-y={0.08} visible={!vivo.movil}>
        <boxGeometry args={[ANCHO_CARTA, 0.012, LARGO_CARTA]} />
        <meshStandardMaterial color="#e8dfcc" roughness={0.8} />
      </mesh>
      {proyectos.map((p, i) => (
        <Carta key={p.id} p={p} indice={i} reverso={reverso} frente={frentes[p.id]} estado={estados[p.id]} onAbrir={abrirDesde} />
      ))}
    </group>
  )
}
