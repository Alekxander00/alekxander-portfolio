// Paradas de la cámara sobre la mesa (metros). La mesa está en y = 0,
// el jugador en z positivo y la Máquina en z negativo.
export const PARADAS = [
  { id: 'entrada', pos: [0, 0.62, 0.62], mira: [0, 0, 0.12], posMovil: [0, 1.3, 0.62], miraMovil: [0, 0, 0.1] },
  { id: 'mano', pos: [0, 1.0, 0.98], mira: [0, 0, 0.24], posMovil: [0, 1.0, 0.6], miraMovil: [0, 0, 0.0] },
  { id: 'maquina', pos: [0, 1.15, 0.95], mira: [0, 0.02, -0.38], posMovil: [0, 1.55, 1.2], miraMovil: [0, -0.05, -0.32] },
  { id: 'joker', pos: [0.61, 0.62, 0.66], mira: [0.61, 0, 0.22], posMovil: [0.3, 1.0, 0.95], miraMovil: [0.3, 0, 0.42] },
]

// Durante una partida de blackjack la cámara baja y se pone de frente a la Máquina,
// como quien está sentado a la mesa: la Máquina y las dos filas quedan sobre el panel.
export const PARTIDA = { pos: [0, 0.7, 1.1], mira: [0, 0.1, -0.35], posMovil: [0, 0.85, 1.35], miraMovil: [0, 0.12, -0.35] }

// Índice fraccionario de parada según el scroll. inicios[i] = offsetTop de la sección i.
// maxScroll: el scroll máximo de la página; si la última sección es corta y nunca
// llega arriba del todo, su parada empieza donde acaba la página.
export function progresoDeScroll(scrollY, iniciosMedidos, maxScroll = Infinity) {
  const n = iniciosMedidos.length
  const inicios = n > 1 ? [...iniciosMedidos.slice(0, -1), Math.max(iniciosMedidos[n - 2], Math.min(iniciosMedidos[n - 1], maxScroll))] : iniciosMedidos
  if (n === 0 || scrollY <= inicios[0]) return 0
  for (let i = 0; i < n - 1; i++) {
    if (scrollY < inicios[i + 1]) {
      const tramo = inicios[i + 1] - inicios[i] || 1
      return i + (scrollY - inicios[i]) / tramo
    }
  }
  return n - 1
}

const suave = (t) => t * t * (3 - 2 * t)
const mezclar = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)

export function camaraEn(progreso, movil, reducido) {
  const max = PARADAS.length - 1
  const p = Math.min(max, Math.max(0, progreso))
  const claves = movil ? ['posMovil', 'miraMovil'] : ['pos', 'mira']
  if (reducido) {
    const parada = PARADAS[Math.round(p)]
    return { pos: parada[claves[0]], mira: parada[claves[1]] }
  }
  const i = Math.min(max - 1, Math.floor(p))
  const t = suave(p - i)
  const a = PARADAS[i]
  const b = PARADAS[i + 1]
  if (t === 0) return { pos: a[claves[0]], mira: a[claves[1]] }
  if (t === 1) return { pos: b[claves[0]], mira: b[claves[1]] }
  return { pos: mezclar(a[claves[0]], b[claves[0]], t), mira: mezclar(a[claves[1]], b[claves[1]], t) }
}

// Mezcla el encuadre del recorrido con el de la partida: pleno en la parada de la
// Máquina y nada a media parada de distancia.
export function conPartida(camara, progreso, movil) {
  const peso = Math.max(0, 1 - Math.abs(progreso - 2) / 0.5)
  if (peso === 0) return camara
  const t = suave(peso)
  const [cp, cm] = movil ? [PARTIDA.posMovil, PARTIDA.miraMovil] : [PARTIDA.pos, PARTIDA.mira]
  return { pos: mezclar(camara.pos, cp, t), mira: mezclar(camara.mira, cm, t) }
}
