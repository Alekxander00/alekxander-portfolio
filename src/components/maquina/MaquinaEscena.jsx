/* eslint-disable react-hooks/immutability -- bucle de juego: el mundo se muta cada fotograma a propósito */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cargarBbmodel, posar } from './bbmodel'
import { sonar } from '../../lib/sonido'

function Modelo({ golpes, onListo, onError }) {
  const [modelo, setModelo] = useState(null)
  const envoltura = useMemo(() => new THREE.Group(), [])
  const reloj = useRef({ anim: 'Idle', t: 0, proximaRandom: 7 })
  const avisos = useRef({ onListo, onError })
  useEffect(() => {
    avisos.current = { onListo, onError }
  }, [onListo, onError])

  // Se carga una sola vez; los avisos van por ref para no recargar en cada render.
  useEffect(() => {
    let vivo = true
    cargarBbmodel('/maquina/maquina.bbmodel')
      .then((m) => {
        if (!vivo) return
        posar(m.huesos, m.animaciones.Idle, 0)
        // Centrar y escalar: la Máquina mide 2.2 unidades y apoya en el suelo.
        const caja = new THREE.Box3().setFromObject(m.raiz)
        const tam = caja.getSize(new THREE.Vector3())
        const centro = caja.getCenter(new THREE.Vector3())
        const escala = 2.2 / tam.y
        m.raiz.scale.setScalar(escala)
        m.raiz.position.set(-centro.x * escala, -caja.min.y * escala - 1.1, -centro.z * escala)
        envoltura.add(m.raiz)
        envoltura.rotation.y = Math.PI // el frente del modelo mira a -Z
        setModelo(m)
        avisos.current.onListo?.()
      })
      .catch((e) => {
        console.error(e)
        if (vivo) avisos.current.onError?.()
      })
    return () => {
      vivo = false
      envoltura.clear()
    }
  }, [envoltura])

  useEffect(() => {
    if (golpes > 0) {
      reloj.current.anim = 'Hit'
      reloj.current.t = 0
    }
  }, [golpes])

  useFrame((state, dt) => {
    if (!modelo) return
    const r = reloj.current
    r.t += dt
    const anim = modelo.animaciones[r.anim]
    if (r.anim !== 'Idle' && (!anim || r.t >= anim.fin)) {
      r.anim = 'Idle'
      r.t = 0
    }
    if (r.anim === 'Idle') {
      r.proximaRandom -= dt
      if (r.proximaRandom <= 0 && modelo.animaciones.Random) {
        r.anim = 'Random'
        r.t = 0
        r.proximaRandom = 8 + Math.random() * 6
        sonar('aleatoria', { volumen: 0.35 })
      }
    }
    const actual = modelo.animaciones[r.anim]
    const tt = r.anim === 'Idle' && actual ? r.t % (actual.duracion || 1) : r.t
    posar(modelo.huesos, actual, tt)
    // Mira un poco hacia el puntero.
    const objetivo = Math.PI + state.pointer.x * 0.35
    envoltura.rotation.y += (objetivo - envoltura.rotation.y) * Math.min(1, dt * 4)
    envoltura.rotation.x += (-state.pointer.y * 0.08 - envoltura.rotation.x) * Math.min(1, dt * 4)
  })

  return <primitive object={envoltura} />
}

export default function MaquinaEscena({ golpes, activa, onListo, onError }) {
  return (
    <Canvas
      frameloop={activa ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ position: [0, 0.35, 5.2], fov: 32 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <hemisphereLight args={['#ffe2b0', '#2a1c12', 0.9]} />
      <directionalLight position={[2.5, 4, 4]} intensity={1.6} color="#fff1d6" />
      <pointLight position={[0, 0.6, 1.4]} intensity={6} distance={4} color="#ffcc4d" />
      <Modelo golpes={golpes} onListo={onListo} onError={onError} />
    </Canvas>
  )
}
