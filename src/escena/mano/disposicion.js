// Dónde va cada carta de la mano sobre el paño (metros).
export const ANCHO_CARTA = 0.18
export const LARGO_CARTA = 0.252

const SEPARACION = 0.155
const Z_ABANICO = 0.42
const GIRO = 0.06

// Celular: dos columnas, filas más juntas y cartas algo más pequeñas para que
// toda la mano quepa dentro del paño.
const COLUMNA_MOVIL = 0.1
const Z_MOVIL = -0.12
const FILA_MOVIL = 0.2
const ESCALA_MOVIL = 0.75

export function posicionesMano(n, movil) {
  if (movil) {
    return Array.from({ length: n }, (_, i) => {
      const fila = Math.floor(i / 2)
      const sola = n % 2 === 1 && i === n - 1
      return {
        x: sola ? 0 : i % 2 === 0 ? -COLUMNA_MOVIL : COLUMNA_MOVIL,
        z: Z_MOVIL + fila * FILA_MOVIL,
        rotY: 0,
        escala: (i === 0 ? 1.2 : 1) * ESCALA_MOVIL,
      }
    })
  }
  const centro = (n - 1) / 2
  return Array.from({ length: n }, (_, i) => ({
    x: (i - centro) * SEPARACION,
    z: Z_ABANICO + Math.abs(i - centro) * 0.012,
    rotY: -(i - centro) * GIRO,
    escala: i === 0 ? 1.25 : 1,
  }))
}
