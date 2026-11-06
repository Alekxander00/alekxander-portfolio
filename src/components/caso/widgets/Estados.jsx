import { useCallback, useEffect, useRef, useState } from 'react'
import { useIdioma } from '../../../lib/idioma'
import { despertarAudio, sonar } from '../../../lib/sonido'
import { SOLO, transicion } from '../logica/estadosMuseo'

// La máquina de estados del movimiento del Museo, en pequeño.
// Cada acción solo vale desde ciertos estados; las demás rebotan.
const NODOS = {
  suelo: { x: 70, y: 150, es: 'Suelo', en: 'Ground' },
  aire: { x: 230, y: 70, es: 'Aire', en: 'Air' },
  dash: { x: 230, y: 230, es: 'Dash', en: 'Dash' },
  pared: { x: 400, y: 50, es: 'Pared', en: 'Wall' },
  planeo: { x: 400, y: 190, es: 'Planeo', en: 'Glide' },
}

const ACCIONES = [
  { id: 'saltar', tecla: 'Space', etiqueta: { es: 'Saltar', en: 'Jump' }, kbd: '␣' },
  { id: 'dash', tecla: 'Shift', etiqueta: { es: 'Dash', en: 'Dash' }, kbd: '⇧' },
  { id: 'pared', tecla: 'KeyW', etiqueta: { es: 'Pared', en: 'Wall' }, kbd: 'W' },
  { id: 'planear', tecla: 'KeyG', etiqueta: { es: 'Planear', en: 'Glide' }, kbd: 'G' },
]

const ARISTAS = [
  ['suelo', 'aire'], ['suelo', 'dash'], ['aire', 'dash'], ['aire', 'pared'], ['aire', 'planeo'],
  ['pared', 'aire'], ['planeo', 'aire'], ['planeo', 'dash'], ['aire', 'suelo'], ['planeo', 'suelo'], ['dash', 'suelo'], ['dash', 'aire'],
]

export default function Estados() {
  const { t, idioma } = useIdioma()
  const [estado, setEstado] = useState('suelo')
  const [vengoDe, setVengoDe] = useState('suelo')
  const [ultima, setUltima] = useState(null)
  const [rechazo, setRechazo] = useState(null)
  const previo = useRef('suelo')

  useEffect(() => {
    const regla = SOLO[estado]
    if (!regla) return
    const destino = regla[0] ?? previo.current
    const id = setTimeout(() => {
      setUltima([estado, destino])
      setVengoDe(estado)
      setEstado(destino)
      if (destino === 'suelo') sonar('aterrizar', { volumen: 0.4 })
    }, regla[1])
    return () => clearTimeout(id)
  }, [estado])

  const actuar = useCallback(
    (accion) => {
      despertarAudio()
      const destino = transicion(estado, accion)
      if (!destino) {
        setRechazo(accion + Date.now())
        return
      }
      if (destino === 'dash') previo.current = estado === 'suelo' ? 'suelo' : 'aire'
      setUltima([estado, destino])
      setVengoDe(estado)
      setEstado(destino)
      sonar(accion === 'dash' ? 'escupir' : 'recoger', { volumen: 0.4, tono: accion === 'saltar' ? 1.3 : 1 })
    },
    [estado],
  )

  const tecla = (e) => {
    // Espacio o Enter sobre un botón ya lo pulsa el navegador.
    if (e.target.tagName === 'BUTTON' && (e.code === 'Space' || e.code === 'Enter')) return
    const a = ACCIONES.find((x) => x.tecla === e.code || (x.tecla === 'Shift' && e.key === 'Shift'))
    if (!a || e.repeat) return
    e.preventDefault()
    actuar(a.id)
  }

  // Pose de la cápsula según el estado.
  const pose = {
    suelo: { y: 0, x: 0, r: 0, sx: 1, sy: 1 },
    aire: { y: -46, x: 0, r: 0, sx: 0.92, sy: 1.08 },
    dash: { y: vengoDe === 'suelo' ? 0 : -40, x: 26, r: 0, sx: 1.35, sy: 0.75 },
    pared: { y: -56, x: 48, r: 0, sx: 0.9, sy: 1 },
    planeo: { y: -36, x: 10, r: 8, sx: 1.1, sy: 0.9 },
  }[estado]

  return (
    <div className="widget" onKeyDown={tecla}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1.2fr)' }}>
        <svg viewBox="0 0 480 290" aria-hidden="true">
          <defs>
            <marker id="punta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="rgba(239,231,214,0.5)" />
            </marker>
          </defs>
          {ARISTAS.map(([a, b]) => {
            const A = NODOS[a]
            const B = NODOS[b]
            const activa = ultima && ultima[0] === a && ultima[1] === b
            const dx = B.x - A.x
            const dy = B.y - A.y
            const d = Math.hypot(dx, dy)
            const off = 6
            const nx = (-dy / d) * off
            const ny = (dx / d) * off
            return (
              <line
                key={a + b}
                x1={A.x + (dx / d) * 40 + nx}
                y1={A.y + (dy / d) * 26 + ny}
                x2={B.x - (dx / d) * 40 + nx}
                y2={B.y - (dy / d) * 26 + ny}
                stroke={activa ? '#efe7d6' : 'rgba(239,231,214,0.22)'}
                strokeWidth={activa ? 2.5 : 1.5}
                markerEnd="url(#punta)"
                style={{ transition: 'stroke 0.3s' }}
              />
            )
          })}
          {Object.entries(NODOS).map(([id, n]) => {
            const on = estado === id
            return (
              <g key={id} transform={`translate(${n.x} ${n.y})`}>
                <rect x="-42" y="-22" width="84" height="44" rx="8" fill={on ? '#efe7d6' : '#26221d'} stroke="rgba(239,231,214,0.35)" style={{ transition: 'fill 0.2s' }} />
                <text textAnchor="middle" dy="6" fontSize="16" fill={on ? '#1c1915' : '#efe7d6'} fontFamily="Instrument Sans, sans-serif">
                  {n[idioma]}
                </text>
              </g>
            )
          })}
        </svg>
        {/* Vista lateral: la cápsula de blocking del Museo */}
        <svg viewBox="0 0 160 290" aria-hidden="true" style={{ borderLeft: '1px solid rgba(239,231,214,0.12)' }}>
          <rect x="0" y="230" width="160" height="60" fill="#2b2620" />
          <rect x="132" y="80" width="28" height="150" fill="#2b2620" />
          <g
            style={{
              transform: `translate(${60 + pose.x}px, ${200 + pose.y}px) rotate(${pose.r}deg) scale(${pose.sx}, ${pose.sy})`,
              transformOrigin: '0 30px',
              transition: 'transform 0.22s cubic-bezier(.3,1.5,.5,1)',
            }}
          >
            <rect x="-14" y="-30" width="28" height="60" rx="14" fill="#d9b48f" />
            <rect x="4" y="-20" width="9" height="7" fill="#3b2614" />
            {estado === 'planeo' && <path d="M-14 -24 L-40 -6 L-14 8" fill="rgba(239,231,214,0.5)" />}
            {estado === 'dash' && <path d="M-20 -14 h-26 M-20 0 h-34 M-20 14 h-22" stroke="#efe7d6" strokeWidth="3" />}
          </g>
        </svg>
      </div>
      <div className="widget__barra">
        {ACCIONES.map((a) => (
          <button
            key={a.id + (rechazo?.startsWith(a.id) ? rechazo : '')}
            type="button"
            data-accion={a.id}
            className={`widget__tecla ${rechazo?.startsWith(a.id) ? 'is-no' : ''}`}
            onClick={() => actuar(a.id)}
          >
            {t(a.etiqueta)}
            <kbd aria-hidden="true">{a.kbd}</kbd>
          </button>
        ))}
        <span className="solo-lector" aria-live="polite">
          {NODOS[estado][idioma]}
        </span>
      </div>
    </div>
  )
}
