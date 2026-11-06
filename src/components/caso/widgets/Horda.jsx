/* eslint-disable react-hooks/immutability -- bucle de juego: el mundo se muta cada fotograma a propósito */
import { useEffect, useRef, useState } from 'react'
import { useIdioma } from '../../../lib/idioma'
import { despertarAudio, sonar } from '../../../lib/sonido'

// Baluarte en miniatura: la niebla suelta enemigos hacia el Núcleo y la noche
// los multiplica. Se les pega con clic, como en el juego todo se resuelve a golpes.
const W = 640
const H = 320

const mezcla = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))
const DIA = [214, 160, 82]
const NOCHE = [18, 20, 34]

export default function Horda() {
  const { t } = useIdioma()
  const lienzo = useRef(null)
  const [hora, setHora] = useState(20)
  const horaRef = useRef(hora)
  const [derribados, setDerribados] = useState(0)
  const mundo = useRef({ enemigos: [], chispas: [], acumulado: 0, kick: 0, brillo: 0 })

  useEffect(() => {
    horaRef.current = hora
  }, [hora])

  useEffect(() => {
    const c = lienzo.current
    const ctx = c.getContext('2d')
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = W * dpr
    c.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    let raf = 0
    let antes = performance.now()
    const cx = W / 2
    const cy = H / 2 + 10

    const bucle = (ahora) => {
      raf = requestAnimationFrame(bucle)
      const dt = Math.min(0.033, (ahora - antes) / 1000)
      antes = ahora
      const m = mundo.current
      const h = horaRef.current / 100
      // La noche multiplica la horda.
      const ritmo = 0.5 + 5 * h * h
      m.acumulado += ritmo * dt
      while (m.acumulado > 1 && m.enemigos.length < 70) {
        m.acumulado -= 1
        const a = Math.random() * Math.PI * 2
        const r = Math.max(W, H) * 0.62
        m.enemigos.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.6, v: 26 + Math.random() * 18 + h * 26, fase: Math.random() * 6 })
      }
      for (const e of m.enemigos) {
        const dx = cx - e.x
        const dy = cy - e.y
        const d = Math.hypot(dx, dy) || 1
        e.x += (dx / d) * e.v * dt
        e.y += (dy / d) * e.v * dt
        e.fase += dt * 8
        if (d < 24) {
          e.muerto = true
          m.brillo = 1
        }
      }
      m.enemigos = m.enemigos.filter((e) => !e.muerto)
      m.chispas = m.chispas.filter((p) => (p.vida -= dt) > 0)
      for (const p of m.chispas) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vy += 500 * dt
      }
      m.kick *= Math.exp(-14 * dt)
      m.brillo *= Math.exp(-4 * dt)

      const [r, g, b] = mezcla(DIA, NOCHE, h)
      ctx.save()
      ctx.translate((Math.random() - 0.5) * m.kick, (Math.random() - 0.5) * m.kick)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(-20, -20, W + 40, H + 40)
      // Suelo de la arena
      ctx.fillStyle = `rgba(0,0,0,${0.12 + h * 0.2})`
      ctx.beginPath()
      ctx.ellipse(cx, cy + 6, 250, 120, 0, 0, Math.PI * 2)
      ctx.fill()
      // Núcleo de Luz
      const pulso = 1 + Math.sin(ahora / 300) * 0.06
      const halo = ctx.createRadialGradient(cx, cy - 6, 2, cx, cy - 6, 70 * pulso)
      halo.addColorStop(0, `rgba(255,236,170,${0.9 - m.brillo * 0.5})`)
      halo.addColorStop(1, 'rgba(255,236,170,0)')
      ctx.fillStyle = halo
      ctx.fillRect(cx - 80, cy - 90, 160, 160)
      ctx.fillStyle = m.brillo > 0.3 ? '#ff7a6b' : '#fff3c9'
      ctx.beginPath()
      ctx.arc(cx, cy - 6, 9, 0, Math.PI * 2)
      ctx.fill()
      // Enemigos: bultos oscuros que se balancean.
      for (const e of m.enemigos) {
        const bal = Math.sin(e.fase) * 1.5
        ctx.fillStyle = h > 0.5 ? '#05060b' : '#3b2614'
        ctx.beginPath()
        ctx.ellipse(e.x, e.y - 8 + bal, 6, 9, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = h > 0.5 ? '#c43d33' : '#f2e5c6'
        ctx.fillRect(e.x - 3, e.y - 12 + bal, 2, 2)
        ctx.fillRect(e.x + 1, e.y - 12 + bal, 2, 2)
      }
      for (const p of m.chispas) {
        ctx.globalAlpha = Math.min(1, p.vida * 3)
        ctx.fillStyle = p.c
        ctx.fillRect(p.x, p.y, 3, 3)
      }
      ctx.globalAlpha = 1
      // Niebla en los bordes: espesa de noche.
      const niebla = ctx.createRadialGradient(cx, cy, 120, cx, cy, 380)
      niebla.addColorStop(0, `rgba(${r},${g},${b},0)`)
      niebla.addColorStop(1, `rgba(${Math.min(255, r + 30)},${Math.min(255, g + 30)},${Math.min(255, b + 34)},${0.85})`)
      ctx.fillStyle = niebla
      ctx.fillRect(-20, -20, W + 40, H + 40)
      ctx.restore()
    }
    raf = requestAnimationFrame(bucle)
    return () => cancelAnimationFrame(raf)
  }, [])

  const golpearEn = (x, y) => {
    const m = mundo.current
    let mejor = null
    let dMin = 34
    for (const e of m.enemigos) {
      const d = Math.hypot(e.x - x, e.y - 8 - y)
      if (d < dMin) {
        dMin = d
        mejor = e
      }
    }
    m.kick = 5
    if (!mejor) {
      sonar('aterrizar', { volumen: 0.3 })
      return
    }
    mejor.muerto = true
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * Math.PI * 2
      const v = 80 + Math.random() * 180
      m.chispas.push({ x: mejor.x, y: mejor.y - 8, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, vida: 0.5 + Math.random() * 0.4, c: i % 2 ? '#fff3c9' : '#c43d33' })
    }
    m.kick = 9
    sonar('golpe', { volumen: 0.6, tono: 1.3 })
    setDerribados((n) => n + 1)
  }

  const alClic = (e) => {
    despertarAudio()
    const r = lienzo.current.getBoundingClientRect()
    golpearEn(((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H)
  }

  const golpeCercano = () => {
    despertarAudio()
    const m = mundo.current
    const cx = W / 2
    const cy = H / 2 + 10
    let mejor = null
    let dMin = Infinity
    for (const e of m.enemigos) {
      const d = Math.hypot(e.x - cx, e.y - cy)
      if (d < dMin) {
        dMin = d
        mejor = e
      }
    }
    if (mejor) golpearEn(mejor.x, mejor.y - 8)
  }

  return (
    <div className="widget">
      <canvas ref={lienzo} width={W} height={H} onPointerDown={alClic} style={{ cursor: 'crosshair', touchAction: 'manipulation' }} aria-hidden="true" />
      <div className="widget__barra" style={{ alignItems: 'center' }}>
        <span aria-hidden="true">☀</span>
        <input
          className="widget__deslizador"
          style={{ flex: 1, width: 'auto' }}
          type="range"
          min="0"
          max="100"
          value={hora}
          onChange={(e) => setHora(Number(e.target.value))}
          aria-label={t({ es: 'Del día a la noche', en: 'From day to night' })}
        />
        <span aria-hidden="true">☾</span>
        <button type="button" className="widget__tecla" onClick={golpeCercano}>
          {t({ es: 'Golpe', en: 'Strike' })}
        </button>
        <span aria-live="polite" style={{ minWidth: '2.5em', textAlign: 'right', fontFamily: 'var(--f-titulo)', fontSize: '1.3rem' }}>
          {derribados}
        </span>
      </div>
    </div>
  )
}
