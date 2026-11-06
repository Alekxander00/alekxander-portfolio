import * as THREE from 'three'

// Caras de naipe dibujadas en canvas, con el mismo diseño que el naipe HTML.
const W = 512
const H = 716
const R = 36
const MARFIL = '#efe7d6'
const TINTA = '#1c1915'
const ROJO = '#b3302a'
const SIMBOLO = { picas: '♠', corazones: '♥', diamantes: '♦', treboles: '♣' }
const ES_ROJO = { corazones: true, diamantes: true }

const L = 0.22
const C = 0.5
const Rr = 0.78
const PIPS = {
  2: [[C, 0.08], [C, 0.92]],
  3: [[C, 0.08], [C, 0.5], [C, 0.92]],
  4: [[L, 0.08], [Rr, 0.08], [L, 0.92], [Rr, 0.92]],
  5: [[L, 0.08], [Rr, 0.08], [C, 0.5], [L, 0.92], [Rr, 0.92]],
  6: [[L, 0.08], [Rr, 0.08], [L, 0.5], [Rr, 0.5], [L, 0.92], [Rr, 0.92]],
  7: [[L, 0.08], [Rr, 0.08], [C, 0.29], [L, 0.5], [Rr, 0.5], [L, 0.92], [Rr, 0.92]],
  8: [[L, 0.08], [Rr, 0.08], [C, 0.29], [L, 0.5], [Rr, 0.5], [C, 0.71], [L, 0.92], [Rr, 0.92]],
  9: [[L, 0.08], [Rr, 0.08], [L, 0.36], [Rr, 0.36], [C, 0.5], [L, 0.64], [Rr, 0.64], [L, 0.92], [Rr, 0.92]],
  10: [[L, 0.08], [Rr, 0.08], [C, 0.22], [L, 0.36], [Rr, 0.36], [L, 0.64], [Rr, 0.64], [C, 0.78], [L, 0.92], [Rr, 0.92]],
}

function base() {
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

function indices(g, valor, palo) {
  g.fillStyle = ES_ROJO[palo] ? ROJO : TINTA
  g.textAlign = 'center'
  const uno = () => {
    g.font = '64px Gloock, Georgia, serif'
    g.fillText(valor, 50, 78)
    g.font = '44px Gloock, Georgia, serif'
    g.fillText(SIMBOLO[palo] ?? '★', 50, 124)
  }
  uno()
  g.save()
  g.translate(W, H)
  g.rotate(Math.PI)
  uno()
  g.restore()
}

// Pips o figura en el rectángulo central [x, y, w, h].
function centro(g, valor, palo, [x, y, w, h]) {
  const sim = SIMBOLO[palo] ?? '★'
  g.fillStyle = ES_ROJO[palo] ? ROJO : TINTA
  g.strokeStyle = g.fillStyle
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  if (valor === 'A' || valor === '★') {
    g.font = `${Math.round(h * 0.42)}px Gloock, Georgia, serif`
    g.fillText(sim, x + w / 2, y + h / 2)
  } else if (['J', 'Q', 'K'].includes(valor)) {
    g.lineWidth = 3
    g.strokeRect(x, y, w, h)
    g.font = `${Math.round(h * 0.34)}px Gloock, Georgia, serif`
    g.fillText(valor, x + w / 2, y + h * 0.42)
    g.font = `${Math.round(h * 0.14)}px Gloock, Georgia, serif`
    g.fillText(sim, x + w / 2, y + h * 0.7)
  } else {
    g.font = `${Math.round(h * 0.12)}px Gloock, Georgia, serif`
    for (const [px, py] of PIPS[valor] || []) {
      g.save()
      g.translate(x + px * w, y + py * h)
      if (py > 0.55) g.rotate(Math.PI)
      g.fillText(sim, 0, 0)
      g.restore()
    }
  }
  g.textBaseline = 'alphabetic'
}

function aTextura(c) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function cargarImagen(src) {
  return new Promise((resolver) => {
    const img = new Image()
    img.onload = () => resolver(img)
    img.onerror = () => resolver(null)
    img.src = src
  })
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

// Naipe simple (blackjack).
export function texturaNaipe(valor, palo) {
  const { c, g } = base()
  indices(g, valor, palo)
  centro(g, valor, palo, [W * 0.17, H * 0.14, W * 0.66, H * 0.72])
  return aTextura(c)
}

// Carta de proyecto: índice, imagen (o pips si no hay) y título abajo.
export async function texturaProyecto(p, t) {
  await document.fonts.load('64px Gloock').catch(() => {})
  const { c, g } = base()
  indices(g, p.valor, p.palo)
  const marco = [W * 0.17, H * 0.14, W * 0.66, H * 0.56]
  const img = p.imagen ? await cargarImagen(p.imagen) : null
  if (img) {
    const [x, y, w, h] = marco
    g.save()
    g.beginPath()
    g.roundRect(x, y, w, h, 10)
    g.clip()
    g.fillStyle = p.imagenEncaje?.fondo ?? '#000'
    g.fillRect(x, y, w, h)
    const contener = p.imagenEncaje?.ajuste === 'contain'
    const k = contener ? Math.min(w / img.width, h / img.height) : Math.max(w / img.width, h / img.height)
    const iw = img.width * k
    const ih = img.height * k
    g.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih)
    g.restore()
  } else {
    centro(g, p.valor, p.palo, marco)
  }
  g.fillStyle = TINTA
  g.textAlign = 'center'
  g.font = '40px Gloock, Georgia, serif'
  partir(g, t(p.titulo), W * 0.78)
    .slice(0, 2)
    .forEach((l, i) => g.fillText(l, W / 2, H * 0.79 + i * 44))
  return aTextura(c)
}
