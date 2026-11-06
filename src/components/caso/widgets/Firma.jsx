import { useEffect, useRef, useState } from 'react'
import { useIdioma } from '../../../lib/idioma'
import { despertarAudio, sonar } from '../../../lib/sonido'

// El flujo de los consentimientos: firmas en el recuadro y sale el PDF firmado.
const W = 420
const H = 160

export default function Firma() {
  const { t, idioma } = useIdioma()
  const lienzo = useRef(null)
  const trazo = useRef({ dibujando: false, largo: 0, ult: null })
  const [pdf, setPdf] = useState(null)

  const ctx = () => lienzo.current.getContext('2d')

  useEffect(() => {
    const c = lienzo.current
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = W * dpr
    c.height = H * dpr
    const g = c.getContext('2d')
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.lineCap = 'round'
    g.lineJoin = 'round'
    g.strokeStyle = '#1c2b5a'
    g.lineWidth = 2.6
  }, [])

  const punto = (e) => {
    const r = lienzo.current.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H]
  }

  const generar = () => {
    if (trazo.current.largo < 90) return
    const ahora = new Date()
    setPdf({
      img: lienzo.current.toDataURL('image/png'),
      fecha: ahora.toLocaleString(idioma === 'es' ? 'es-CO' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
    })
    sonar('escupir', { volumen: 0.5 })
  }

  const limpiar = () => {
    ctx().clearRect(0, 0, W, H)
    trazo.current.largo = 0
    setPdf(null)
  }

  // Firma de teclado: un garabato con curvas, para quien no usa puntero.
  const firmarSola = () => {
    despertarAudio()
    limpiar()
    const g = ctx()
    g.beginPath()
    g.moveTo(60, 110)
    for (let i = 0; i <= 60; i++) {
      const x = 60 + i * 5
      const y = 100 - Math.sin(i * 0.45) * 26 * (i % 9 < 5 ? 1 : 0.4) + i * 0.3
      g.lineTo(x, y)
    }
    g.stroke()
    trazo.current.largo = 400
    generar()
  }

  return (
    <div className="widget" style={{ background: '#e9e3d6', color: '#1c1915' }}>
      <div style={{ display: 'grid', gap: 12, padding: 14, gridTemplateColumns: pdf ? 'minmax(0,1.3fr) minmax(0,1fr)' : '1fr' }}>
        <div>
          <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: '#5a5144' }}>
            {t({ es: 'Consentimiento informado · Firma del paciente', en: 'Informed consent · Patient signature' })}
          </p>
          <canvas
            ref={lienzo}
            width={W}
            height={H}
            aria-label={t({ es: 'Recuadro de firma', en: 'Signature pad' })}
            role="img"
            style={{ background: '#fff', borderRadius: 6, border: '1px dashed #9a8f7c', touchAction: 'none', cursor: 'crosshair' }}
            onPointerDown={(e) => {
              despertarAudio()
              if (pdf) limpiar()
              e.currentTarget.setPointerCapture(e.pointerId)
              trazo.current.dibujando = true
              trazo.current.ult = punto(e)
            }}
            onPointerMove={(e) => {
              const tr = trazo.current
              if (!tr.dibujando) return
              const p = punto(e)
              const g = ctx()
              g.beginPath()
              g.moveTo(...tr.ult)
              g.lineTo(...p)
              g.stroke()
              tr.largo += Math.hypot(p[0] - tr.ult[0], p[1] - tr.ult[1])
              tr.ult = p
            }}
            onPointerUp={() => {
              trazo.current.dibujando = false
              generar()
            }}
          />
        </div>
        {pdf && (
          <figure
            style={{
              margin: 0,
              padding: '14px 14px 10px',
              background: '#fff',
              borderRadius: 4,
              boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
              animation: 'pdf-sale 0.45s cubic-bezier(.3,1.4,.5,1) both',
              alignSelf: 'start',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#5a5144' }}>
              <span>consentimiento.pdf</span>
              <span style={{ color: '#b3302a', fontWeight: 600 }}>PDF</span>
            </div>
            {[90, 75, 82, 60].map((w, i) => (
              <span key={i} style={{ display: 'block', height: 5, width: `${w}%`, background: '#e2dccf', borderRadius: 3, marginTop: 7 }} />
            ))}
            <img src={pdf.img} alt={t({ es: 'Tu firma dentro del PDF', en: 'Your signature inside the PDF' })} style={{ width: '70%', marginTop: 8, borderBottom: '1px solid #1c1915' }} />
            <figcaption style={{ fontSize: '0.75rem', color: '#5a5144', marginTop: 4 }}>{pdf.fecha}</figcaption>
          </figure>
        )}
      </div>
      <div className="widget__barra" style={{ borderTopColor: 'rgba(28,25,21,0.12)' }}>
        <button type="button" className="widget__tecla" onClick={firmarSola}>
          {t({ es: 'Firmar con el teclado', en: 'Sign with the keyboard' })}
        </button>
        {pdf && (
          <button type="button" className="widget__tecla" onClick={limpiar}>
            {t({ es: 'Borrar', en: 'Clear' })}
          </button>
        )}
        <span className="solo-lector" aria-live="polite">
          {pdf ? t({ es: 'PDF generado con tu firma', en: 'PDF generated with your signature' }) : ''}
        </span>
      </div>
      <style>{`@keyframes pdf-sale { from { opacity: 0; transform: translateX(-30px) rotate(-6deg) } }`}</style>
    </div>
  )
}
