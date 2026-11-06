// La vela de Sargazo: empuja según el ángulo con el viento, con zona muerta de frente.
export const ZONA_MUERTA = 40

export const norm = (g) => ((((g + 180) % 360) + 360) % 360) - 180

export function empuje(rel) {
  const a = Math.abs(norm(rel))
  if (a < ZONA_MUERTA) return 0
  if (a < 90) return (a - ZONA_MUERTA) / (90 - ZONA_MUERTA)
  if (a <= 135) return 1
  return 1 - ((a - 135) / 45) * 0.35
}

// Cuánto se abre la botavara (grados): la mitad del ángulo, cerrada en la zona muerta.
export function aperturaBotavara(rel) {
  const a = Math.abs(norm(rel))
  if (a < ZONA_MUERTA) return 0
  return Math.max(8, Math.min(80, a / 2))
}
