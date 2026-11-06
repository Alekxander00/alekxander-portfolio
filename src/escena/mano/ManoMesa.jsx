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
import { MAZO } from '../medidas'
import { texturaProyecto } from '../carta/naipe'
import { texturaReverso } from '../carta/texturas'
import { posicionesMano, ANCHO_CARTA, LARGO_CARTA } from './disposicion'

const REPARTO_DESDE = 0.55 // progreso del scroll a partir del cual se reparte
// Fuera de su tramo la mano regresa al mazo, carta a carta en orden inverso al
// reparto, y solo se oculta cuando ya está en él.
const TRAMO = [0.4, 1.6]
const ENTRE_CARTAS = 0.07 // s
// Al tocarla, la carta sube de frente a la cámara, se queda un instante para que
// se lea y entonces se abre el caso (antes daba vueltas y se abría de canto).
const VUELO = 0.65 // s antes de abrir el caso: ~0.4 de subida y ~0.25 quieta delante
const DELANTE = 0.4 // m de la cámara
const TRAS_CERRAR = 0.3 // s tras cerrar la ventana antes de volver a la mesa
const DE_PIE = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)
const qMesa = new THREE.Quaternion()
const qCara = new THREE.Quaternion()
const eMesa = new THREE.Euler()

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
  const reparto = useRef({ inicio: -1, recogida: -1 })
  const mazoRef = useRef(null)
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
    const enSuTramo = vivo.progreso > TRAMO[0] && vivo.progreso <= TRAMO[1]
    if (r.inicio < 0 && enSuTramo && vivo.progreso > REPARTO_DESDE) {
      r.inicio = ahora
      r.recogida = -1
    }
    if (r.inicio >= 0 && !enSuTramo && !vuelo.current) {
      r.inicio = -1
      r.recogida = ahora
    }
    const { resaltada } = useEscena.getState()
    const k = reducido ? 1 : 1 - Math.exp(-10 * dt)

    // Vuelo hacia la cámara antes de abrir el caso.
    const v = vuelo.current
    if (v && ahora - v.inicio > VUELO && !v.abierto) {
      v.abierto = true
      useEscena.getState().abrir(v.id)
    }
    // Delante de la cámara hasta que la ventana se haya cerrado del todo (su salida
    // dura ~0.22 s); solo entonces vuelve a la mesa.
    // Con la ventana abierta la mesa se pausa y puede que ningún fotograma la vea
    // abierta: pasado el vuelo con margen, si ya no está abierta es que se cerró.
    if (v && v.abierto && (abierta === v.id || ahora - v.inicio > VUELO + 0.15)) v.visto = true
    if (v && v.visto && !abierta && v.cerrada == null) v.cerrada = ahora
    const volviendo = v && v.cerrada != null && ahora - v.cerrada > TRAS_CERRAR
    if (volviendo && ahora - v.cerrada > TRAS_CERRAR + 0.4) vuelo.current = null

    proyectos.forEach((p) => {
      const e = estados[p.id]
      if (!e.grupo) return
      const i = visibles.indexOf(p)
      const repartida =
        (r.inicio >= 0 && (reducido || ahora - r.inicio > i * ENTRE_CARTAS)) ||
        // Recogiendo: la última repartida es la primera en volver.
        (r.recogida >= 0 && e.salida >= 0 && !reducido && ahora - r.recogida <= (visibles.length - 1 - i) * ENTRE_CARTAS)
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
      const volando = v && v.id === p.id && !volviendo
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
      const destino = camera.position.clone().addScaledVector(delante, DELANTE)
      const m = e.mirar
      e.grupo.position.set(
        THREE.MathUtils.lerp(e.x, destino.x, m),
        THREE.MathUtils.lerp(e.y + e.levantar * 0.03 + Math.sin(e.flip) * 0.05, destino.y, m),
        THREE.MathUtils.lerp(e.z, destino.z, m),
      )
      // Sin vueltas: de tumbada en la mesa pasa a de pie mirando a la cámara.
      qMesa.setFromEuler(eMesa.set(0, e.rotY, 0))
      qCara.copy(camera.quaternion).multiply(DE_PIE)
      e.grupo.quaternion.slerpQuaternions(qMesa, qCara, m)
      e.giro.rotation.set(0, 0, e.flip)
      // Delante de la cámara todas tienen el mismo tamaño (el As y las de celular también).
      e.grupo.scale.setScalar(THREE.MathUtils.lerp(e.escala * (1 + e.levantar * 0.05), 1, m))
      // Fuera de su tramo, ya en el mazo, se oculta: estorbaría a la carta de
      // entrada y en el blackjack asomaría detrás de sus cartas y del panel.
      const enMazo = Math.hypot(e.x - mazo[0], e.z - mazo[1]) < 0.02
      e.grupo.visible = enSuTramo || !enMazo
    })
    // El mazo se queda siempre en la mesa (en celular queda fuera de cuadro).
    if (mazoRef.current) mazoRef.current.visible = !movil
  })

  if (!reverso || !frentes) return null

  return (
    <group>
      {/* El mazo: un taco de cartas boca abajo */}
      <group ref={mazoRef} position={[MAZO.desk[0], 0.008, MAZO.desk[1]]} rotation-y={0.08} visible={false}>
        <mesh>
          <boxGeometry args={[ANCHO_CARTA * 0.99, 0.012, LARGO_CARTA * 0.99]} />
          <meshStandardMaterial color="#e8dfcc" roughness={0.8} />
        </mesh>
        {/* La carta de arriba del taco, boca abajo: que se vea un mazo y no un bloque. */}
        <mesh rotation-x={-Math.PI / 2} position-y={0.0065}>
          <planeGeometry args={[ANCHO_CARTA, LARGO_CARTA]} />
          <meshStandardMaterial map={reverso} transparent alphaTest={0.5} roughness={0.7} />
        </mesh>
      </group>
      {proyectos.map((p, i) => (
        <Carta key={p.id} p={p} indice={i} reverso={reverso} frente={frentes[p.id]} estado={estados[p.id]} onAbrir={abrirDesde} />
      ))}
    </group>
  )
}
