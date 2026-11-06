import { useEffect, useRef } from 'react'
import { useIdioma } from '../../../lib/idioma'
import { despertarAudio, pulso } from '../../../lib/sonido'

// El fondo de Kinet en pequeño, con su paleta: líneas que se apartan del
// puntero y ondas que salen de cada clic, con un golpe de bombo.
const W = 640
const H = 300
const FILAS = 22

export default function Lineas() {
  const { t } = useIdioma()
  const lienzo = useRef(null)
  const estado = useRef({ px: -999, py: -999, ondas: [] })

  useEffect(() => {
    const c = lienzo.current
    const ctx = c.getContext('2d')
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = W * dpr
    c.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    let raf = 0
    const dibujar = (ms) => {
      raf = requestAnimationFrame(dibujar)
      const s = estado.current
      const tt = ms / 1000
      s.ondas = s.ondas.filter((o) => tt - o.t < 1.6)
      ctx.fillStyle = '#180F2A'
      ctx.fillRect(0, 0, W, H)
      for (let f = 0; f < FILAS; f++) {
        const y0 = 14 + (f * (H - 28)) / (FILAS - 1)
        ctx.beginPath()
        let energia = 0
        for (let x = 0; x <= W; x += 8) {
          let dy = Math.sin(x * 0.012 + tt * 1.2 + f * 0.4) * 2
          const dx = x - s.px
          const dyP = y0 - s.py
          const d2 = dx * dx + dyP * dyP
          const empuje = Math.exp(-d2 / 3200) * 26
          dy += (dyP >= 0 ? 1 : -1) * empuje
          for (const o of s.ondas) {
            const edad = tt - o.t
            const r = edad * 420
            const d = Math.hypot(x - o.x, y0 - o.y)
            const banda = Math.exp(-((d - r) ** 2) / 900) * (1 - edad / 1.6)
            dy += Math.sin(d * 0.08) * 16 * banda
            energia += banda
          }
          energia += empuje / 26
          if (x === 0) ctx.moveTo(x, y0 + dy)
          else ctx.lineTo(x, y0 + dy)
        }
        const a = Math.min(1, 0.28 + energia * 0.02)
        ctx.strokeStyle = `rgba(198,255,52,${a})`
        ctx.lineWidth = 1.4
        ctx.stroke()
      }
    }
    raf = requestAnimationFrame(dibujar)
    return () => cancelAnimationFrame(raf)
  }, [])

  const posicion = (e) => {
    const r = lienzo.current.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H]
  }

  const onda = (x, y) => {
    despertarAudio()
    estado.current.ondas.push({ x, y, t: performance.now() / 1000 })
    pulso()
  }

  return (
    <div className="widget">
      <canvas
        ref={lienzo}
        width={W}
        height={H}
        aria-hidden="true"
        style={{ touchAction: 'pan-y' }}
        onPointerMove={(e) => {
          const [x, y] = posicion(e)
          estado.current.px = x
          estado.current.py = y
        }}
        onPointerLeave={() => {
          estado.current.px = -999
          estado.current.py = -999
        }}
        onPointerDown={(e) => onda(...posicion(e))}
      />
      <div className="widget__barra">
        <button type="button" className="widget__tecla" onClick={() => onda(W / 2, H / 2)}>
          {t({ es: 'Pulso', en: 'Pulse' })}
        </button>
      </div>
    </div>
  )
}
