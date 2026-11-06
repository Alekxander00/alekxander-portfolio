import { useEffect, useState } from 'react'
import { Canvas, events, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useEscena } from './estado'
import Camara from './Camara'
import Mesa from './Mesa'
import Fichas from './Fichas'
import CartaEntrada from './carta/CartaEntrada'
import ManoMesa from './mano/ManoMesa'
import MaquinaMesa from './maquina/MaquinaMesa'
import CartasBlackjack from './maquina/CartasBlackjack'
import JokerMesa from './JokerMesa'
import { soloVisibles } from './visibles'
import './escena.css'

const FONDO = '#0c0a09'

// Tras REPOSO sin gestos la mesa baja de 60 a FPS_REPOSO fotogramas por segundo:
// ahorra batería en celular y deja vivas las animaciones lentas (la Máquina
// respira, la carta de entrada da saltitos). Cualquier gesto la devuelve a 60.
const REPOSO = 4000 // ms
const FPS_REPOSO = 20
const GESTOS = ['scroll', 'wheel', 'pointerdown', 'pointermove', 'touchstart', 'keydown']

function useActiva() {
  const [activa, setActiva] = useState(true)
  useEffect(() => {
    let reloj
    const despertar = () => {
      setActiva(true)
      clearTimeout(reloj)
      reloj = setTimeout(() => setActiva(false), REPOSO)
    }
    despertar()
    GESTOS.forEach((g) => window.addEventListener(g, despertar, { passive: true }))
    return () => {
      clearTimeout(reloj)
      GESTOS.forEach((g) => window.removeEventListener(g, despertar))
    }
  }, [])
  return activa
}

// En reposo ('demand') pide un fotograma cada 1/FPS_REPOSO s.
function Latido({ late }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    if (!late) return
    const id = setInterval(() => invalidate(), 1000 / FPS_REPOSO)
    return () => clearInterval(id)
  }, [late, invalidate])
  return null
}

// El canvas de la mesa: fijo detrás de toda la página.
export default function Escena({ children, onPerdida }) {
  const pausada = useEscena((s) => s.pausada)
  const [oculta, setOculta] = useState(() => document.hidden)
  const [tactil] = useState(() => window.matchMedia('(pointer: coarse)').matches)
  const activa = useActiva()
  const detenida = oculta || pausada

  useEffect(() => {
    const fn = () => setOculta(document.hidden)
    document.addEventListener('visibilitychange', fn)
    document.documentElement.classList.add('con-mesa')
    return () => {
      document.removeEventListener('visibilitychange', fn)
      document.documentElement.classList.remove('con-mesa')
    }
  }, [])

  return (
    <div className="escena">
      <Canvas
        dpr={[1, tactil ? 1.5 : 2]}
        frameloop={detenida ? 'never' : activa ? 'always' : 'demand'}
        camera={{ fov: 45, near: 0.05, far: 20, position: [0, 0.62, 0.62] }}
        events={(store) => ({ ...events(store), filter: soloVisibles })}
        gl={(base) => {
          // Si el navegador no acepta estos atributos se reintenta con los básicos;
          // si tampoco, la página vuelve a la versión plana en vez de quedarse negra.
          try {
            return new THREE.WebGLRenderer({ ...base, antialias: true, powerPreference: 'high-performance' })
          } catch {
            try {
              return new THREE.WebGLRenderer({ canvas: base.canvas })
            } catch (error) {
              onPerdida?.()
              throw error
            }
          }
        }}
        onCreated={({ scene, gl }) => {
          gl.domElement.addEventListener('webglcontextlost', () => onPerdida?.(), { once: true })
          scene.background = new THREE.Color(FONDO)
          scene.fog = new THREE.Fog(FONDO, 2.2, 5)
        }}
      >
        <Latido late={!detenida && !activa} />
        <Camara />
        <Mesa />
        <CartaEntrada />
        <Fichas />
        <ManoMesa />
        <MaquinaMesa />
        <CartasBlackjack />
        <JokerMesa />
        {children}
      </Canvas>
    </div>
  )
}
