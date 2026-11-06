import { PANO } from '../medidas'

// Dónde va cada carta de la mano sobre el paño (metros).
export const ANCHO_CARTA = 0.18
export const LARGO_CARTA = 0.252

const SEPARACION = 0.155
// Escritorio: el abanico sigue el borde cercano de la mesa, a esta distancia
// de él, y cada carta gira hacia el centro como las agujas de un reloj.
const DESDE_BORDE = 0.25
const GIRO = 0.6 // fracción del giro de la normal del borde

// Celular: rejilla de tres columnas con cartas más pequeñas, para que toda la
// mano quepa dentro del paño sin pisarse. La última fila incompleta se centra.
const COLUMNAS_MOVIL = 3
const COLUMNA_MOVIL = 0.14
const Z_MOVIL = -0.085 // bajo el panel del título y los palos
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
  return Array.from({ length: n }, (_, i) => {
    const x = (i - centro) * SEPARACION
    const borde = PANO.rz * Math.sqrt(Math.max(0, 1 - (x / PANO.rx) ** 2))
    // Normal de la elipse en ese punto del borde: hacia ella apunta el pie de la carta.
    const normal = Math.atan2(x / PANO.rx ** 2, borde / PANO.rz ** 2)
    return { x, z: borde - DESDE_BORDE, rotY: normal * GIRO, escala: i === 0 ? 1.25 : 1 }
  })
}
