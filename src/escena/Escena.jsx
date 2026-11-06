import { useEffect, useState } from 'react'
import { Canvas, events } from '@react-three/fiber'
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

// El canvas de la mesa: fijo detrás de toda la página.
export default function Escena({ children, onPerdida }) {
  const pausada = useEscena((s) => s.pausada)
  const [oculta, setOculta] = useState(() => document.hidden)
  const [tactil] = useState(() => window.matchMedia('(pointer: coarse)').matches)

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
        frameloop={oculta || pausada ? 'never' : 'always'}
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
