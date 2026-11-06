// Una carta que cae del cielo a la mesa y sube de vuelta, con los principios de
// la entrada: se estira al caer (k), hitstop al tocar, se aplasta al aterrizar (q)
// y se agacha antes de despegar (anticipación). y es la altura sobre su sitio.
export const ALTURA_CIELO = 1.3
const G = 6 // m/s²: algo menos que la real, para que se vea caer
const HITSTOP = 0.07
const AGACHE = 0.14
const SUBIDA = 4.5 // m/s

export function crearCaida() {
  return { fase: 'fuera', y: ALTURA_CIELO, vy: 0, k: 0, q: 0, hasta: 0 }
}

export function soltarDesde(s, altura = ALTURA_CIELO) {
  Object.assign(s, { fase: 'cayendo', y: altura, vy: 0, k: 0, q: 0 })
}

export function despegar(s, ahora) {
  if (s.fase === 'fuera' || s.fase === 'agachada' || s.fase === 'subiendo') return
  Object.assign(s, { fase: 'agachada', hasta: ahora + AGACHE, vy: 0 })
}

export function pasoCaida(s, dt, ahora) {
  const eventos = []
  if (s.fase === 'cayendo') {
    s.vy -= G * dt
    s.y += s.vy * dt
    s.k = Math.min(0.35, -s.vy * 0.08)
    if (s.y <= 0) {
      eventos.push({ tipo: 'impacto', fuerza: -s.vy })
      Object.assign(s, { fase: 'hitstop', y: 0, hasta: ahora + HITSTOP, k: 0 })
    }
  } else if (s.fase === 'hitstop') {
    if (ahora >= s.hasta) Object.assign(s, { fase: 'posada', q: 0.3 })
  } else if (s.fase === 'posada') {
    s.q *= Math.exp(-9 * dt)
  } else if (s.fase === 'agachada') {
    s.q += (0.18 - s.q) * Math.min(1, dt * 20)
    if (ahora >= s.hasta) Object.assign(s, { fase: 'subiendo', vy: SUBIDA, q: 0 })
  } else if (s.fase === 'subiendo') {
    s.vy += G * dt
    s.y += s.vy * dt
    s.k = Math.min(0.35, s.vy * 0.05)
    if (s.y >= ALTURA_CIELO) Object.assign(s, { fase: 'fuera', y: ALTURA_CIELO, vy: 0, k: 0 })
  }
  return eventos
}
