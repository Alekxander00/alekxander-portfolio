// Tramo del recorrido en que se ve la parada de la Máquina; fuera de él sus
// cartas vuelven a su boca y se ocultan.
export const TRAMO = [1.45, 2.5]

const fuera = (progreso) => progreso < TRAMO[0] || progreso > TRAMO[1]
// La mano del blackjack vuelve también al cambiar de juego (bj.recoger).
export const recogerMano = (bj, progreso) => Boolean(bj?.recoger) || fuera(progreso)
// La carta secreta solo se va cuando sales de la parada.
export const recogerSecreta = (progreso) => fuera(progreso)
