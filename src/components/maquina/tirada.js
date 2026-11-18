const TOTAL = 22

// Una carta de los arcanos mayores, derecha o invertida. Nunca repite la anterior:
// si el azar cae en ella, se toma la siguiente.
export function tirar(anterior, azar = Math.random) {
  let arcano = Math.min(TOTAL - 1, Math.floor(azar() * TOTAL))
  if (arcano === anterior) arcano = (arcano + 1) % TOTAL
  return { arcano, invertida: azar() < 0.5 }
}
