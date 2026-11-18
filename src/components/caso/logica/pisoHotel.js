// Un piso de Hotel Insomnio: las anclas no se mueven; las habitaciones, sí.
// La decoración pertenece a la habitación, así que viaja con ella.

export const DECORACIONES = [
  { id: 'vela', es: 'Vela', en: 'Candle' },
  { id: 'retrato', es: 'Retrato', en: 'Portrait' },
  { id: 'planta', es: 'Planta', en: 'Plant' },
  { id: 'radio', es: 'Radio', en: 'Radio' },
  { id: 'alfombra', es: 'Alfombra', en: 'Rug' },
  { id: 'nada', es: 'Sin decorar', en: 'Undecorated' },
]

export const HABITACIONES = [
  { id: '101', pared: '#5b3a3f' },
  { id: '102', pared: '#3e4a3c' },
  { id: '103', pared: '#4a4058' },
  { id: '104', pared: '#6a5136' },
  { id: '105', pared: '#34474f' },
  { id: '106', pared: '#5a4a44' },
]

// Centros en unidades del SVG (viewBox 0 0 480 240): tres arriba del pasillo y tres abajo.
export const ANCLAS = [
  { x: 140, y: 58 },
  { x: 240, y: 58 },
  { x: 340, y: 58 },
  { x: 140, y: 182 },
  { x: 240, y: 182 },
  { x: 340, y: 182 },
]

export function pisoInicial() {
  const deco = {}
  HABITACIONES.forEach((h, i) => (deco[h.id] = DECORACIONES[i].id))
  return { noche: 1, orden: HABITACIONES.map((h) => h.id), deco }
}

// Sattolo: un solo ciclo, así que ninguna habitación se queda en su ancla.
export function siguienteNoche(orden, azar = Math.random) {
  const r = [...orden]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * i)
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

export function decorar(deco, id) {
  const i = DECORACIONES.findIndex((d) => d.id === deco[id])
  return { ...deco, [id]: DECORACIONES[(i + 1) % DECORACIONES.length].id }
}
