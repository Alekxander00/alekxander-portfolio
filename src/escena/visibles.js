// three.js no mira `visible` al buscar qué hay bajo el puntero: sin este filtro,
// una carta escondida (la mano al ver el Joker) seguía recibiendo clics.
function seVe(objeto) {
  for (let o = objeto; o; o = o.parent) if (!o.visible) return false
  return true
}

export function soloVisibles(choques) {
  return choques.filter((c) => seVe(c.object))
}
