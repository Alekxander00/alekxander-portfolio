import { describe, expect, it } from 'vitest'
import { tirar } from './tirada'

// Un azar que devuelve los valores dados, uno por llamada.
const fijo = (...v) => {
  let i = 0
  return () => v[i++ % v.length]
}

describe('tirar', () => {
  it('saca un arcano entre 0 y 21', () => {
    for (let k = 0; k < 200; k++) {
      const { arcano } = tirar(null)
      expect(arcano).toBeGreaterThanOrEqual(0)
      expect(arcano).toBeLessThanOrEqual(21)
    }
  })
  it('nunca repite la carta anterior, aunque el azar caiga en ella', () => {
    for (let anterior = 0; anterior < 22; anterior++) {
      const caeEnElla = (anterior + 0.5) / 22
      expect(tirar(anterior, fijo(caeEnElla, 0.9)).arcano).not.toBe(anterior)
    }
  })
  it('sin carta anterior, cualquiera puede salir: el azar decide', () => {
    expect(tirar(null, fijo(0, 0.9)).arcano).toBe(0)
    expect(tirar(null, fijo(0.999, 0.9)).arcano).toBe(21)
  })
  it('sale invertida la mitad de las veces', () => {
    expect(tirar(null, fijo(0.1, 0.2)).invertida).toBe(true)
    expect(tirar(null, fijo(0.1, 0.7)).invertida).toBe(false)
  })
})
