import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useEscena } from './estado'
import Camara from './Camara'
import Mesa from './Mesa'
import './escena.css'

const FONDO = '#0c0a09'

// El canvas de la mesa: fijo detrás de toda la página.
export default function Escena({ children }) {
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
        camera={{ fov: 45, near: 0.05, far: 20, position: [0, 1.15, 1.35] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(FONDO)
          scene.fog = new THREE.Fog(FONDO, 2.2, 5)
        }}
      >
        <Camara />
        <Mesa />
        {children}
      </Canvas>
    </div>
  )
}
