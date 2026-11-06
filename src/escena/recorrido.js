// Paradas de la cámara sobre la mesa (metros). La mesa está en y = 0,
// el jugador en z positivo y la Máquina en z negativo.
export const PARADAS = [
  { id: 'entrada', pos: [0, 0.62, 0.62], mira: [0, 0, 0.12], posMovil: [0, 0.82, 0.5], miraMovil: [0, 0, 0.12] },
  { id: 'mano', pos: [0, 0.95, 1.2], mira: [0, 0, 0.35], posMovil: [0, 1.25, 1.15], miraMovil: [0, 0, 0.4] },
  { id: 'maquina', pos: [0, 0.75, 1.0], mira: [0, 0.55, -0.9], posMovil: [0, 0.9, 1.25], miraMovil: [0, 0.5, -0.9] },
  { id: 'joker', pos: [0.35, 0.9, 1.05], mira: [0.35, 0, 0.45], posMovil: [0.2, 1.2, 1.1], miraMovil: [0.2, 0, 0.45] },
]

// Índice fraccionario de parada según el scroll. inicios[i] = offsetTop de la sección i.
export function progresoDeScroll(scrollY, inicios) {
  const n = inicios.length
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
