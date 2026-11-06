/* eslint-disable react-hooks/immutability -- animación: cada carta se mueve cada fotograma */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useEscena } from '../estado'
import { vivo } from '../vivo'
import { texturaNaipe } from '../carta/naipe'
import { texturaReverso } from '../carta/texturas'
import { ANCHO_CARTA, LARGO_CARTA } from '../mano/disposicion'

const ESCALA = 0.72
const SEPARA = 0.135
const FILA = { casa: -0.28, jugador: 0.02 }
// A la izquierda, simétrica al mazo; en celular más cerca del centro para que se vea.
const SECRETA = { desk: [-0.66, 0.004, -0.15], movil: [-0.21, 0.004, -0.13] }
// Fuera de la parada de la Máquina las cartas vuelven a su boca y se ocultan.
const TRAMO = [1.45, 2.5]

function Carta({ textura, reverso, estado, onTocar }) {
  const grupo = useRef(null)
  const giro = useRef(null)
  useEffect(() => {
    estado.grupo = grupo.current
    estado.giro = giro.current
  }, [estado])
  return (
    <group
      ref={grupo}
      position={vivo.boca}
      scale={ESCALA}
      onClick={
        onTocar &&
        ((e) => {
          e.stopPropagation()
          onTocar()
        })
      }
      onPointerOver={
        onTocar &&
        ((e) => {
          e.stopPropagation()
          estado.encima = true
          document.body.style.cursor = 'pointer'
        })
      }
      onPointerOut={
        onTocar &&
        (() => {
          estado.encima = false
          document.body.style.cursor = ''
        })
      }
    >
      <group ref={giro}>
        <mesh rotation-x={-Math.PI / 2}>
          <planeGeometry args={[ANCHO_CARTA, LARGO_CARTA]} />
          <meshStandardMaterial map={textura} transparent alphaTest={0.5} roughness={0.7} />
        </mesh>
        <mesh rotation-x={Math.PI / 2}>
          <planeGeometry args={[ANCHO_CARTA, LARGO_CARTA]} />
          <meshStandardMaterial map={reverso} transparent alphaTest={0.5} roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

// Las cartas del blackjack salen por la boca de la Máquina y se deslizan por el paño.
export default function CartasBlackjack() {
  const bj = useEscena((s) => s.bj)
  const secretaFuera = useEscena((s) => s.secretaFuera)
  const [reverso, setReverso] = useState(null)
  // Mapas estables (no son estado de React): texturas por carta y su animación.
  const texturas = useMemo(() => new Map(), [])
  const estados = useMemo(() => new Map(), [])

  useEffect(() => {
    let vivoEf = true
    texturaReverso().then((t) => vivoEf && setReverso(t))
    return () => {
      vivoEf = false
      texturas.forEach((t) => t.dispose())
    }
  }, [texturas])

  const cartas = useMemo(() => {
    if (!bj) return []
    const lista = []
    for (const [fila, mano] of [['casa', bj.casa], ['jugador', bj.jugador]]) {
      mano.forEach((c, i) => {
        lista.push({ ...c, fila, i, n: mano.length, oculta: fila === 'casa' && i === 1 && bj.ocultar })
      })
    }
    return lista
  }, [bj])

  const texturaDe = (c) => {
    if (!texturas.has(c.id)) texturas.set(c.id, texturaNaipe(c.valor, c.palo))
    return texturas.get(c.id)
  }
  const estadoDe = (id) => {
    if (!estados.has(id)) estados.set(id, { x: vivo.boca[0], y: vivo.boca[1], z: vivo.boca[2], flip: Math.PI, salto: 0 })
    return estados.get(id)
  }

  useFrame((_, dtReal) => {
    const dt = Math.min(dtReal, 0.05)
    const k = 1 - Math.exp(-9 * dt)
    const recoger = vivo.progreso < TRAMO[0] || vivo.progreso > TRAMO[1]
    const [bx, by, bz] = vivo.boca
    // Visible mientras no haya llegado a la boca.
    const verSi = (e) => !recoger || Math.hypot(e.x - bx, e.z - bz) > 0.04
    for (const c of cartas) {
      const e = estados.get(c.id)
      if (!e?.grupo) continue
      const x = recoger ? bx : (c.i - (c.n - 1) / 2) * SEPARA
      const z = recoger ? bz : FILA[c.fila]
      const y = recoger ? by : 0.004 + c.i * 0.001
      e.x += (x - e.x) * k
      e.z += (z - e.z) * k
      // En el aire mientras viaja: arco que baja al llegar.
      const lejos = Math.min(1, Math.hypot(x - e.x, z - e.z) * 2)
      e.y += (y + lejos * 0.12 - e.y) * k
      e.flip += ((c.oculta || recoger ? Math.PI : 0) - e.flip) * (1 - Math.exp(-7 * dt))
      e.grupo.position.set(e.x, e.y + Math.sin(e.flip) * 0.04, e.z)
      e.grupo.visible = verSi(e)
      e.giro.rotation.z = e.flip
    }
    const s = estados.get('secreta')
    if (s?.grupo) {
      const [sx, sy, sz] = recoger ? vivo.boca : vivo.movil ? SECRETA.movil : SECRETA.desk
      s.x += (sx - s.x) * k
      s.z += (sz - s.z) * k
      const lejos = Math.min(1, Math.hypot(sx - s.x, sz - s.z) * 1.5)
      // Se levanta al pasar el puntero: invita a tocarla.
      s.y += (sy + lejos * 0.35 + (s.encima && !recoger ? 0.03 : 0) - s.y) * k
      s.grupo.position.set(s.x, s.y, s.z)
      s.grupo.visible = verSi(s)
      s.grupo.rotation.y = 0.4
      s.giro.rotation.z = Math.PI
    }
  })

  // Las cartas que ya no están en la mesa se olvidan.
  useEffect(() => {
    const vivas = new Set(cartas.map((c) => c.id))
    for (const id of [...estados.keys()]) if (id !== 'secreta' && !vivas.has(id)) estados.delete(id)
  }, [cartas, estados])

  if (!reverso) return null
  return (
    <group>
      {cartas.map((c) => (
        <Carta key={c.id} textura={texturaDe(c)} reverso={reverso} estado={estadoDe(c.id)} />
      ))}
      {secretaFuera && <Carta key="secreta" textura={reverso} reverso={reverso} estado={estadoDe('secreta')} onTocar={() => useEscena.getState().abrir('secreta')} />}
    </group>
  )
}
