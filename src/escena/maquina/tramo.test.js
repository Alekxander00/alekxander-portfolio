import { describe, expect, it } from 'vitest'
import { recogerMano, recogerSecreta, TRAMO } from './tramo'

const dentro = (TRAMO[0] + TRAMO[1]) / 2

describe('cuándo vuelven las cartas a la boca de la Máquina', () => {
  it('fuera de la parada, todas', () => {
    expect(recogerMano(null, TRAMO[0] - 0.1)).toBe(true)
    expect(recogerSecreta(TRAMO[1] + 0.1)).toBe(true)
  })
  it('al cambiar de juego, la mano sí', () => expect(recogerMano({ recoger: true }, dentro)).toBe(true))
  it('dentro de la parada y sin cambiar de juego, la mano se queda', () => expect(recogerMano({ recoger: false }, dentro)).toBe(false))
  it('la carta secreta no depende del juego: dentro de la parada se queda', () => expect(recogerSecreta(dentro)).toBe(false))
})
