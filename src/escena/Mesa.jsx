import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { PANO } from './medidas'
import { cargarBbmodel } from '../components/maquina/bbmodel'

// La mesa modelada en Blockbench. En sus unidades el paño es un polígono de 24
// lados de radios 14.48 × 11.63 a altura 1, y el borde sube hasta 2. Se escala
// para que su paño coincida con PANO (todo lo demás está medido sobre él).
const MODELO = '/Mesa/MesaBlackJack.bbmodel'
const PANO_MODELO = { rx: 15.23789 * 0.95, rz: 12.24417 * 0.95, y: 1 }

const COLOR_PANO = '#2e1012'
const COLOR_MADERA = '#3b2416'
const LUZ = '#ffb867' // ámbar de bombilla: más cálida, no lava las caras de las cartas

// Grano del paño: ruido suave en una textura pequeña que se repite.
function texturaPano() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const img = g.createImageData(128, 128)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 200 + Math.random() * 55
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  g.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(10, 6)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Mesa ovalada de paño con borde de madera y una lámpara colgante encima.
// Carga el modelo y lo deja con el paño en y = 0. Mientras tanto (o si falla) null.
function useMesaModelo() {
  const [raiz, setRaiz] = useState(null)
  useEffect(() => {
    let vigente = true
    cargarBbmodel(MODELO)
      .then((m) => {
        if (!vigente) return
        const sx = PANO.rx / PANO_MODELO.rx
        const sz = PANO.rz / PANO_MODELO.rz
        m.raiz.scale.set(sx, sx, sz)
        m.raiz.position.y = -PANO_MODELO.y * sx
        setRaiz(m.raiz)
      })
      .catch((e) => console.warn('La mesa de Blockbench no cargó; queda la de respaldo', e))
    return () => {
      vigente = false
    }
  }, [])
  return raiz
}

export default function Mesa() {
  const modelo = useMesaModelo()
  const { pano, borde, cuerpo, grano } = useMemo(() => {
    const forma = new THREE.Shape()
    forma.absellipse(0, 0, PANO.rx, PANO.rz, 0, Math.PI * 2)
    const pano = new THREE.ShapeGeometry(forma, 64)
    pano.rotateX(-Math.PI / 2)

    const curva = new THREE.CatmullRomCurve3(
      Array.from({ length: 64 }, (_, i) => {
        const a = (i / 64) * Math.PI * 2
        return new THREE.Vector3(Math.cos(a) * (PANO.rx + 0.04), 0.025, Math.sin(a) * (PANO.rz + 0.04))
      }),
      true,
    )
    const borde = new THREE.TubeGeometry(curva, 128, 0.05, 12, true)

    const cuerpo = new THREE.CylinderGeometry(1, 1, 0.08, 64)
    cuerpo.scale(PANO.rx + 0.09, 1, PANO.rz + 0.09)
    cuerpo.translate(0, -0.042, 0)
    return { pano, borde, cuerpo, grano: texturaPano() }
  }, [])

  return (
    <group>
      <hemisphereLight args={['#3b2c22', '#050404', 0.35]} />
      {modelo ? (
        <primitive object={modelo} />
      ) : (
        // Mesa de respaldo mientras carga el modelo (o si no carga).
        <group>
          <mesh geometry={pano} position={[0, 0.001, 0]}>
            <meshStandardMaterial color={COLOR_PANO} map={grano} roughness={1} />
          </mesh>
          <mesh geometry={borde}>
            <meshStandardMaterial color={COLOR_MADERA} roughness={0.55} />
          </mesh>
          <mesh geometry={cuerpo}>
            <meshStandardMaterial color="#24160e" roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* Lámpara */}
      <group position={[0, 1.6, 0]}>
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 1.5, 6]} />
          <meshBasicMaterial color="#0f0c0a" />
        </mesh>
        <mesh>
          <coneGeometry args={[0.26, 0.2, 32, 1, true]} />
          <meshStandardMaterial color="#1f1a15" side={THREE.DoubleSide} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.07, 0]}>
          <sphereGeometry args={[0.045, 16, 12]} />
          <meshBasicMaterial color={LUZ} />
        </mesh>
      </group>
      <spotLight
        position={[0, 1.5, 0.05]}
        angle={0.75}
        penumbra={0.6}
        intensity={12}
        distance={0}
        decay={2}
        color={LUZ}
      />
      <pointLight position={[0, 1.45, 0]} intensity={0.6} distance={3} color={LUZ} />
    </group>
  )
}
