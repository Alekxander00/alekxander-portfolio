import { useCallback, useEffect, useRef, useState } from 'react'
import { useIdioma } from '../../lib/idioma'
import { despertarAudio, fichas, sonar } from '../../lib/sonido'
import { useMovimientoReducido } from '../../lib/useMovimientoReducido'
import { perfil } from '../../content/perfil'
import { PRINCIPIOS, T } from '../../content/textos'
import { ReversoNaipe } from '../ui/Naipe'
import './entrada.css'

const ORDEN = ['estirar', 'inercia', 'sacudida', 'hitstop', 'anticipacion']
const COLORES_FICHA = ['#b3302a', '#efe7d6', '#1c1915', '#b3302a', '#2f5d50']

const T_TOQUE = 0.22 // s: menos que esto sin moverse es un clic
const T_CARGA = 0.45 // s: desde aquí empieza a temblar
const T_ESTALLA = 1.3 // s: aquí se congela y estalla
const PAUSA = 0.15 // s: duración del hitstop

function estadoInicial() {
  return {
    x: 0, y: 0, vx: 0, vy: 0, rot: 0, w: 0,
    k: 0, angK: 0, q: 0, angQ: 0,
    giro: 0, vGiro: 0, giroObj: 0,
    anticipar: -1, temblor: 0, sacudida: 0,
    puntero: null, sostener: null, pausaHasta: 0,
    inicio: 0, tocada: false, saltoInicio: -1, ultimoSalto: 0,
    fichas: [], encontrados: new Set(),
  }
}

export default function Entrada({ onRevelar }) {
  const { t } = useIdioma()
  const reducido = useMovimientoReducido()
  const zonaRef = useRef(null)
  const escenaRef = useRef(null)
  const cartaRef = useRef(null)
  const giroRef = useRef(null)
  const lienzoRef = useRef(null)
  // Todo el estado de la física vive en una ref: se toca 60 veces por segundo.
  const estado = useRef(estadoInicial())
  const [encontrados, setEncontrados] = useState([])
  const [aviso, setAviso] = useState(null)
  const [volteada, setVolteada] = useState(false)
  const reveladaRef = useRef(false)
  const avisoTimer = useRef(0)

  const descubrir = useCallback((clave) => {
    const s = estado.current
    if (s.encontrados.has(clave)) return
    s.encontrados.add(clave)
    setEncontrados(ORDEN.filter((c) => s.encontrados.has(c)))
    setAviso(clave)
    clearTimeout(avisoTimer.current)
    avisoTimer.current = setTimeout(() => setAviso(null), 5200)
  }, [])

  const soltarFichas = useCallback((x, y, cantidad, fuerza) => {
    const s = estado.current
    for (let i = 0; i < cantidad; i++) {
      const a = Math.random() * Math.PI * 2
      const v = fuerza * (0.4 + Math.random() * 0.8)
      s.fichas.push({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - fuerza * 0.6,
        r: 7 + Math.random() * 5,
        rot: Math.random() * 6,
        vr: (Math.random() - 0.5) * 18,
        vida: 1.6 + Math.random() * 0.8,
        color: COLORES_FICHA[i % COLORES_FICHA.length],
      })
    }
  }, [])

  const voltear = useCallback(() => {
    const s = estado.current
    s.tocada = true
    if (Math.abs(s.giro - s.giroObj) > 20 || s.anticipar >= 0) return
    descubrir('anticipacion')
    if (reducido) {
      s.giroObj += 180
      s.giro = s.giroObj
    } else {
      s.anticipar = performance.now() / 1000
    }
    setVolteada((v) => !v)
    if (!reveladaRef.current) {
      reveladaRef.current = true
      onRevelar?.()
    }
  }, [descubrir, onRevelar, reducido])

  // Bucle de física y dibujo. Escribe estilos directamente para no re-renderizar.
  useEffect(() => {
    const zona = zonaRef.current
    const lienzo = lienzoRef.current
    const ctx = lienzo.getContext('2d')
    let raf = 0
    let antes = performance.now() / 1000
    estado.current.inicio = antes
    let W = 0
    let H = 0

    const medir = () => {
      const r = zona.getBoundingClientRect()
      W = r.width
      H = r.height
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      lienzo.width = W * dpr
      lienzo.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(zona)

    const golpeBorde = (impacto, nx, ny, px, py) => {
      const s = estado.current
      if (impacto > 1500) {
        s.sacudida = Math.min(18, impacto / 110)
        s.q = 0.3
        s.angQ = Math.atan2(ny, nx)
        soltarFichas(px, py, Math.min(26, Math.round(impacto / 90)), Math.min(900, impacto * 0.35))
        fichas(8)
        sonar('aterrizar', { volumen: 1 })
        descubrir('sacudida')
      } else if (impacto > 220) {
        s.q = Math.min(0.22, impacto / 6000)
        s.angQ = Math.atan2(ny, nx)
        sonar('aterrizar', { volumen: Math.min(0.7, impacto / 1500) })
        if (s.lanzada) descubrir('inercia')
      }
    }

    const paso = () => {
      raf = requestAnimationFrame(paso)
      const s = estado.current
      const ahora = performance.now() / 1000
      const dt = Math.min(0.033, ahora - antes)
      antes = ahora
      const carta = cartaRef.current
      if (!carta) return
      const cw = carta.offsetWidth
      const ch = carta.offsetHeight
      const maxX = Math.max(0, W / 2 - cw / 2 - 12)
      const maxY = Math.max(0, H / 2 - ch / 2 - 12)
      const congelada = ahora < s.pausaHasta

      if (!congelada) {
        // Mantener apretada: carga, hitstop, estallido.
        const sos = s.sostener
        if (sos && !reducido) {
          const tSos = ahora - sos.inicio
          if (sos.fase === 'carga' && tSos > T_CARGA) {
            s.temblor = Math.min(1, (tSos - T_CARGA) / (T_ESTALLA - T_CARGA)) * 6
            if (tSos >= T_ESTALLA) {
              sos.fase = 'pausa'
              s.pausaHasta = ahora + PAUSA
              s.temblor = 0
            }
          } else if (sos.fase === 'pausa') {
            sos.fase = 'hecho'
            s.sacudida = 10
            s.q = 0.28
            s.angQ = Math.PI / 2
            soltarFichas(W / 2 + s.x, H / 2 + s.y, 22, 700)
            fichas(10)
            sonar('aterrizar', { volumen: 1 })
            descubrir('hitstop')
          }
        }

        // Vuelo libre.
        if (!s.puntero?.arrastrando) {
          s.x += s.vx * dt
          s.y += s.vy * dt
          const roce = Math.exp(-2.4 * dt)
          s.vx *= roce
          s.vy *= roce
          if (Math.hypot(s.vx, s.vy) < 8) {
            s.vx = 0
            s.vy = 0
            s.lanzada = false
          }
          if (s.x > maxX) { s.x = maxX; const i = Math.abs(s.vx); s.vx = -s.vx * 0.55; golpeBorde(i, 1, 0, W / 2 + maxX + cw / 2, H / 2 + s.y) }
          if (s.x < -maxX) { s.x = -maxX; const i = Math.abs(s.vx); s.vx = -s.vx * 0.55; golpeBorde(i, 1, 0, W / 2 - maxX - cw / 2, H / 2 + s.y) }
          if (s.y > maxY) { s.y = maxY; const i = Math.abs(s.vy); s.vy = -s.vy * 0.55; golpeBorde(i, 0, 1, W / 2 + s.x, H / 2 + maxY + ch / 2) }
          if (s.y < -maxY) { s.y = -maxY; const i = Math.abs(s.vy); s.vy = -s.vy * 0.55; golpeBorde(i, 0, 1, W / 2 + s.x, H / 2 - maxY - ch / 2) }
          s.rot += s.w * dt
          s.w *= Math.exp(-3 * dt)
          // Quieta, se endereza despacio hasta la inclinación más cercana a 0 (o a 180).
          if (Math.abs(s.w) < 5) {
            const destino = Math.round(s.rot / 180) * 180
            s.rot += (destino - s.rot) * Math.min(1, dt * 1.2)
          }
        } else {
          const objetivo = Math.max(-22, Math.min(22, s.vx * 0.012))
          s.rot += (objetivo - s.rot) * Math.min(1, dt * 10)
        }

        // Squash & stretch según la velocidad.
        const vel = Math.hypot(s.vx, s.vy)
        const kObj = reducido ? 0 : Math.min(0.3, vel / 2600)
        s.k += (kObj - s.k) * Math.min(1, dt * 16)
        if (vel > 30) s.angK = Math.atan2(s.vy, s.vx)
        if (s.puntero?.arrastrando && s.k > 0.13) descubrir('estirar')
        s.q *= Math.exp(-9 * dt)

        // Volteo con muelle (rebota un poco al llegar).
        if (s.anticipar >= 0 && ahora - s.anticipar > 0.12) {
          s.anticipar = -1
          s.giroObj += 180
          sonar('elegida')
        }
        const fuerza = (s.giroObj - s.giro) * 160 - s.vGiro * 15
        s.vGiro += fuerza * dt
        s.giro += s.vGiro * dt

        // Saltito para llamar la atención si nadie la toca.
        if (!s.tocada && !reducido && ahora - s.inicio > 3.5 && ahora - s.ultimoSalto > 4.5) {
          s.saltoInicio = ahora
          s.ultimoSalto = ahora
        }
      }

      s.sacudida *= Math.exp(-8 * dt)

      // Dibujar la carta.
      let saltoY = 0
      let saltoQ = 0
      if (s.saltoInicio >= 0) {
        const p = (ahora - s.saltoInicio) / 0.5
        if (p >= 1) s.saltoInicio = -1
        else {
          saltoY = -Math.sin(p * Math.PI) * 22
          saltoQ = p > 0.85 ? (1 - p) * 0.6 : p < 0.15 ? p * 0.6 : 0
        }
      }
      const tx = (Math.random() - 0.5) * s.temblor
      const ty = (Math.random() - 0.5) * s.temblor
      const ant = s.anticipar >= 0 ? 0.9 : 1
      const pausa = congelada ? 1.07 : 1
      const aK = (s.angK * 180) / Math.PI
      const aQ = (s.angQ * 180) / Math.PI
      const q = s.q + saltoQ
      carta.style.transform =
        `translate(-50%, -50%) translate(${s.x + tx}px, ${s.y + ty + saltoY}px) rotate(${s.rot}deg) ` +
        `rotate(${aK}deg) scale(${1 + s.k}, ${1 - s.k * 0.45}) rotate(${-aK}deg) ` +
        `rotate(${aQ}deg) scale(${1 - q}, ${1 + q * 0.5}) rotate(${-aQ}deg) scale(${ant * pausa})`
      if (giroRef.current) giroRef.current.style.transform = `rotateY(${s.giro}deg)`
      if (escenaRef.current) {
        const a = s.sacudida
        escenaRef.current.style.transform = a > 0.2 ? `translate(${(Math.random() - 0.5) * a}px, ${(Math.random() - 0.5) * a}px)` : ''
      }

      // Fichas.
      ctx.clearRect(0, 0, W, H)
      if (!congelada) {
        s.fichas = s.fichas.filter((f) => (f.vida -= dt) > 0)
      }
      for (const f of s.fichas) {
        if (!congelada) {
          f.vy += 1900 * dt
          f.x += f.vx * dt
          f.y += f.vy * dt
          f.rot += f.vr * dt
          if (f.y > H - f.r) {
            f.y = H - f.r
            f.vy *= -0.4
            f.vx *= 0.7
          }
        }
        ctx.save()
        ctx.globalAlpha = Math.min(1, f.vida * 2)
        ctx.translate(f.x, f.y)
        ctx.scale(1, Math.abs(Math.cos(f.rot)) * 0.7 + 0.3)
        ctx.fillStyle = f.color
        ctx.beginPath()
        ctx.arc(0, 0, f.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = f.color === '#efe7d6' ? '#b3302a' : '#efe7d6'
        ctx.lineWidth = 2
        ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.arc(0, 0, f.r * 0.62, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }
    }
    raf = requestAnimationFrame(paso)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [descubrir, reducido, soltarFichas])

  useEffect(() => () => clearTimeout(avisoTimer.current), [])

  // Puntero.
  const alBajar = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    despertarAudio()
    const s = estado.current
    s.tocada = true
    const r = zonaRef.current.getBoundingClientRect()
    const px = e.clientX - r.left - r.width / 2
    const py = e.clientY - r.top - r.height / 2
    e.currentTarget.setPointerCapture(e.pointerId)
    s.puntero = {
      id: e.pointerId, ox: px - s.x, oy: py - s.y,
      inicioX: e.clientX, inicioY: e.clientY, inicio: performance.now() / 1000,
      ultX: px, ultY: py, ultT: performance.now() / 1000, arrastrando: false,
    }
    s.sostener = { inicio: performance.now() / 1000, fase: 'carga' }
    s.vx = 0
    s.vy = 0
    sonar('recoger', { volumen: 0.6 })
  }

  const alMover = (e) => {
    const s = estado.current
    const p = s.puntero
    if (!p || p.id !== e.pointerId) return
    if (s.sostener && s.sostener.fase !== 'carga') return
    if (!p.arrastrando && Math.hypot(e.clientX - p.inicioX, e.clientY - p.inicioY) > 6) {
      p.arrastrando = true
      s.sostener = null
      s.temblor = 0
    }
    if (!p.arrastrando) return
    const r = zonaRef.current.getBoundingClientRect()
    const px = e.clientX - r.left - r.width / 2
    const py = e.clientY - r.top - r.height / 2
    const ahora = performance.now() / 1000
    const dt = Math.max(0.008, ahora - p.ultT)
    s.vx = s.vx * 0.5 + ((px - p.ultX) / dt) * 0.5
    s.vy = s.vy * 0.5 + ((py - p.ultY) / dt) * 0.5
    p.ultX = px
    p.ultY = py
    p.ultT = ahora
    if (!reducido) {
      s.x = px - p.ox
      s.y = py - p.oy
    }
  }

  const alSoltar = (e) => {
    const s = estado.current
    const p = s.puntero
    if (!p || p.id !== e.pointerId) return
    const duracion = performance.now() / 1000 - p.inicio
    const fase = s.sostener?.fase
    s.puntero = null
    s.sostener = null
    s.temblor = 0
    if (fase === 'pausa' || fase === 'hecho') return
    if (p.arrastrando) {
      if (performance.now() / 1000 - p.ultT > 0.08) {
        s.vx = 0
        s.vy = 0
      }
      s.w = s.vx * 0.05
      s.lanzada = Math.hypot(s.vx, s.vy) > 500
      if (reducido) {
        s.vx = 0
        s.vy = 0
      }
      return
    }
    if (duracion < T_TOQUE || reducido) voltear()
  }

  const alTeclado = (e) => {
    const s = estado.current
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      despertarAudio()
      voltear()
      return
    }
    const empujes = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
    const d = empujes[e.key]
    if (d && !reducido) {
      e.preventDefault()
      despertarAudio()
      s.tocada = true
      const f = e.shiftKey ? 3200 : 1300
      s.vx += d[0] * f
      s.vy += d[1] * f
      s.w = s.vx * 0.04
      s.lanzada = true
    }
  }

  const principio = aviso ? PRINCIPIOS[aviso] : null

  return (
    <section className="entrada" data-parada="entrada" ref={zonaRef} aria-labelledby="entrada-titulo">
      <div className="entrada__escena" ref={escenaRef}>
        <canvas className="entrada__fichas" ref={lienzoRef} aria-hidden="true" />
        <button
          ref={cartaRef}
          type="button"
          className="entrada__carta"
          aria-label={volteada ? t(T.cartaEntradaVolteada) : t(T.cartaEntrada)}
          aria-pressed={volteada}
          onPointerDown={alBajar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={alSoltar}
          onKeyDown={alTeclado}
          onContextMenu={(e) => e.preventDefault()}
        >
          <span className="entrada__giro" ref={giroRef}>
            <span className="entrada__cara entrada__cara--reverso">
              <ReversoNaipe />
            </span>
            <span className="entrada__cara entrada__cara--frente">
              <span className="naipe naipe--cara joker">
                <span className="joker__esquina" aria-hidden="true">JOKER</span>
                <span className="joker__tela" aria-hidden="true" />
                <span className="joker__nombre" id="entrada-titulo">{perfil.nombre}</span>
                <span className="joker__oficio">{t(perfil.oficio)}</span>
                <span className="joker__esquina joker__esquina--abajo" aria-hidden="true">JOKER</span>
              </span>
            </span>
          </span>
        </button>
      </div>

      <h1 className="solo-lector">
        {perfil.nombre}. {t(perfil.oficio)}
      </h1>

      <div className="entrada__principios" role="status" aria-live="polite">
        <span className="solo-lector">
          {t(T.principios)}: {encontrados.length} / {ORDEN.length}
        </span>
        <span className="entrada__marcas" aria-hidden="true">
          {ORDEN.map((c) => (
            <span key={c} className={`entrada__marca ${encontrados.includes(c) ? 'is-on' : ''}`} />
          ))}
        </span>
        {principio && (
          <span className="entrada__aviso" key={aviso}>
            <strong>{t(principio.nombre)}</strong>
            <span>{t(principio.idea)}</span>
          </span>
        )}
      </div>

      <a className={`entrada__bajar ${volteada ? 'is-visible' : ''}`} href="#mano" tabIndex={volteada ? 0 : -1} aria-hidden={!volteada}>
        <span aria-hidden="true">♠ ♥ ♣ ♦</span>
        <span>{t(T.mano)}</span>
      </a>
    </section>
  )
}
