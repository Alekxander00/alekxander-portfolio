/* eslint-disable react-hooks/immutability -- animación: la carta se mueve cada fotograma */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useEscena } from '../estado'
import { vivo } from '../vivo'
import { useIdioma } from '../../lib/idioma'
import { canvasReversoTarot, canvasTarot, TAROT } from '../../lib/caraTarot'
import { ANCHO_CARTA } from '../mano/disposicion'
import { Carta } from './CartasBlackjack'
import { TRAMO } from './tramo'

const LARGO = (ANCHO_CARTA * TAROT.H) / TAROT.W
// En celular el panel de la lectura tapa el centro del paño: la carta va más al fondo.
const DESTINO = { desk: [0, 0.004, -0.13], movil: [0, 0.004, -0.3] }
const ESCALA = { desk: 1.3, movil: 1 }

function aTextura(c) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

// La carta de tarot que lee la Máquina: sale por su boca, se desliza al centro
// del paño y se voltea. Invertida, queda cabeza abajo. Al recogerla vuelve a la boca.
export default function CartaTarotMesa() {
  const tarot = useEscena((s) => s.tarot)
  const { idioma } = useIdioma()
  // La última carta sigue montada mientras vuelve a la boca.
  const [ultima, setUltima] = useState(null)
  const [cara, setCara] = useState(null)
  const reverso = useMemo(() => aTextura(canvasReversoTarot()), [])
  const estado = useMemo(() => ({ x: vivo.boca[0], y: vivo.boca[1], z: vivo.boca[2], flip: Math.PI }), [])
  const idActual = useRef(null)

  useEffect(() => () => reverso.dispose(), [reverso])

  // Una carta nueva arranca en la boca, boca abajo.
  useEffect(() => {
    if (!tarot || tarot.id === idActual.current) return
    idActual.current = tarot.id
    Object.assign(estado, { x: vivo.boca[0], y: vivo.boca[1], z: vivo.boca[2], flip: Math.PI })
    setUltima(tarot)
  }, [tarot, estado])

  // La cara se dibuja de nuevo al cambiar de carta o de idioma.
  useEffect(() => {
    if (!ultima) return
    let viva = true
    let tex = null
    canvasTarot(ultima.arcano, idioma).then((c) => {
      if (!viva) return
      tex = aTextura(c)
      setCara(tex)
    })
    return () => {
      viva = false
      tex?.dispose()
    }
  }, [ultima, idioma])

  useFrame((_, dtReal) => {
    if (!estado.grupo) return
    const dt = Math.min(dtReal, 0.05)
    const k = 1 - Math.exp(-9 * dt)
    const recoger = !tarot || tarot.recoger || vivo.progreso < TRAMO[0] || vivo.progreso > TRAMO[1]
    const [bx, by, bz] = vivo.boca
    const [x, y, z] = recoger ? [bx, by, bz] : vivo.movil ? DESTINO.movil : DESTINO.desk
    estado.grupo.scale.setScalar(vivo.movil ? ESCALA.movil : ESCALA.desk)
    estado.x += (x - estado.x) * k
    estado.z += (z - estado.z) * k
    const lejos = Math.min(1, Math.hypot(x - estado.x, z - estado.z) * 2)
    estado.y += (y + lejos * 0.12 - estado.y) * k
    // Se voltea cuando ya casi ha llegado, como si la Máquina la destapara.
    const voltear = !recoger && lejos < 0.15
    estado.flip += ((voltear ? 0 : Math.PI) - estado.flip) * (1 - Math.exp(-6 * dt))
    estado.grupo.position.set(estado.x, estado.y + Math.sin(estado.flip) * 0.05, estado.z)
    estado.grupo.rotation.y = ultima?.invertida ? Math.PI : 0
    estado.grupo.visible = !recoger || Math.hypot(estado.x - bx, estado.z - bz) > 0.04
    estado.giro.rotation.z = estado.flip
  })

  if (!ultima || !cara) return null
  return <Carta textura={cara} reverso={reverso} estado={estado} largo={LARGO} escala={ESCALA.desk} />
}
