import { describe, expect, it } from 'vitest'
import { EMBLEMAS, TAROT } from './caraTarot'
import { ARCANOS } from '../content/tarot'

describe('caraTarot', () => {
  it('sabe dibujar el emblema de cada arcano', () => {
    for (const a of ARCANOS) expect(typeof EMBLEMAS[a.emblema], a.emblema).toBe('function')
  })
  it('tiene la proporción de una carta de tarot, más alta que un naipe', () => {
    expect(TAROT.H / TAROT.W).toBeGreaterThan(1.6)
    expect(TAROT.H / TAROT.W).toBeLessThan(1.8)
  })
})
