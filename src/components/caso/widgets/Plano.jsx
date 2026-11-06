import { useEffect, useRef, useState } from 'react'
import { useIdioma } from '../../../lib/idioma'

// The Others: el escenario es 3D pero el jugador vive en un plano.
// Girar la cámara separa las tres capas; de frente parecen un solo dibujo.
const CAPAS = [
  { z: -70, color: '#3a4250', alfa: 0.9, es: 'Fondo', en: 'Background', piezas: [[-150, -40, 60, 120], [-40, -70, 40, 150], [70, -20, 70, 100]] },
  { z: 0, color: '#efe7d6', alfa: 1, es: 'Juego', en: 'Gameplay', piezas: [[-170, 60, 340, 16], [-90, 10, 70, 12], [40, -20, 80, 12]] },
  { z: 70, color: '#6b2a24', alfa: 0.75, es: 'Frente', en: 'Foreground', piezas: [[-185, 30, 26, 60], [140, -60, 22, 140]] },
]

function proyectar(x, y, z, yaw) {
  const c = Math.cos(yaw)
  const s = Math.sin(yaw)
  return [x * c + z * s, y - z * s * 0.35, -x * s + z * c]
}

export default function Plano() {
  const { t, idioma } = useIdioma()
  const [giro, setGiro] = useState(0)
  const [pj, setPj] = useState({ x: -100, y: 0 })
  const arrastre = useRef(null)
  const salto = useRef(0)
  const yaw = (giro * Math.PI) / 180

  useEffect(() => () => clearTimeout(salto.current), [])

  const mover = (dx) => setPj((p) => ({ ...p, x: Math.max(-160, Math.min(160, p.x + dx)) }))
  const saltar = () => {
    if (pj.y !== 0) return
    setPj((p) => ({ ...p, y: -50 }))
    salto.current = setTimeout(() => setPj((p) => ({ ...p, y: 0 })), 380)
  }

  const tecla = (e) => {
    if (e.key === 'ArrowLeft') mover(-20)
    else if (e.key === 'ArrowRight') mover(20)
    else if (e.key === 'ArrowUp') saltar()
    else return
    e.preventDefault()
  }

  const poligonos = CAPAS.flatMap((capa) =>
    capa.piezas.map(([x, y, w, h], i) => {
      const pts = [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
      ].map(([a, b]) => proyectar(a, b, capa.z, yaw))
      const prof = pts.reduce((s, p) => s + p[2], 0) / 4
      return { clave: capa.z + '-' + i, pts, prof, capa }
    }),
  ).sort((a, b) => a.prof - b.prof)

  const [px, py] = proyectar(pj.x, 44 + pj.y, 0, yaw)
  const etiquetas = giro > 18

  return (
    <div className="widget" onKeyDown={tecla}>
      <svg
        viewBox="-220 -130 440 260"
        role="img"
        aria-label={t({ es: 'Las tres capas de un nivel, vistas desde la cámara del juego', en: 'The three layers of a level, seen from the game camera' })}
        style={{ touchAction: 'pan-y', cursor: 'ew-resize' }}
        onPointerDown={(e) => {
          arrastre.current = { x: e.clientX, g: giro }
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!arrastre.current) return
          const d = (e.clientX - arrastre.current.x) * 0.4
          setGiro(Math.max(0, Math.min(65, arrastre.current.g + d)))
        }}
        onPointerUp={() => (arrastre.current = null)}
      >
        <rect x="-220" y="-130" width="440" height="260" fill="#16171c" />
        {poligonos.map(({ clave, pts, capa }) => (
          <polygon
            key={clave}
            points={pts.map((p) => `${p[0]},${p[1]}`).join(' ')}
            fill={capa.color}
            fillOpacity={capa.alfa}
            stroke="rgba(0,0,0,0.35)"
          />
        ))}
        <g transform={`translate(${px} ${py})`} style={{ transition: 'transform 0.18s ease-out' }}>
          <rect x="-7" y="-26" width="14" height="26" rx="7" fill="#e0645a" />
        </g>
        {CAPAS.map((capa) => {
          const [lx, ly] = proyectar(-200, -88, capa.z, yaw)
          return (
            <text
              key={capa.z}
              x={lx}
              y={ly}
              fontSize="13"
              fill="#efe7d6"
              opacity={etiquetas ? 0.85 : 0}
              style={{ transition: 'opacity 0.3s' }}
              fontFamily="Instrument Sans, sans-serif"
            >
              {capa[idioma]}
            </text>
          )
        })}
      </svg>
      <div className="widget__barra" style={{ alignItems: 'center' }}>
        <label htmlFor="plano-camara" style={{ fontSize: '0.9rem', color: '#c9bea9' }}>
          {t({ es: 'Cámara', en: 'Camera' })}
        </label>
        <input
          id="plano-camara"
          className="widget__deslizador"
          style={{ flex: 1, width: 'auto' }}
          type="range"
          min="0"
          max="65"
          value={giro}
          onChange={(e) => setGiro(Number(e.target.value))}
        />
        <button type="button" className="widget__tecla" onClick={() => mover(-20)} aria-label={t({ es: 'Izquierda', en: 'Left' })}>
          ←
        </button>
        <button type="button" className="widget__tecla" onClick={saltar} aria-label={t({ es: 'Saltar', en: 'Jump' })}>
          ↑
        </button>
        <button type="button" className="widget__tecla" onClick={() => mover(20)} aria-label={t({ es: 'Derecha', en: 'Right' })}>
          →
        </button>
      </div>
    </div>
  )
}
