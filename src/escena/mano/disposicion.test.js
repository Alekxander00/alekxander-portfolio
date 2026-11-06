import { describe, expect, it } from 'vitest'
import { posicionesMano, ANCHO_CARTA, LARGO_CARTA } from './disposicion'

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
  it('en celular van como mucho tres por fila y caben en 0.42 m de ancho', () => {
    const p = posicionesMano(8, true)
    const porFila = {}
    for (const c of p) porFila[c.z] = (porFila[c.z] || 0) + 1
    expect(Math.max(...Object.values(porFila))).toBe(3)
    for (const c of p) expect(Math.abs(c.x) + (ANCHO_CARTA * c.escala) / 2).toBeLessThan(0.21)
  })
  it('en celular las filas no se pisan y no salen del paño', () => {
    const p = posicionesMano(8, true)
    const filas = [...new Set(p.map((c) => c.z))].sort((a, b) => a - b)
    for (let i = 1; i < filas.length; i++) expect(filas[i] - filas[i - 1]).toBeGreaterThanOrEqual(LARGO_CARTA * 0.75)
    expect(filas.at(-1) + (LARGO_CARTA * 0.75) / 2).toBeLessThan(0.5)
  })
  it('el As es más grande', () => expect(posicionesMano(8, false)[0].escala).toBeGreaterThan(1))
  it('con un filtro de 1 carta, queda en el centro', () => expect(posicionesMano(1, false)[0].x).toBe(0))
})
