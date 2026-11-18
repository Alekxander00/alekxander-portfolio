import { ARCANOS } from '../content/tarot'

// Caras de las cartas de tarot dibujadas en canvas, sin three: la mesa 3D las
// usa como textura y la versión plana como imagen.
export const TAROT = { W: 512, H: 870 }
const { W, H } = TAROT
const R = 36
const MARFIL = '#efe7d6'
const TINTA = '#1c1915'
const TINTA_2 = '#5a5144'
const PANO = '#5e1c18'

const giro = (g, cx, cy, ang, fn) => {
  g.save()
  g.translate(cx, cy)
  g.rotate(ang)
  fn()
  g.restore()
}
const circulo = (g, x, y, r, relleno) => {
  g.beginPath()
  g.arc(x, y, r, 0, Math.PI * 2)
  if (relleno) g.fill()
  else g.stroke()
}
const linea = (g, ...p) => {
  g.beginPath()
  g.moveTo(p[0], p[1])
  for (let i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1])
  g.stroke()
}
// Media luna: un círculo de tinta mordido por otro del color del fondo.
const mediaLuna = (g, x, y, r, fondo) => {
  g.fillStyle = TINTA
  circulo(g, x, y, r, true)
  g.fillStyle = fondo
  circulo(g, x + r * 0.45, y - r * 0.15, r * 0.85, true)
  g.fillStyle = TINTA
}
const estrella = (g, x, y, puntas, rExt, rInt) => {
  g.beginPath()
  for (let i = 0; i < puntas * 2; i++) {
    const r = i % 2 ? rInt : rExt
    const a = (i * Math.PI) / puntas - Math.PI / 2
    g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
  }
  g.closePath()
  g.fill()
}

// Un emblema propio por arcano, dibujado con trazos sencillos alrededor de (cx, cy).
export const EMBLEMAS = {
  precipicio(g, cx, cy, r) {
    linea(g, cx - r, cy + r * 0.2, cx + r * 0.15, cy + r * 0.2, cx + r * 0.15, cy + r)
    circulo(g, cx - r * 0.25, cy - r * 0.05, r * 0.14, true)
    circulo(g, cx + r * 0.6, cy - r * 0.6, r * 0.22)
  },
  infinito(g, cx, cy, r) {
    g.beginPath()
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * Math.PI * 2
      const d = 1 + Math.sin(t) ** 2
      g.lineTo(cx + (r * Math.cos(t)) / d, cy + (r * Math.sin(t) * Math.cos(t)) / d)
    }
    g.stroke()
  },
  pilares(g, cx, cy, r) {
    for (const s of [-1, 1]) g.strokeRect(cx + s * r * 0.6 - r * 0.12, cy - r * 0.9, r * 0.24, r * 1.8)
    mediaLuna(g, cx, cy, r * 0.3, MARFIL)
  },
  venus(g, cx, cy, r) {
    circulo(g, cx, cy - r * 0.3, r * 0.45)
    linea(g, cx, cy + r * 0.15, cx, cy + r * 0.9)
    linea(g, cx - r * 0.3, cy + r * 0.5, cx + r * 0.3, cy + r * 0.5)
  },
  corona(g, cx, cy, r) {
    g.beginPath()
    const p = [[-0.8, 0.45], [-0.8, -0.4], [-0.4, 0.05], [0, -0.6], [0.4, 0.05], [0.8, -0.4], [0.8, 0.45]]
    p.forEach(([x, y]) => g.lineTo(cx + x * r, cy + y * r))
    g.closePath()
    g.stroke()
    for (const [x, y] of [p[1], p[3], p[5]]) circulo(g, cx + x * r, cy + y * r - r * 0.12, r * 0.08, true)
  },
  llaves(g, cx, cy, r) {
    for (const s of [-1, 1])
      giro(g, cx, cy, s * 0.55, () => {
        linea(g, 0, -r * 0.5, 0, r * 0.9)
        circulo(g, 0, -r * 0.7, r * 0.2)
        linea(g, 0, r * 0.65, r * 0.22 * s, r * 0.65)
        linea(g, 0, r * 0.85, r * 0.22 * s, r * 0.85)
      })
  },
  corazones(g, cx, cy, r) {
    circulo(g, cx - r * 0.3, cy, r * 0.55)
    circulo(g, cx + r * 0.3, cy, r * 0.55)
  },
  flecha(g, cx, cy, r) {
    linea(g, cx - r * 0.9, cy, cx + r * 0.8, cy)
    linea(g, cx + r * 0.4, cy - r * 0.4, cx + r * 0.85, cy, cx + r * 0.4, cy + r * 0.4)
    linea(g, cx - r * 0.9, cy - r * 0.45, cx - r * 0.3, cy - r * 0.45)
    linea(g, cx - r * 0.9, cy + r * 0.45, cx - r * 0.3, cy + r * 0.45)
  },
  llama(g, cx, cy, r) {
    for (const k of [1, 0.5]) {
      const base = cy + r * 0.8
      g.beginPath()
      g.moveTo(cx, base - r * 1.75 * k)
      g.bezierCurveTo(cx + r * 0.75 * k, cy - r * 0.2 * k, cx + r * 0.6 * k, base, cx, base)
      g.bezierCurveTo(cx - r * 0.6 * k, base, cx - r * 0.75 * k, cy - r * 0.2 * k, cx, base - r * 1.75 * k)
      g.stroke()
    }
  },
  farol(g, cx, cy, r) {
    g.strokeRect(cx - r * 0.35, cy - r * 0.35, r * 0.7, r * 0.95)
    linea(g, cx - r * 0.5, cy - r * 0.35, cx, cy - r * 0.7, cx + r * 0.5, cy - r * 0.35)
    g.beginPath()
    g.arc(cx, cy - r * 0.8, r * 0.15, Math.PI, 0)
    g.stroke()
    estrella(g, cx, cy + r * 0.12, 6, r * 0.22, r * 0.09)
  },
  rueda(g, cx, cy, r) {
    circulo(g, cx, cy, r * 0.8)
    circulo(g, cx, cy, r * 0.14, true)
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4
      linea(g, cx + Math.cos(a) * r * 0.2, cy + Math.sin(a) * r * 0.2, cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r * 0.8)
    }
  },
  balanza(g, cx, cy, r) {
    linea(g, cx, cy - r * 0.8, cx, cy + r * 0.85)
    linea(g, cx - r * 0.4, cy + r * 0.85, cx + r * 0.4, cy + r * 0.85)
    linea(g, cx - r * 0.8, cy - r * 0.55, cx + r * 0.8, cy - r * 0.55)
    for (const s of [-1, 1]) {
      const x = cx + s * r * 0.8
      linea(g, x - r * 0.25, cy + r * 0.05, x, cy - r * 0.55, x + r * 0.25, cy + r * 0.05)
      g.beginPath()
      g.arc(x, cy + r * 0.05, r * 0.25, 0, Math.PI)
      g.stroke()
    }
  },
  triangulo(g, cx, cy, r) {
    g.beginPath()
    g.moveTo(cx - r * 0.75, cy - r * 0.6)
    g.lineTo(cx + r * 0.75, cy - r * 0.6)
    g.lineTo(cx, cy + r * 0.6)
    g.closePath()
    g.stroke()
    linea(g, cx, cy - r * 0.6, cx, cy - r * 0.95)
    circulo(g, cx, cy + r * 0.78, r * 0.14, true)
  },
  reloj(g, cx, cy, r) {
    linea(g, cx - r * 0.55, cy - r * 0.85, cx + r * 0.55, cy - r * 0.85)
    linea(g, cx - r * 0.55, cy + r * 0.85, cx + r * 0.55, cy + r * 0.85)
    linea(g, cx - r * 0.45, cy - r * 0.85, cx + r * 0.45, cy + r * 0.85)
    linea(g, cx + r * 0.45, cy - r * 0.85, cx - r * 0.45, cy + r * 0.85)
    g.beginPath()
    g.moveTo(cx, cy + r * 0.45)
    g.lineTo(cx + r * 0.3, cy + r * 0.85)
    g.lineTo(cx - r * 0.3, cy + r * 0.85)
    g.closePath()
    g.fill()
  },
  gotas(g, cx, cy, r) {
    const copa = (x, y) => {
      g.beginPath()
      g.moveTo(x - r * 0.3, y - r * 0.25)
      g.lineTo(x + r * 0.3, y - r * 0.25)
      g.lineTo(x + r * 0.15, y + r * 0.25)
      g.lineTo(x - r * 0.15, y + r * 0.25)
      g.closePath()
      g.stroke()
    }
    copa(cx - r * 0.5, cy - r * 0.45)
    copa(cx + r * 0.5, cy + r * 0.45)
    for (const t of [0.25, 0.5, 0.75]) circulo(g, cx - r * 0.5 + t * r, cy - r * 0.2 + t * r * 0.4 - Math.sin(t * Math.PI) * r * 0.25, r * 0.07, true)
  },
  cadena(g, cx, cy, r) {
    // Eslabones alternos: de lado, de frente, de lado.
    for (const i of [-1, 0, 1]) {
      g.beginPath()
      if (i === 0) g.ellipse(cx, cy, r * 0.42, r * 0.16, 0, 0, Math.PI * 2)
      else g.ellipse(cx + i * r * 0.62, cy, r * 0.36, r * 0.26, 0, 0, Math.PI * 2)
      g.stroke()
    }
  },
  torre(g, cx, cy, r) {
    g.strokeRect(cx - r * 0.35, cy - r * 0.45, r * 0.7, r * 1.35)
    for (const x of [-0.35, -0.05, 0.25]) g.fillRect(cx + x * r, cy - r * 0.62, r * 0.1, r * 0.17)
    g.fillRect(cx - r * 0.08, cy, r * 0.16, r * 0.25)
    linea(g, cx + r * 0.85, cy - r * 0.95, cx + r * 0.45, cy - r * 0.55, cx + r * 0.7, cy - r * 0.5, cx + r * 0.3, cy - r * 0.15)
  },
  estrella(g, cx, cy, r) {
    estrella(g, cx, cy - r * 0.1, 8, r * 0.75, r * 0.3)
    for (const [x, y] of [[-0.75, 0.75], [0, 0.85], [0.75, 0.75]]) estrella(g, cx + x * r, cy + y * r, 8, r * 0.12, r * 0.05)
  },
  luna(g, cx, cy, r) {
    mediaLuna(g, cx, cy - r * 0.1, r * 0.7, MARFIL)
    for (const x of [-0.5, 0, 0.5]) circulo(g, cx + x * r, cy + r * 0.85, r * 0.06, true)
  },
  sol(g, cx, cy, r) {
    circulo(g, cx, cy, r * 0.4, true)
    for (let i = 0; i < 16; i++) {
      const a = (i * Math.PI) / 8
      const largo = i % 2 ? 0.75 : 0.95
      linea(g, cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55, cx + Math.cos(a) * r * largo, cy + Math.sin(a) * r * largo)
    }
  },
  trompeta(g, cx, cy, r) {
    giro(g, cx, cy, -0.5, () => {
      linea(g, -r * 0.9, 0, r * 0.2, 0)
      g.beginPath()
      g.moveTo(r * 0.2, -r * 0.08)
      g.lineTo(r * 0.75, -r * 0.4)
      g.lineTo(r * 0.75, r * 0.4)
      g.lineTo(r * 0.2, r * 0.08)
      g.closePath()
      g.stroke()
      for (const k of [1, 1.3]) {
        g.beginPath()
        g.arc(r * 0.75, 0, r * 0.25 * k, -0.9, 0.9)
        g.stroke()
      }
    })
  },
  laurel(g, cx, cy, r) {
    g.beginPath()
    g.ellipse(cx, cy, r * 0.55, r * 0.85, 0, 0, Math.PI * 2)
    g.stroke()
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6 + Math.PI / 12
      const x = cx + Math.cos(a) * r * 0.55
      const y = cy + Math.sin(a) * r * 0.85
      g.beginPath()
      g.ellipse(x + Math.cos(a) * r * 0.1, y + Math.sin(a) * r * 0.1, r * 0.14, r * 0.055, a + Math.PI / 2.6, 0, Math.PI * 2)
      g.fill()
    }
  },
}

function lienzo() {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  g.beginPath()
  g.roundRect(0, 0, W, H, R)
  g.fillStyle = MARFIL
  g.fill()
  return { c, g }
}

function partir(g, texto, ancho) {
  const lineas = []
  let actual = ''
  for (const p of texto.split(' ')) {
    const prueba = actual ? `${actual} ${p}` : p
    if (g.measureText(prueba).width > ancho && actual) {
      lineas.push(actual)
      actual = p
    } else actual = prueba
  }
  if (actual) lineas.push(actual)
  return lineas
}

export async function canvasTarot(n, idioma) {
  await document.fonts?.load('64px Gloock').catch(() => {})
  const arcano = ARCANOS[n]
  const { c, g } = lienzo()
  g.strokeStyle = TINTA_2
  g.lineWidth = 3
  g.beginPath()
  g.roundRect(26, 26, W - 52, H - 52, 20)
  g.stroke()
  g.lineWidth = 1.5
  g.beginPath()
  g.roundRect(38, 38, W - 76, H - 76, 14)
  g.stroke()

  g.fillStyle = TINTA
  g.textAlign = 'center'
  g.font = '72px Gloock, Georgia, serif'
  g.fillText(arcano.romano, W / 2, 128)
  linea(g, W * 0.3, 160, W * 0.7, 160)

  g.strokeStyle = TINTA
  g.lineWidth = 11
  g.lineCap = 'round'
  g.lineJoin = 'round'
  EMBLEMAS[arcano.emblema](g, W / 2, H * 0.48, 150)

  g.lineWidth = 1.5
  g.strokeStyle = TINTA_2
  linea(g, W * 0.3, H - 200, W * 0.7, H - 200)
  g.font = '46px Gloock, Georgia, serif'
  const lineas = partir(g, arcano.nombre[idioma], W * 0.74).slice(0, 2)
  const y0 = lineas.length > 1 ? H - 140 : H - 115
  lineas.forEach((l, i) => g.fillText(l, W / 2, y0 + i * 52))
  return c
}

export function canvasReversoTarot() {
  const { c, g } = lienzo()
  const m = W * 0.05
  g.beginPath()
  g.roundRect(m, m, W - m * 2, H - m * 2, R * 0.6)
  g.fillStyle = PANO
  g.fill()
  g.strokeStyle = MARFIL
  g.globalAlpha = 0.5
  g.lineWidth = 2
  g.beginPath()
  g.roundRect(m * 2, m * 2, W - m * 4, H - m * 4, R * 0.4)
  g.stroke()
  g.globalAlpha = 0.9
  g.fillStyle = MARFIL
  estrella(g, W / 2, H / 2, 8, 110, 40)
  g.fillStyle = PANO
  circulo(g, W / 2, H / 2, 30, true)
  g.fillStyle = MARFIL
  for (const y of [H * 0.18, H * 0.82]) estrella(g, W / 2, y, 4, 34, 10)
  return c
}
