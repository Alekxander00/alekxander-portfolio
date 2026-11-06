 
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useIdioma } from '../../lib/idioma'
import { despertarAudio, fichas as sonarFichas, sonar } from '../../lib/sonido'
import { useMovimientoReducido } from '../../lib/useMovimientoReducido'
import { perfil } from '../../content/perfil'
import { useEscena } from '../estado'
import { PANO } from '../medidas'
import { vivo } from '../vivo'
import { crearCarta, paso, principiosDe, clasificarSoltar, IMPACTO_SACUDIDA } from './fisica'
import { texturaJoker, texturaReverso } from './texturas'
import { useTextura } from './useTextura'

const ANCHO = 0.18
const LARGO = 0.252
const Z0 = 0.15 // donde reposa la carta, delante del jugador
const ALTURA = 0.003
const plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

// Límites: todo el paño (su elipse, menos media carta) recortado a lo que la
// cámara ve, para que la carta no se salga de la pantalla (en celular se ve poco ancho).
const MARGEN_PANTALLA = 0.11
const rayoLimites = new THREE.Raycaster()
const ESQUINAS = [[-0.94, -0.88], [0.94, -0.88], [0.94, 0.86], [-0.94, 0.86]]
function limitesVisibles(camera) {
  const elipse = { rx: PANO.rx - ANCHO / 2 - 0.02, rz: PANO.rz - LARGO / 2 - 0.02, cz: -Z0 }
  const puntos = []
  for (const [x, y] of ESQUINAS) {
    rayoLimites.setFromCamera(new THREE.Vector2(x, y), camera)
    const p = new THREE.Vector3()
    // Una esquina de arriba que mira por encima del horizonte no limita.
    if (rayoLimites.ray.intersectPlane(plano, p)) puntos.push([p.x, p.z - Z0])
  }
  if (puntos.length < 3) return { elipse }
  const cx = puntos.reduce((t, p) => t + p[0], 0) / puntos.length
  const cz = puntos.reduce((t, p) => t + p[1], 0) / puntos.length
  const planos = []
  puntos.forEach((a, i) => {
    const b = puntos[(i + 1) % puntos.length]
    let nx = b[1] - a[1]
    let nz = a[0] - b[0]
    const largo = Math.hypot(nx, nz) || 1
    nx /= largo
    nz /= largo
    if (nx * (a[0] - cx) + nz * (a[1] - cz) < 0) {
      nx = -nx
      nz = -nz
    }
    planos.push({ nx, nz, d: nx * a[0] + nz * a[1] - MARGEN_PANTALLA })
  })
  return { elipse, planos }
}

export default function CartaEntrada() {
  const { t } = useIdioma()
  const reducido = useMovimientoReducido()
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const oficio = t(perfil.oficio)
  const reverso = useTextura(texturaReverso, [])
  const joker = useTextura(() => texturaJoker(perfil.nombre, oficio), [oficio])

  const raiz = useRef(null)
  const ejeK = useRef(null)
  const escK = useRef(null)
  const ejeK2 = useRef(null)
  const ejeQ = useRef(null)
  const escQ = useRef(null)
  const ejeQ2 = useRef(null)
  const unif = useRef(null)
  const giro = useRef(null)
  const halo = useRef(null)

  // La física trabaja relativa al punto de reposo: z = 0 es Z0 en la mesa.
  const c = useMemo(() => crearCarta(), [])
  const sombra = useRef(null)
  const extra = useRef({ giro: 0, vGiro: 0, giroObj: 0, anticipar: -1, tocada: false, inicio: -1, ultimoSalto: 0, saltoInicio: -1 })
  const puntero = useRef(null)
  const raycaster = useMemo(() => new THREE.Raycaster(), [])

  // Para depurar en desarrollo: el estado de la física a mano en la consola.
  useEffect(() => {
    if (import.meta.env.DEV) window.__carta = c
  }, [c])

  const descubrir = (lista) => lista.forEach((p) => useEscena.getState().descubrir(p))

  const voltear = () => {
    const e = extra.current
    e.tocada = true
    if (Math.abs(e.giro - e.giroObj) > 0.3 || e.anticipar >= 0) return
    descubrir(['anticipacion'])
    if (reducido) {
      e.giroObj += Math.PI
      e.giro = e.giroObj
    } else {
      e.anticipar = performance.now() / 1000
    }
    useEscena.getState().setVolteada(!useEscena.getState().volteada)
  }

  // Punto del puntero sobre el paño (y = 0).
  const puntoEnMesa = (clientX, clientY) => {
    const r = gl.domElement.getBoundingClientRect()
    const ndc = new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1)
    raycaster.setFromCamera(ndc, camera)
    const p = new THREE.Vector3()
    return raycaster.ray.intersectPlane(plano, p) ? p : null
  }

  // Órdenes del botón accesible (teclado).
  const orden = useEscena((s) => s.orden)
  useEffect(() => {
    if (!orden) return
    despertarAudio()
    if (orden.tipo === 'voltear') voltear()
    if (orden.tipo === 'empujar' && !reducido) {
      const [dx, dz, fuerte] = orden.datos
      const f = fuerte ? 5 : 2
      c.vx += dx * f
      c.vz += dz * f
      c.w = c.vx * 2
      c.lanzada = true
      extra.current.tocada = true
    }
    // voltear solo lee refs y el store: no hace falta en las dependencias
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orden, c, reducido])

  // En táctil, tocar la carta no debe hacer scroll; tocar fuera sí.
  useEffect(() => {
    const canvas = gl.domElement
    canvas.style.touchAction = 'pan-y'
    const alTocar = (e) => {
      const toque = e.touches[0]
      const p = toque && puntoEnMesa(toque.clientX, toque.clientY)
      // Solo en la parada de entrada: más abajo la carta está oculta y el dedo debe hacer scroll.
      if (!p || vivo.progreso >= 0.5) return
      // El toque, en el sistema de la carta girada (el grupo gira -c.rot en Y).
      const dx = p.x - c.x
      const dz = p.z - Z0 - c.z
      const cos = Math.cos(c.rot)
      const sin = Math.sin(c.rot)
      const lx = dx * cos + dz * sin
      const lz = -dx * sin + dz * cos
      if (Math.abs(lx) < ANCHO * 0.75 && Math.abs(lz) < LARGO * 0.65) e.preventDefault()
    }
    canvas.addEventListener('touchstart', alTocar, { passive: false })
    return () => canvas.removeEventListener('touchstart', alTocar)
    // puntoEnMesa solo usa refs estables
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, c])

  // Un solo arrastre a la vez: un segundo dedo se ignora y los listeners de la
  // ventana se quitan siempre por la misma vía (también al desmontar).
  const limpiarArrastre = useRef(() => {})
  useEffect(
    () => () => {
      limpiarArrastre.current()
      document.body.style.cursor = ''
    },
    [],
  )

  const alBajar = (e) => {
    e.stopPropagation()
    if (e.nativeEvent.button > 0 || puntero.current) return
    despertarAudio()
    sonar('recoger', { volumen: 0.6 })
    const ahora = performance.now() / 1000
    const p = puntoEnMesa(e.nativeEvent.clientX, e.nativeEvent.clientY) || new THREE.Vector3(c.x, 0, c.z + Z0)
    p.z -= Z0
    extra.current.tocada = true
    puntero.current = {
      id: e.nativeEvent.pointerId, ox: p.x - c.x, oz: p.z - c.z,
      inicioX: e.nativeEvent.clientX, inicioY: e.nativeEvent.clientY, inicio: ahora,
      ultX: p.x, ultZ: p.z, ultT: ahora,
    }
    c.sostener = reducido ? null : { inicio: ahora, fase: 'carga' }
    c.vx = 0
    c.vz = 0

    const mover = (ev) => {
      const pt = puntero.current
      if (!pt || ev.pointerId !== pt.id || reducido) return
      if (c.sostener && c.sostener.fase !== 'carga') return
      if (!c.arrastrando && Math.hypot(ev.clientX - pt.inicioX, ev.clientY - pt.inicioY) > 6) {
        c.arrastrando = true
        c.sostener = null
        c.temblor = 0
      }
      if (!c.arrastrando) return
      const q = puntoEnMesa(ev.clientX, ev.clientY)
      if (!q) return
      q.z -= Z0
      const t2 = performance.now() / 1000
      const dt = Math.max(0.008, t2 - pt.ultT)
      c.vx = c.vx * 0.5 + ((q.x - pt.ultX) / dt) * 0.5
      c.vz = c.vz * 0.5 + ((q.z - pt.ultZ) / dt) * 0.5
      pt.ultX = q.x
      pt.ultZ = q.z
      pt.ultT = t2
      c.x = q.x - pt.ox
      c.z = q.z - pt.oz
    }
    const soltar = (ev) => {
      const pt = puntero.current
      if (!pt || ev.pointerId !== pt.id) return
      limpiarArrastre.current()
      const accion = clasificarSoltar(performance.now() / 1000 - pt.inicio, c.arrastrando, c.sostener?.fase)
      const quieto = performance.now() / 1000 - pt.ultT > 0.08
      puntero.current = null
      c.sostener = null
      c.temblor = 0
      if (accion === 'lanzar') {
        if (quieto) {
          c.vx = 0
          c.vz = 0
        }
        c.w = c.vx * 2
        c.lanzada = Math.hypot(c.vx, c.vz) > 0.6
      }
      c.arrastrando = false
      if (accion === 'voltear' || reducido) voltear()
    }
    window.addEventListener('pointermove', mover)
    window.addEventListener('pointerup', soltar)
    window.addEventListener('pointercancel', soltar)
    limpiarArrastre.current = () => {
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerup', soltar)
      window.removeEventListener('pointercancel', soltar)
      limpiarArrastre.current = () => {}
    }
  }

  useFrame((state, dtReal) => {
    if (!raiz.current) return
    // Al bajar a la mano la carta de entrada deja el sitio libre.
    const fuera = vivo.progreso > 0.6
    raiz.current.visible = !fuera
    sombra.current.visible = !fuera
    const ahora = performance.now() / 1000
    const dt = Math.min(dtReal, 0.033)
    const e = extra.current
    if (e.inicio < 0) e.inicio = ahora

    if (!reducido) {
      const eventos = paso(c, dt, ahora, limitesVisibles(camera))
      descubrir(principiosDe(eventos, c))
      for (const ev of eventos) {
        if (ev.tipo === 'rebote' && ev.impacto > IMPACTO_SACUDIDA) {
          useEscena.getState().sacudir(Math.min(18, ev.impacto * 3))
          useEscena.getState().soltarFichas([ev.punto[0], ev.punto[1] + Z0], Math.min(26, Math.round(ev.impacto * 5)), Math.min(2.5, ev.impacto * 0.45))
          sonarFichas(8)
          sonar('aterrizar', { volumen: 1 })
        } else if (ev.tipo === 'rebote' && ev.impacto > 0.3) {
          sonar('aterrizar', { volumen: Math.min(0.7, ev.impacto / 3) })
        } else if (ev.tipo === 'estallido') {
          useEscena.getState().sacudir(10)
          useEscena.getState().soltarFichas([c.x, c.z + Z0], 22, 2)
          sonarFichas(10)
          sonar('aterrizar', { volumen: 1 })
        }
      }
    }

    // Volteo: anticipación y muelle.
    if (e.anticipar >= 0 && ahora - e.anticipar > 0.12) {
      e.anticipar = -1
      e.giroObj += Math.PI
      sonar('elegida')
    }
    const fuerza = (e.giroObj - e.giro) * 160 - e.vGiro * 15
    e.vGiro += fuerza * dt
    e.giro += e.vGiro * dt

    // Saltito si nadie la toca.
    if (!e.tocada && !reducido && ahora - e.inicio > 3.5 && ahora - e.ultimoSalto > 4.5) {
      e.saltoInicio = ahora
      e.ultimoSalto = ahora
    }
    let salto = 0
    if (e.saltoInicio >= 0) {
      const p = (ahora - e.saltoInicio) / 0.5
      if (p >= 1) e.saltoInicio = -1
      else salto = Math.sin(p * Math.PI) * 0.03
    }

    const congelada = ahora < c.pausaHasta
    const tiembla = c.temblor * 0.006
    const fraccion = (((e.giro % Math.PI) + Math.PI) % Math.PI) / Math.PI
    const levantar = Math.sin(fraccion * Math.PI) * 0.06
    raiz.current.position.set(
      c.x + (Math.random() - 0.5) * tiembla,
      ALTURA + salto + levantar,
      c.z + Z0 + (Math.random() - 0.5) * tiembla,
    )
    sombra.current.position.set(c.x, 0.0015, c.z + Z0)
    sombra.current.rotation.z = -c.rot
    ejeK.current.rotation.y = -c.angK
    escK.current.scale.set(1 + c.k, 1, 1 - c.k * 0.45)
    ejeK2.current.rotation.y = c.angK
    ejeQ.current.rotation.y = -c.angQ
    escQ.current.scale.set(1 - c.q, 1, 1 + c.q * 0.5)
    ejeQ2.current.rotation.y = c.angQ
    const s = (e.anticipar >= 0 ? 0.9 : 1) * (congelada ? 1.07 : 1)
    unif.current.scale.setScalar(s)
    // Quieta, se endereza despacio hacia la orientación más cercana.
    if (Math.abs(c.w) < 0.1 && !c.arrastrando) c.rot += (Math.round(c.rot / Math.PI) * Math.PI - c.rot) * Math.min(1, dt * 1.2)
    unif.current.rotation.y = -c.rot
    giro.current.rotation.z = e.giro
    if (halo.current) halo.current.visible = useEscena.getState().foco
  })

  if (!reverso || !joker) return null

  return (
    <>
    {/* Mancha de sombra: se queda en el paño aunque la carta se levante */}
    <mesh ref={sombra} rotation-x={-Math.PI / 2} position={[0, 0.0015, Z0]}>
      <planeGeometry args={[ANCHO * 1.06, LARGO * 1.05]} />
      <meshBasicMaterial color="#000" transparent opacity={0.25} depthWrite={false} />
    </mesh>
    <group ref={raiz} onPointerDown={alBajar} onPointerOver={() => (document.body.style.cursor = 'grab')} onPointerOut={() => (document.body.style.cursor = '')}>
      <group ref={ejeK}>
        <group ref={escK}>
          <group ref={ejeK2}>
            <group ref={ejeQ}>
              <group ref={escQ}>
                <group ref={ejeQ2}>
                  <group ref={unif}>
                    <mesh ref={halo} rotation-x={-Math.PI / 2} position-y={-0.001} visible={false}>
                      <planeGeometry args={[ANCHO + 0.02, LARGO + 0.02]} />
                      <meshBasicMaterial color="#efe7d6" transparent opacity={0.5} />
                    </mesh>
                    <group ref={giro}>
                      <mesh rotation-x={-Math.PI / 2}>
                        <planeGeometry args={[ANCHO, LARGO]} />
                        <meshStandardMaterial map={reverso} transparent alphaTest={0.5} roughness={0.7} />
                      </mesh>
                      <mesh rotation-x={Math.PI / 2}>
                        <planeGeometry args={[ANCHO, LARGO]} />
                        <meshStandardMaterial map={joker} transparent alphaTest={0.5} roughness={0.7} />
                      </mesh>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
    </>
  )
}
