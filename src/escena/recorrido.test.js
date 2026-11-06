import { describe, expect, it } from 'vitest'
import { PARADAS, camaraEn, progresoDeScroll } from './recorrido'

describe('progresoDeScroll', () => {
  const inicios = [0, 800, 2400, 3400]
  it('vale 0 arriba del todo', () => expect(progresoDeScroll(0, inicios)).toBe(0))
  it('vale 1 justo en la mano', () => expect(progresoDeScroll(800, inicios)).toBe(1))
  it('interpola a mitad de camino', () => expect(progresoDeScroll(1600, inicios)).toBeCloseTo(1.5))
  it('no pasa de la última parada', () => expect(progresoDeScroll(9999, inicios)).toBe(3))
  it('no baja de 0 con scroll negativo (rebote de iOS)', () => expect(progresoDeScroll(-120, inicios)).toBe(0))
})

describe('camaraEn', () => {
  it('en una parada exacta devuelve sus valores', () => {
    expect(camaraEn(1, false, false).pos).toEqual(PARADAS[1].pos)
  })
  it('usa los valores móviles en celular', () => {
    expect(camaraEn(0, true, false).pos).toEqual(PARADAS[0].posMovil)
  })
  it('suaviza entre paradas (smoothstep): a 0.25 avanza menos de un cuarto', () => {
    const a = PARADAS[0].pos[1]
    const b = PARADAS[1].pos[1]
    const y = camaraEn(0.25, false, false).pos[1]
    expect(Math.abs(y - a)).toBeLessThan(Math.abs(b - a) * 0.25)
  })
  it('con movimiento reducido salta a la parada más cercana', () => {
    expect(camaraEn(1.4, false, true).pos).toEqual(PARADAS[1].pos)
    expect(camaraEn(1.6, false, true).pos).toEqual(PARADAS[2].pos)
  })
})
