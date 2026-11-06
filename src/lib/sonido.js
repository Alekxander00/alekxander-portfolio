// Sonido de la web. Nada suena hasta el primer gesto del visitante.
// Los efectos de cartas y de la Máquina son los de Baluarte; si el navegador
// no sabe decodificar .ogg, se sintetiza un sustituto parecido.

const ARCHIVOS = {
  recoger: '/sonidos/cartaRecoger_01.ogg',
  aterrizar: ['/sonidos/cartaAterrizar_01.ogg', '/sonidos/cartaAterrizar_02.ogg'],
  elegida: '/sonidos/cartaElegida_01.ogg',
  escupir: '/sonidos/cartasEscupir_01.wav',
  golpe: '/sonidos/expendedoraGolpe_01.ogg',
  eyeccion: '/sonidos/expendedoraEyeccion_01.ogg',
  activar: '/sonidos/expendedoraActivar_01.ogg',
  cambio: '/sonidos/expendedoraCambio_01.ogg',
  aleatoria: '/sonidos/expendedoraAnimacionAleatoria_01.ogg',
}

let ctx = null
let salida = null
let silenciado = false
const buffers = new Map()
const oyentes = new Set()

function leerSilencio() {
  try {
    return localStorage.getItem('silencio') === '1'
  } catch {
    return false
  }
}
silenciado = leerSilencio()

export function estaSilenciado() {
  return silenciado
}

export function alCambiarSilencio(fn) {
  oyentes.add(fn)
  return () => oyentes.delete(fn)
}

export function setSilencio(v) {
  silenciado = v
  try {
    localStorage.setItem('silencio', v ? '1' : '0')
  } catch {
    /* sin almacenamiento */
  }
  if (salida) salida.gain.value = v ? 0 : 0.8
  oyentes.forEach((fn) => fn(v))
}

// Se llama en el primer gesto (pointerdown/keydown). Los navegadores no dejan
// crear audio antes.
export function despertarAudio() {
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume()
    return
  }
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = new AC()
  salida = ctx.createGain()
  salida.gain.value = silenciado ? 0 : 0.8
  salida.connect(ctx.destination)
  Object.values(ARCHIVOS)
    .flat()
    .forEach((url) => cargar(url))
}

async function cargar(url) {
  if (buffers.has(url)) return buffers.get(url)
  const p = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(url)
      return r.arrayBuffer()
    })
    .then((ab) => ctx.decodeAudioData(ab))
    .catch(() => null)
  buffers.set(url, p)
  return p
}

function elegir(v) {
  return Array.isArray(v) ? v[Math.floor(Math.random() * v.length)] : v
}

export async function sonar(nombre, { volumen = 1, tono = 1 } = {}) {
  if (!ctx || silenciado) return
  const url = elegir(ARCHIVOS[nombre])
  const buf = url ? await cargar(url) : null
  if (!buf) {
    sintetizar(nombre, volumen)
    return
  }
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.playbackRate.value = tono * (0.96 + Math.random() * 0.08)
  const g = ctx.createGain()
  g.gain.value = volumen
  src.connect(g).connect(salida)
  src.start()
}

// Ruido corto filtrado: sirve de golpe, de carta y de ficha.
function ruido(duracion, frecuencia, volumen, q = 1) {
  const n = Math.floor(ctx.sampleRate * duracion)
  const buf = ctx.createBuffer(1, n, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3)
  const src = ctx.createBufferSource()
  src.buffer = buf
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.value = frecuencia
  f.Q.value = q
  const g = ctx.createGain()
  g.gain.value = volumen
  src.connect(f).connect(g).connect(salida)
  src.start()
}

function sintetizar(nombre, volumen) {
  switch (nombre) {
    case 'golpe':
      ruido(0.18, 180, 1.2 * volumen, 0.7)
      break
    case 'eyeccion':
    case 'escupir':
      ruido(0.25, 900, 0.6 * volumen, 2)
      break
    default:
      ruido(0.08, 2400, 0.5 * volumen, 1.5)
  }
}

// Fichas de casino al caer: varios clics agudos.
export function fichas(cantidad = 5) {
  if (!ctx || silenciado) return
  for (let i = 0; i < cantidad; i++) {
    const t = ctx.currentTime + i * 0.035 + Math.random() * 0.03
    const o = ctx.createOscillator()
    o.type = 'triangle'
    o.frequency.value = 2600 + Math.random() * 1400
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07)
    o.connect(g).connect(salida)
    o.start(t)
    o.stop(t + 0.08)
  }
}

// Un bombo corto, para el widget de Kinet.
export function pulso() {
  if (!ctx || silenciado) return
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  o.type = 'sine'
  o.frequency.setValueAtTime(140, t)
  o.frequency.exponentialRampToValueAtTime(42, t + 0.25)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.7, t + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
  o.connect(g).connect(salida)
  o.start(t)
  o.stop(t + 0.42)
}

// La voz de la Máquina: sílabas mecánicas sin palabras, como en Baluarte.
// Más letras, más sílabas; sube de tono si exclama, sube al final si pregunta.
export function hablar(frase) {
  if (!ctx || silenciado || !frase) return
  const letras = frase.replace(/[^\p{L}]/gu, '')
  const silabas = Math.min(28, Math.max(2, Math.round(letras.length / 2.2)))
  const exclama = frase.includes('!')
  const pregunta = frase.includes('?')
  const base = exclama ? 300 : 230
  let t = ctx.currentTime + 0.02
  for (let i = 0; i < silabas; i++) {
    const subida = pregunta && i >= silabas - 2 ? 1.35 : 1
    const f = base * subida * (0.85 + Math.random() * 0.35)
    const dur = 0.055 + Math.random() * 0.03
    const o = ctx.createOscillator()
    o.type = 'square'
    o.frequency.setValueAtTime(f, t)
    o.frequency.exponentialRampToValueAtTime(f * 0.8, t + dur)
    const filtro = ctx.createBiquadFilter()
    filtro.type = 'lowpass'
    filtro.frequency.value = 1400
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(filtro).connect(g).connect(salida)
    o.start(t)
    o.stop(t + dur + 0.01)
    t += dur + 0.025
  }
}
