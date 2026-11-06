import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useIdioma } from '../lib/idioma'
import { useMovimientoReducido } from '../lib/useMovimientoReducido'
import { fichas as sonarFichas, sonar } from '../lib/sonido'
import { perfil } from '../content/perfil'
import { texturaJoker, texturaReverso } from './carta/texturas'
import { useTextura } from './carta/useTextura'
import { crearCaida, despegar, pasoCaida, soltarDesde } from './carta/caida'
import { ANCHO_CARTA, LARGO_CARTA } from './mano/disposicion'
import { useEscena } from './estado'
import { vivo } from './vivo'

const SITIO = [0.3, 0.003, 0.22]
const GIRO_Y = Math.PI + 0.2 // la cara del Joker viene girada 180°
const DESDE = 2.4 // progreso a partir del cual está en la mesa (antes estorbaría al blackjack)
const ESPERA_VOLTEO = 0.35 // s posada antes de voltearse

// El Joker cae del cielo a la mesa, boca abajo, y se voltea: la firma del recorrido.
// Usa los cinco principios de la entrada; al irse se agacha y sube de vuelta.
export default function JokerMesa() {
  const { t } = useIdioma()
  const reducido = useMovimientoReducido()
  const oficio = t(perfil.oficio)
  const joker = useTextura(() => texturaJoker(perfil.nombre, oficio), [oficio])
  const reverso = useTextura(texturaReverso, [])
  const grupo = useRef(null)
  const escala = useRef(null)
  const giro = useRef(null)
  const caida = useMemo(() => crearCaida(), [])
  const volteo = useRef({ g: Math.PI, v: 0, obj: Math.PI, posadaDesde: -1, anticipar: -1, alto: 0 })
  const encima = useRef(false)

  useFrame((_, dtReal) => {
    const g = grupo.current
    if (!g) return
    const dt = Math.min(dtReal, 0.05)
    const ahora = performance.now() / 1000
    const vo = volteo.current
    const dentro = vivo.progreso > DESDE

    if (reducido) {
      Object.assign(caida, { fase: dentro ? 'posada' : 'fuera', y: 0, k: 0, q: 0 })
      vo.g = vo.obj = 0
    } else {
      if (dentro && caida.fase === 'fuera') {
        soltarDesde(caida)
        Object.assign(vo, { g: Math.PI, v: 0, obj: Math.PI, posadaDesde: -1, anticipar: -1 })
      }
      if (!dentro) despegar(caida, ahora)
      for (const ev of pasoCaida(caida, dt, ahora)) {
        if (ev.tipo !== 'impacto') continue
        useEscena.getState().sacudir(Math.min(12, ev.fuerza * 2.5))
        useEscena.getState().soltarFichas([SITIO[0], SITIO[2]], 14, 1.4)
        sonarFichas(6)
        sonar('aterrizar', { volumen: 1 })
      }
      // Posada un momento: se agacha (anticipación) y se voltea con muelle (inercia).
      if (caida.fase === 'posada' && vo.posadaDesde < 0) vo.posadaDesde = ahora
      if (vo.posadaDesde >= 0 && vo.obj !== 0 && vo.anticipar < 0 && ahora - vo.posadaDesde > ESPERA_VOLTEO) vo.anticipar = ahora
      if (vo.anticipar >= 0 && vo.obj !== 0 && ahora - vo.anticipar > 0.12) {
        vo.obj = 0
        sonar('elegida')
      }
      vo.v += ((vo.obj - vo.g) * 160 - vo.v * 15) * dt
      vo.g += vo.v * dt
    }

    g.visible = caida.fase !== 'fuera'
    vo.alto += ((encima.current && caida.fase === 'posada' ? 0.025 : 0) - vo.alto) * Math.min(1, dt * 10)
    // Levanta un poco mientras gira, para no atravesar el paño.
    const levantar = Math.abs(Math.sin(vo.g)) * 0.06
    g.position.set(SITIO[0], SITIO[1] + caida.y + vo.alto + levantar, SITIO[2])
    const agache = vo.anticipar >= 0 && vo.obj !== 0 ? 0.9 : 1
    // Estirada a lo largo al caer o subir; aplastada (más ancha, más corta) al aterrizar.
    escala.current.scale.set((1 - caida.k * 0.4 + caida.q) * agache, 1, (1 + caida.k - caida.q * 0.6) * agache)
    giro.current.rotation.z = vo.g
  })

  if (!joker || !reverso) return null
  return (
    <group
      ref={grupo}
      rotation-y={GIRO_Y}
      visible={false}
      onPointerOver={() => (encima.current = true)}
      onPointerOut={() => (encima.current = false)}
    >
      <group ref={escala}>
        <mesh rotation-x={-Math.PI / 2} position-y={-0.0015}>
          <planeGeometry args={[ANCHO_CARTA * 1.04, LARGO_CARTA * 1.03]} />
          <meshBasicMaterial color="#000" transparent opacity={0.3} depthWrite={false} />
        </mesh>
        <group ref={giro}>
          <mesh rotation-x={-Math.PI / 2}>
            <planeGeometry args={[ANCHO_CARTA, LARGO_CARTA]} />
            <meshStandardMaterial map={joker} transparent alphaTest={0.5} roughness={0.7} />
          </mesh>
          <mesh rotation-x={Math.PI / 2}>
            <planeGeometry args={[ANCHO_CARTA, LARGO_CARTA]} />
            <meshStandardMaterial map={reverso} transparent alphaTest={0.5} roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
