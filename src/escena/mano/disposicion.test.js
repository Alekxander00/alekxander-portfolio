import { describe, expect, it } from 'vitest'
import { posicionesMano, ANCHO_CARTA } from './disposicion'

describe('posicionesMano', () => {
  it('da una posición por carta', () => expect(posicionesMano(8, false)).toHaveLength(8))
  it('en escritorio las cartas no se tapan más de un 20 %', () => {
    const p = posicionesMano(8, false)
    for (let i = 1; i < p.length; i++) expect(p[i].x - p[i - 1].x).toBeGreaterThan(ANCHO_CARTA * 0.8)
  })
  it('en escritorio el abanico está centrado', () => {
    const p = posicionesMano(8, false)
    expect(p[0].x + p[7].x).toBeCloseTo(0)
  })
  it('en celular son dos columnas que caben en 0.42 m de ancho', () => {
    const p = posicionesMano(8, true)
    expect(new Set(p.map((c) => c.x)).size).toBe(2)
    expect(Math.max(...p.map((c) => Math.abs(c.x))) + ANCHO_CARTA / 2).toBeLessThan(0.21)
  })
  it('el As es más grande', () => expect(posicionesMano(8, false)[0].escala).toBeGreaterThan(1))
  it('con un filtro de 1 carta, queda en el centro', () => expect(posicionesMano(1, false)[0].x).toBe(0))
})
