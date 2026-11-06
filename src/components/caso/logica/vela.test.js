import { expect, it } from 'vitest'
import { empuje, aperturaBotavara, ZONA_MUERTA } from './vela'

it('zona muerta de frente', () => {
  expect(empuje(0)).toBe(0)
  expect(empuje(ZONA_MUERTA - 1)).toBe(0)
  expect(empuje(-30)).toBe(0)
})
it('máximo de través', () => {
  expect(empuje(90)).toBe(1)
  expect(empuje(-120)).toBe(1)
})
it('de popa empuja 0.65', () => expect(empuje(180)).toBeCloseTo(0.65))
it('la vela se cierra en la zona muerta', () => expect(aperturaBotavara(10)).toBe(0))
