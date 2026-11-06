/* eslint-disable react-hooks/immutability -- animación: los huesos del modelo se mutan cada fotograma */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cargarBbmodel, posar } from '../../components/maquina/bbmodel'
import { sonar } from '../../lib/sonido'
import { useEscena } from '../estado'
import { vivo } from '../vivo'

const ALTO = 1.25
const BASE = [0, -0.45, -0.85]

// La Máquina Expendedora de Baluarte, de pie al otro lado de la mesa: la crupier.
export default function MaquinaMesa() {
  const [modelo, setModelo] = useState(null)
  const envoltura = useMemo(() => new THREE.Group(), [])
  const reloj = useRef({ anim: 'Idle', t: 0, proximaRandom: 9 })
  const golpes = useEscena((s) => s.golpesMaquina)
  const golpear = useEscena((s) => s.golpear)

  useEffect(() => {
    let vivoEf = true
    cargarBbmodel('/maquina/maquina.bbmodel')
      .then((m) => {
        if (!vivoEf) return
        posar(m.huesos, m.animaciones.Idle, 0)
        const caja = new THREE.Box3().setFromObject(m.raiz)
        const tam = caja.getSize(new THREE.Vector3())
        const centro = caja.getCenter(new THREE.Vector3())
        const k = ALTO / tam.y
        m.raiz.scale.setScalar(k)
        m.raiz.position.set(-centro.x * k, -caja.min.y * k, -centro.z * k)
        envoltura.add(m.raiz)
        envoltura.rotation.y = Math.PI
        // La boca real del modelo: de ahí salen las cartas del blackjack.
        envoltura.updateWorldMatrix(true, true)
        const boca = [...m.huesos.values()].find((h) => h.name === 'Mouth')
        if (boca) {
          const p = boca.getWorldPosition(new THREE.Vector3())
          vivo.boca = [p.x, p.y, p.z + 0.08]
        }
        setModelo(m)
      })
      .catch((e) => console.warn('La Máquina no cargó', e))
    return () => {
      vivoEf = false
      envoltura.clear()
    }
  }, [envoltura])

  useEffect(() => {
    if (golpes > 0) {
      reloj.current.anim = 'Hit'
      reloj.current.t = 0
    }
  }, [golpes])

  useFrame((state, dtReal) => {
    if (!modelo) return
    const dt = Math.min(dtReal, 0.05)
    const r = reloj.current
    r.t += dt
    const anim = modelo.animaciones[r.anim]
    if (r.anim !== 'Idle' && (!anim || r.t >= anim.fin)) {
      r.anim = 'Idle'
      r.t = 0
    }
    if (r.anim === 'Idle' && vivo.progreso > 1.5) {
      r.proximaRandom -= dt
      if (r.proximaRandom <= 0 && modelo.animaciones.Random) {
        r.anim = 'Random'
        r.t = 0
        r.proximaRandom = 8 + Math.random() * 6
        sonar('aleatoria', { volumen: 0.35 })
      }
    }
    const actual = modelo.animaciones[r.anim]
    posar(modelo.huesos, actual, r.anim === 'Idle' && actual ? r.t % (actual.duracion || 1) : r.t)
    // Mira un poco hacia el puntero (el frente del modelo mira a -Z: se gira 180°).
    const objetivo = Math.PI + state.pointer.x * 0.25
    envoltura.rotation.y += (objetivo - envoltura.rotation.y) * Math.min(1, dt * 4)
  })

  return (
    <group position={BASE}>
      <group
        onClick={(e) => {
          e.stopPropagation()
          golpear()
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <primitive object={envoltura} />
      </group>
      {/* Su propia luz dorada: la Máquina queda fuera del foco de la lámpara */}
      <pointLight position={[0, 0.9, 0.55]} intensity={2.2} distance={2.2} color="#ffcc4d" />
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.45, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.4} depthWrite={false} />
      </mesh>
    </group>
  )
}
