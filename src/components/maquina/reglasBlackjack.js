// Blackjack de una baraja. La casa pide hasta 17 y se planta en 17 blando.
const PALOS = ['picas', 'corazones', 'diamantes', 'treboles']
const VALORES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export function nuevoMazo() {
  const mazo = []
  for (const palo of PALOS) for (const valor of VALORES) mazo.push({ palo, valor, id: valor + palo })
  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[mazo[i], mazo[j]] = [mazo[j], mazo[i]]
  }
  return mazo
}

export function puntos(cartas) {
  let total = 0
  let ases = 0
  for (const c of cartas) {
    if (c.valor === 'A') {
      ases++
      total += 11
    } else if (['J', 'Q', 'K'].includes(c.valor)) total += 10
    else total += Number(c.valor)
  }
  while (total > 21 && ases > 0) {
    total -= 10
    ases--
  }
  return { total, blando: ases > 0 }
}

export const esBlackjack = (cartas) => cartas.length === 2 && puntos(cartas).total === 21

export function casaPide(cartas) {
  return puntos(cartas).total < 17
}

// Resultado desde el punto de vista del visitante.
export function resolver(jugador, casa) {
  const j = puntos(jugador).total
  const c = puntos(casa).total
  if (j > 21) return 'tePasaste'
  if (esBlackjack(jugador) && !esBlackjack(casa)) return 'blackjack'
  if (c > 21) return 'mePase'
  if (j > c) return 'ganas'
  if (j < c) return 'pierdes'
  return 'empate'
}

export const GANA = new Set(['blackjack', 'mePase', 'ganas'])
