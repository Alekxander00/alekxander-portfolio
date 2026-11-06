import { expect, it } from 'vitest'
import { ritmoHorda } from './horda'

it('de día salen pocos', () => expect(ritmoHorda(0)).toBe(0.5))
it('de noche diez veces más', () => expect(ritmoHorda(1)).toBe(5.5))
