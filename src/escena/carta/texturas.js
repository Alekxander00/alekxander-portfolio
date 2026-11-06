import * as THREE from 'three'

// Las caras de la carta se dibujan una vez en un canvas, a 5:7 como el naipe HTML.
const W = 512
const H = 716
const R = 36

const MARFIL = '#efe7d6'
const PANO_REVERSO = '#5e1c18'
const TINTA = '#1c1915'
const TINTA_2 = '#5a5144'
const ROJO = '#b3302a'

let telarana = null
function cargarTelarana() {
  telarana ||= new Promise((resolver, fallar) => {
    const img = new Image()
    img.onload = () => resolver(img)
    img.onerror = fallar
    img.src = '/images/telarana.png'
  })
  return telarana
}

function rectRedondo(g, x, y, w, h, r) {
  g.beginPath()
  g.roundRect(x, y, w, h, r)
}

// La telaraña viene en blanco; para pintarla de otro color se tiñe en un canvas aparte.
function tenida(img, color, lado) {
  const c = document.createElement('canvas')
  c.width = c.height = lado
  const g = c.getContext('2d')
  g.drawImage(img, 0, 0, lado, lado)
  g.globalCompositeOperation = 'source-in'
  g.fillStyle = color
  g.fillRect(0, 0, lado, lado)
  return c
}

function aTextura(canvas) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export async function texturaReverso() {
  const img = await cargarTelarana()
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  rectRedondo(g, 0, 0, W, H, R)
  g.fillStyle = MARFIL
  g.fill()
  const m = W * 0.05
  rectRedondo(g, m, m, W - m * 2, H - m * 2, R * 0.6)
  g.fillStyle = PANO_REVERSO
  g.fill()
  g.save()
  g.clip()
  const lado = (W - m * 2) * 0.7
  const tela = tenida(img, MARFIL, 512)
  g.globalAlpha = 0.9
  g.drawImage(tela, m + W * 0.05, m + W * 0.05, lado, lado)
  g.globalAlpha = 0.35
  g.translate(W - m - W * 0.05, H - m - W * 0.05)
  g.rotate(Math.PI)
  g.drawImage(tela, 0, 0, lado, lado)
  g.restore()
  return aTextura(c)
}

function partirLineas(g, texto, ancho) {
  const palabras = texto.split(' ')
  const lineas = []
  let actual = ''
  for (const p of palabras) {
    const prueba = actual ? `${actual} ${p}` : p
    if (g.measureText(prueba).width > ancho && actual) {
      lineas.push(actual)
      actual = p
    } else actual = prueba
  }
  if (actual) lineas.push(actual)
  return lineas
}

// La cara del Joker: se redibuja al cambiar de idioma.
export async function texturaJoker(nombre, oficio) {
  const img = await cargarTelarana()
  await Promise.all([document.fonts.load('64px Gloock'), document.fonts.load('26px "Instrument Sans"')]).catch(() => {})
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  rectRedondo(g, 0, 0, W, H, R)
  g.fillStyle = MARFIL
  g.fill()

  // "JOKER" en vertical, arriba a la izquierda y girado abajo a la derecha.
  g.fillStyle = ROJO
  g.font = '30px Gloock, Georgia, serif'
  g.textAlign = 'center'
  const esquina = () => [...'JOKER'].forEach((l, i) => g.fillText(l, 34, 58 + i * 30))
  esquina()
  g.save()
  g.translate(W, H)
  g.rotate(Math.PI)
  esquina()
  g.restore()

  const lado = W * 0.36
  g.drawImage(tenida(img, TINTA, 512), (W - lado) / 2, H * 0.2, lado, lado)

  g.fillStyle = TINTA
  g.font = '64px Gloock, Georgia, serif'
  g.fillText(nombre, W / 2, H * 0.62)
  g.fillStyle = TINTA_2
  g.font = '26px "Instrument Sans", system-ui, sans-serif'
  partirLineas(g, oficio, W * 0.7).forEach((l, i) => g.fillText(l, W / 2, H * 0.7 + i * 34))

  const tex = aTextura(c)
  // La cara mira al paño antes del volteo; girada 180° queda derecha al voltearla.
  tex.center.set(0.5, 0.5)
  tex.rotation = Math.PI
  return tex
}
