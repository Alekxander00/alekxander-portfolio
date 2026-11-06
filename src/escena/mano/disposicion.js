// Dónde va cada carta de la mano sobre el paño (metros).
export const ANCHO_CARTA = 0.18
export const LARGO_CARTA = 0.252

const SEPARACION = 0.155
const Z_ABANICO = 0.3
const GIRO = 0.06

// Celular: rejilla de tres columnas con cartas más pequeñas, para que toda la
// mano quepa dentro del paño sin pisarse. La última fila incompleta se centra.
const COLUMNAS_MOVIL = 3
const COLUMNA_MOVIL = 0.14
const Z_MOVIL = -0.14
const FILA_MOVIL = 0.22
const ESCALA_MOVIL = 0.75

export function posicionesMano(n, movil) {
  if (movil) {
    return Array.from({ length: n }, (_, i) => {
      const fila = Math.floor(i / COLUMNAS_MOVIL)
      const enFila = Math.min(COLUMNAS_MOVIL, n - fila * COLUMNAS_MOVIL)
      const col = i % COLUMNAS_MOVIL
      return {
        x: (col - (enFila - 1) / 2) * COLUMNA_MOVIL,
        z: Z_MOVIL + fila * FILA_MOVIL,
        rotY: 0,
        escala: ESCALA_MOVIL,
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
