import { describe, expect, it } from 'vitest'
import { ARCANOS } from './tarot'

const ROMANOS = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI']

describe('ARCANOS', () => {
  it('son los 22 arcanos mayores, del 0 al XXI', () => {
    expect(ARCANOS).toHaveLength(22)
    ARCANOS.forEach((a, i) => {
      expect(a.n).toBe(i)
      expect(a.romano).toBe(ROMANOS[i])
    })
  })
  it('cada uno tiene nombre y predicción al derecho e invertida, en español y en inglés', () => {
    for (const a of ARCANOS)
      for (const campo of ['nombre', 'derecho', 'invertido'])
        for (const idioma of ['es', 'en']) expect(a[campo]?.[idioma]?.trim().length, `${a.n} ${campo} ${idioma}`).toBeGreaterThan(0)
  })
  it('las dos predicciones de un arcano son distintas', () => {
    for (const a of ARCANOS) expect(a.derecho.es).not.toBe(a.invertido.es)
  })
  it('cada arcano tiene su propio emblema', () => {
    expect(new Set(ARCANOS.map((a) => a.emblema)).size).toBe(22)
  })
  it('el inglés es británico', () => {
    const us = /\b(color|favor|honor|center|realize|organize|behavior|neighbor|traveled|gray)\b/i
    for (const a of ARCANOS) for (const campo of ['nombre', 'derecho', 'invertido']) expect(a[campo].en).not.toMatch(us)
  })
})
