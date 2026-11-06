import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useIdioma } from '../lib/idioma'
import { perfil } from '../content/perfil'
import { texturaJoker } from './carta/texturas'
import { useTextura } from './carta/useTextura'
import { ANCHO_CARTA, LARGO_CARTA } from './mano/disposicion'
import { vivo } from './vivo'

const SITIO_JOKER = [0.3, 0.003, 0.22]
const DESDE = 2.4 // progreso a partir del cual está en la mesa (antes estorbaría al blackjack)

// El Joker boca arriba en la mesa: la firma al final del recorrido.
export default function JokerMesa() {
  const { t } = useIdioma()
  const oficio = t(perfil.oficio)
  const joker = useTextura(() => texturaJoker(perfil.nombre, oficio), [oficio])
  const grupo = useRef(null)
  const encima = useRef(false)

  useFrame((_, dt) => {
    const g = grupo.current
    if (!g) return
    g.visible = vivo.progreso > DESDE
    const alto = SITIO_JOKER[1] + (encima.current ? 0.025 : 0)
    g.position.y += (alto - g.position.y) * Math.min(1, dt * 10)
  })

  if (!joker) return null
  return (
    <group
      ref={grupo}
      position={SITIO_JOKER}
      // La cara del Joker viene girada 180° (está pensada para verse tras voltear la carta).
      rotation-y={Math.PI + 0.2}
      visible={false}
      onPointerOver={() => (encima.current = true)}
      onPointerOut={() => (encima.current = false)}
    >
      <mesh rotation-x={-Math.PI / 2} position-y={-0.0015}>
        <planeGeometry args={[ANCHO_CARTA * 1.04, LARGO_CARTA * 1.03]} />
        <meshBasicMaterial color="#000" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[ANCHO_CARTA, LARGO_CARTA]} />
        <meshStandardMaterial map={joker} transparent alphaTest={0.5} roughness={0.7} />
      </mesh>
    </group>
  )
}
