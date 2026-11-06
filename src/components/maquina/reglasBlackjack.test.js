import { expect, it } from 'vitest'
import { puntos, resolver, casaPide, esBlackjack } from './reglasBlackjack'

const c = (...v) => v.map((valor) => ({ valor, palo: 'picas' }))

it('el As vale 11 o 1', () => {
  expect(puntos(c('A', 'K')).total).toBe(21)
  expect(puntos(c('A', 'K', '5')).total).toBe(16)
})
it('la casa pide con 16 y se planta con 17', () => {
  expect(casaPide(c('10', '6'))).toBe(true)
  expect(casaPide(c('10', '7'))).toBe(false)
})
it('blackjack natural gana a 21 de tres cartas', () => expect(resolver(c('A', 'Q'), c('7', '7', '7'))).toBe('blackjack'))
it('pasarse pierde aunque la casa también se pase', () => expect(resolver(c('10', '9', '3'), c('10', '6', '9'))).toBe('tePasaste'))
it('casa pasada es victoria', () => expect(resolver(c('10', '8'), c('10', '6', '9'))).toBe('mePase'))
it('esBlackjack solo con dos cartas', () => expect(esBlackjack(c('7', '7', '7'))).toBe(false))
