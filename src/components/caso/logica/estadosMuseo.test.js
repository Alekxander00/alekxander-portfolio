import { expect, it } from 'vitest'
import { transicion } from './estadosMuseo'

it('desde el suelo se salta', () => expect(transicion('suelo', 'saltar')).toBe('aire'))
it('no se planea desde el suelo', () => expect(transicion('suelo', 'planear')).toBe(null))
it('salto de pared', () => expect(transicion('pared', 'saltar')).toBe('aire'))
