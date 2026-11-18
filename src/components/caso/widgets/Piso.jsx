import { useEffect, useRef, useState } from 'react'
import { useIdioma } from '../../../lib/idioma'
import { despertarAudio, sonar } from '../../../lib/sonido'
import { useMovimientoReducido } from '../../../lib/useMovimientoReducido'
import { ANCLAS, DECORACIONES, HABITACIONES, decorar, pisoInicial, siguienteNoche } from '../logica/pisoHotel'
import './piso.css'

// Hotel Insomnio: cada noche las habitaciones cambian de ancla y se llevan su decoración.
const ANCHO = 90
const ALTO = 70
const nombreDeco = (id) => DECORACIONES.find((d) => d.id === id)

function Deco({ id }) {
  switch (id) {
    case 'vela':
      return (
        <g>
          <rect x="-9" y="14" width="18" height="3" fill="#b08d57" />
          <rect x="-3" y="-3" width="6" height="17" fill="#efe7d6" />
          <ellipse cx="0" cy="-9" rx="3" ry="5" fill="#f2b45a" />
        </g>
      )
    case 'retrato':
      return (
        <g>
          <rect x="-13" y="-18" width="26" height="34" fill="#2a2420" stroke="#b08d57" strokeWidth="3" />
          <ellipse cx="0" cy="-5" rx="5" ry="6" fill="#c9bea9" />
          <path d="M-9 13 Q0 1 9 13 Z" fill="#c9bea9" />
        </g>
      )
    case 'planta':
      return (
        <g>
          <ellipse cx="-6" cy="-4" rx="5" ry="11" fill="#5f7a4e" transform="rotate(-25 -6 -4)" />
          <ellipse cx="6" cy="-4" rx="5" ry="11" fill="#6f8a5c" transform="rotate(25 6 -4)" />
          <ellipse cx="0" cy="-8" rx="4" ry="12" fill="#56704a" />
          <path d="M-9 6 L9 6 L6 20 L-6 20 Z" fill="#8a5a3c" />
        </g>
      )
    case 'radio':
      return (
        <g>
          <line x1="8" y1="-8" x2="16" y2="-20" stroke="#c9bea9" strokeWidth="1.5" />
          <rect x="-17" y="-8" width="34" height="22" rx="3" fill="#3a2e26" stroke="#b08d57" strokeWidth="1.5" />
          <circle cx="-6" cy="3" r="6" fill="none" stroke="#efe7d6" strokeWidth="1.5" />
          <path d="M5 -2 h8 M5 3 h8 M5 8 h8" stroke="#c9bea9" strokeWidth="1.5" />
        </g>
      )
    case 'alfombra':
      return (
        <g>
          <path d="M-24 -10 v26 M24 -10 v26" stroke="#c9a36a" strokeWidth="4" strokeDasharray="1.5 2" />
          <rect x="-22" y="-10" width="44" height="26" rx="2" fill="#6b2a24" />
          <rect x="-16" y="-5" width="32" height="16" fill="none" stroke="#c9a36a" strokeWidth="1.2" />
        </g>
      )
    default:
      return null
  }
}

// Lado3D: el piso en 3D (la versión de la mesa); sin él, solo la planta.
export default function Piso({ Lado3D }) {
  const { t, idioma } = useIdioma()
  const reducido = useMovimientoReducido()
  const [piso, setPiso] = useState(pisoInicial)
  const [visible, setVisible] = useState(piso.orden)
  const [fundiendo, setFundiendo] = useState(false)
  const [aviso, setAviso] = useState('')
  const fundido = useRef(0)

  useEffect(() => () => clearTimeout(fundido.current), [])

  // Con movimiento reducido las habitaciones no se deslizan: se apagan y se encienden en su ancla nueva.
  const orden = reducido ? visible : piso.orden

  const noche = () => {
    despertarAudio()
    sonar('escupir', { volumen: 0.35 })
    const nuevo = siguienteNoche(piso.orden)
    const n = piso.noche + 1
    setPiso({ ...piso, noche: n, orden: nuevo })
    setAviso(
      t({
        es: `Noche ${n}: las habitaciones cambiaron de sitio y cada una conserva su decoración.`,
        en: `Night ${n}: the rooms have moved and each one keeps its decoration.`,
      }),
    )
    if (reducido) {
      clearTimeout(fundido.current)
      setFundiendo(true)
      fundido.current = setTimeout(() => {
        setVisible(nuevo)
        setFundiendo(false)
      }, 180)
    } else {
      setVisible(nuevo)
    }
  }

  const tocar = (id) => {
    despertarAudio()
    sonar('recoger', { volumen: 0.4 })
    const deco = decorar(piso.deco, id)
    setPiso({ ...piso, deco })
    setAviso(`${id}: ${nombreDeco(deco[id])[idioma]}`)
  }

  const tecla = (e) => {
    if (e.code !== 'KeyN' || e.ctrlKey || e.metaKey || e.altKey) return
    e.preventDefault()
    if (!e.repeat) noche()
  }

  return (
    <div className="widget" onKeyDown={tecla}>
      {Lado3D && (
        <div className="widget3d__lienzo piso__lienzo">
          <Lado3D orden={orden} deco={piso.deco} reducido={reducido} onTocar={tocar} />
        </div>
      )}
      <svg viewBox="0 0 480 240" style={Lado3D ? { maxHeight: 200 } : undefined}>
        <g aria-hidden="true">
          {/* Pasillo con su alfombra, ascensor y escalera: no se mueven nunca */}
          <rect x="60" y="100" width="360" height="40" fill="#2b2620" />
          <rect x="60" y="114" width="360" height="12" fill="#4a2a26" />
          <rect x="10" y="94" width="50" height="52" rx="3" fill="#3a332b" stroke="rgba(239,231,214,0.35)" />
          <line x1="35" y1="100" x2="35" y2="140" stroke="rgba(239,231,214,0.35)" />
          <text x="35" y="160" textAnchor="middle" fontSize="11" fill="#c9bea9" fontFamily="Instrument Sans, sans-serif">
            {t({ es: 'Ascensor', en: 'Lift' })}
          </text>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={420 + i * 12} y={94 + i * 13} width={50 - i * 12} height="13" fill="#3a332b" stroke="rgba(239,231,214,0.25)" />
          ))}
          <text x="445" y="160" textAnchor="middle" fontSize="11" fill="#c9bea9" fontFamily="Instrument Sans, sans-serif">
            {t({ es: 'Escalera', en: 'Stairs' })}
          </text>
          {/* Las anclas: huecos fijos con su puerta al pasillo */}
          {ANCLAS.map((a, i) => (
            <g key={i}>
              <rect
                x={a.x - ANCHO / 2 - 3}
                y={a.y - ALTO / 2 - 3}
                width={ANCHO + 6}
                height={ALTO + 6}
                rx="6"
                fill="none"
                stroke="rgba(239,231,214,0.22)"
                strokeDasharray="4 4"
              />
              <rect x={a.x - 12} y={a.y < 120 ? 95 : 140} width="24" height="5" fill="#8a7a62" />
            </g>
          ))}
        </g>
        {HABITACIONES.map((h) => {
          const a = ANCLAS[orden.indexOf(h.id)]
          const deco = piso.deco[h.id]
          const etiqueta = `${h.id}: ${nombreDeco(deco)[idioma]}`
          return (
            <g
              key={h.id}
              className="piso__hab"
              role="button"
              tabIndex={0}
              aria-label={etiqueta}
              onClick={() => tocar(h.id)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return
                e.preventDefault()
                tocar(h.id)
              }}
              style={{
                transform: `translate(${a.x}px, ${a.y}px)`,
                transition: reducido ? 'opacity 0.18s' : 'transform 0.6s cubic-bezier(.3,1.3,.5,1)',
                opacity: reducido && fundiendo ? 0 : 1,
              }}
            >
              <rect className="piso__anillo" x={-ANCHO / 2 - 4} y={-ALTO / 2 - 4} width={ANCHO + 8} height={ALTO + 8} rx="8" fill="none" stroke="#efe7d6" strokeWidth="2" />
              <rect x={-ANCHO / 2} y={-ALTO / 2} width={ANCHO} height={ALTO} rx="4" fill={h.pared} stroke="rgba(239,231,214,0.3)" />
              <text x={-ANCHO / 2 + 6} y={-ALTO / 2 + 14} fontSize="11" fill="#efe7d6" fontFamily="Instrument Sans, sans-serif" aria-hidden="true">
                {h.id}
              </text>
              <g key={deco} className="piso__deco" transform="translate(0 4)">
                <Deco id={deco} />
              </g>
            </g>
          )
        })}
      </svg>
      <div className="widget__barra">
        <span className="piso__ayuda">{t({ es: 'Toca una habitación para decorarla.', en: 'Tap a room to decorate it.' })}</span>
        <span className="piso__noche">{t({ es: `Noche ${piso.noche}`, en: `Night ${piso.noche}` })}</span>
        <button type="button" className="widget__tecla" onClick={noche}>
          {t({ es: 'Siguiente noche', en: 'Next night' })}
          <kbd aria-hidden="true">N</kbd>
        </button>
        <span className="solo-lector" aria-live="polite">
          {aviso}
        </span>
      </div>
    </div>
  )
}
