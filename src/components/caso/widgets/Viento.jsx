import { useRef, useState } from 'react'
import { useIdioma } from '../../../lib/idioma'

// La vela de Sargazo: empuja según el ángulo con el viento y tiene una zona
// muerta de frente. El barco apunta siempre arriba; lo que se gira es el viento.
const ZONA_MUERTA = 40

function empuje(rel) {
  const a = Math.abs(rel)
  if (a < ZONA_MUERTA) return 0
  if (a < 90) return (a - ZONA_MUERTA) / (90 - ZONA_MUERTA)
  if (a <= 135) return 1
  return 1 - ((a - 135) / 45) * 0.35
}

const norm = (g) => ((((g + 180) % 360) + 360) % 360) - 180

export default function Viento() {
  const { t } = useIdioma()
  const svg = useRef(null)
  const [viento, setViento] = useState(100) // de dónde sopla, en grados desde la proa
  const rel = norm(viento)
  const f = empuje(rel)
  const enZona = Math.abs(rel) < ZONA_MUERTA
  // La botavara se abre hacia el lado contrario al viento, la mitad del ángulo.
  const lado = rel >= 0 ? -1 : 1
  const apertura = enZona ? 0 : Math.max(8, Math.min(80, Math.abs(rel) / 2))
  const botavara = 180 + lado * apertura

  const desdePuntero = (e) => {
    const r = svg.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 400 - 200
    const y = ((e.clientY - r.top) / r.height) * 300 - 150
    setViento(Math.round((Math.atan2(x, -y) * 180) / Math.PI))
  }

  const tecla = (e) => {
    const paso = e.shiftKey ? 15 : 5
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setViento((v) => norm(v - paso))
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setViento((v) => norm(v + paso))
    else return
    e.preventDefault()
  }

  const rad = (rel * Math.PI) / 180
  const hx = Math.sin(rad) * 118
  const hy = -Math.cos(rad) * 118
  const velAgua = f > 0 ? `${(1.6 - f * 1.2).toFixed(2)}s` : '0s'

  return (
    <div className="widget">
      <svg
        ref={svg}
        viewBox="-200 -150 400 300"
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          desdePuntero(e)
        }}
        onPointerMove={(e) => e.buttons && desdePuntero(e)}
      >
        <defs>
          <pattern id="agua" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 20 q10 -6 20 0 t20 0" fill="none" stroke="#2e4a5c" strokeWidth="2" />
          </pattern>
        </defs>
        <rect x="-200" y="-150" width="400" height="300" fill="#132430" />
        <rect
          x="-200"
          y="-190"
          width="400"
          height="380"
          fill="url(#agua)"
          style={{ animation: f > 0 ? `agua-corre ${velAgua} linear infinite` : 'none' }}
        />
        {/* Zona muerta: solo se ve de verdad cuando el viento cae dentro */}
        <path
          d={`M0 0 L${Math.sin((-ZONA_MUERTA * Math.PI) / 180) * 130} ${-Math.cos((ZONA_MUERTA * Math.PI) / 180) * 130} A130 130 0 0 1 ${Math.sin((ZONA_MUERTA * Math.PI) / 180) * 130} ${-Math.cos((ZONA_MUERTA * Math.PI) / 180) * 130} Z`}
          fill={enZona ? 'rgba(224,100,90,0.32)' : 'rgba(239,231,214,0.04)'}
          style={{ transition: 'fill 0.25s' }}
        />
        <circle r="118" fill="none" stroke="rgba(239,231,214,0.18)" strokeDasharray="3 6" />
        {/* Estela: más larga cuanto más empuja la vela */}
        <path d={`M-8 46 L0 ${46 + f * 90} L8 46`} fill="rgba(239,231,214,0.25)" style={{ transition: 'd 0.3s' }} />
        {/* Casco */}
        <path d="M0 -58 C22 -30 22 30 14 50 L-14 50 C-22 30 -22 -30 0 -58 Z" fill="#7a5233" stroke="#3b2614" strokeWidth="2" />
        <circle cy="-8" r="4" fill="#3b2614" />
        {/* Vela y botavara */}
        <g transform={`translate(0 -8) rotate(${botavara})`} style={{ transition: 'transform 0.35s cubic-bezier(.3,1.4,.5,1)' }}>
          <line x1="0" y1="0" x2="0" y2="58" stroke="#3b2614" strokeWidth="3" />
          <path
            d={enZona ? 'M0 0 q6 15 0 29 q-6 15 0 29' : `M0 0 Q${lado * -18 * f - 4 * lado} 29 0 58`}
            fill="none"
            stroke="#efe7d6"
            strokeWidth="5"
            strokeLinecap="round"
            className={enZona ? 'vela-flamea' : ''}
          />
        </g>
        {/* Viento: flecha que se arrastra por el anillo */}
        <g>
          <line x1={hx} y1={hy} x2={hx * 0.62} y2={hy * 0.62} stroke="#efe7d6" strokeWidth="3" />
          <circle
            cx={hx}
            cy={hy}
            r="15"
            fill="#efe7d6"
            role="slider"
            tabIndex={0}
            aria-label={t({ es: 'Dirección del viento', en: 'Wind direction' })}
            aria-valuemin={-180}
            aria-valuemax={180}
            aria-valuenow={rel}
            aria-valuetext={`${rel}°`}
            onKeyDown={tecla}
            style={{ cursor: 'grab' }}
          />
          <path d={`M${hx * 0.62} ${hy * 0.62} l${Math.cos(rad) * 7 - Math.sin(rad) * 10} ${Math.sin(rad) * 7 + Math.cos(rad) * 10} M${hx * 0.62} ${hy * 0.62} l${-Math.cos(rad) * 7 - Math.sin(rad) * 10} ${-Math.sin(rad) * 7 + Math.cos(rad) * 10}`} stroke="#efe7d6" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
      <div className="widget__barra" style={{ alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: '0.9rem', color: '#c9bea9' }}>{t({ es: 'Empuje', en: 'Drive' })}</span>
        <span style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(239,231,214,0.12)', overflow: 'hidden' }} aria-hidden="true">
          <span style={{ display: 'block', height: '100%', width: `${f * 100}%`, background: enZona ? 'var(--rojo-claro)' : 'var(--marfil)', transition: 'width 0.3s' }} />
        </span>
      </div>
      <style>{`
        @keyframes agua-corre { from { transform: translateY(0) } to { transform: translateY(40px) } }
        .vela-flamea { animation: flamea 0.18s steps(2) infinite; }
        @keyframes flamea { 50% { transform: translateX(3px) } }
      `}</style>
    </div>
  )
}
