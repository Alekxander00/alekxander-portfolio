import { useEffect, useRef } from 'react'

// Luz pequeña pegada a la cámara: alumbra solo lo que está muy cerca (la carta que
// sube a mirarte), sin tocar la mesa, que siempre queda más lejos que ALCANCE.
const ALCANCE = 0.5
import { useFrame, useThree } from '@react-three/fiber'
import { camaraEn, conPartida, progresoDeScroll } from './recorrido'
import { useEscena } from './estado'
import { vivo } from './vivo'
import { useMovimientoReducido } from '../lib/useMovimientoReducido'

// Mueve la cámara según el scroll: cada [data-parada] es una parada del recorrido.
export default function Camara() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const reducido = useMovimientoReducido()
  const inicios = useRef([])
  const actual = useRef(null)
  const luz = useRef(null)

  useEffect(() => {
    const medir = () => {
      inicios.current = [...document.querySelectorAll('[data-parada]')].map(
        (el) => el.getBoundingClientRect().top + window.scrollY,
      )
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(document.body)
    window.addEventListener('resize', medir)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', medir)
    }
  }, [])

  useFrame((_, dt) => {
    const movil = size.width < size.height
    const p = progresoDeScroll(window.scrollY, inicios.current, document.documentElement.scrollHeight - window.innerHeight)
    vivo.progreso = p
    vivo.movil = movil
    const recorrido = camaraEn(p, movil, reducido)
    // Con una partida en marcha, la parada de la Máquina se ve de frente.
    const objetivo = useEscena.getState().bj ? conPartida(recorrido, p, movil) : recorrido
    if (!actual.current) actual.current = { pos: [...objetivo.pos], mira: [...objetivo.mira] }
    const a = actual.current
    const k = reducido ? 1 : 1 - Math.exp(-8 * Math.min(dt, 0.05))
    for (let i = 0; i < 3; i++) {
      a.pos[i] += (objetivo.pos[i] - a.pos[i]) * k
      a.mira[i] += (objetivo.mira[i] - a.mira[i]) * k
    }

    // Sacudida: desplazamiento aleatorio que se apaga solo.
    const { sacudida } = useEscena.getState()
    let sx = 0
    let sy = 0
    if (sacudida > 0.01 && !reducido) {
      sx = (Math.random() - 0.5) * sacudida * 0.004
      sy = (Math.random() - 0.5) * sacudida * 0.004
      useEscena.setState({ sacudida: sacudida * Math.exp(-8 * Math.min(dt, 0.05)) })
    } else if (sacudida) {
      useEscena.setState({ sacudida: 0 })
    }

    camera.position.set(a.pos[0] + sx, a.pos[1] + sy, a.pos[2])
    camera.lookAt(a.mira[0] + sx, a.mira[1], a.mira[2])
    luz.current?.position.copy(camera.position)
  })

  return <pointLight ref={luz} intensity={3} distance={ALCANCE} decay={2} color="#ffe2b8" />
}
