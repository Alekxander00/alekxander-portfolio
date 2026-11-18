import { afterEach, describe, expect, it, vi } from 'vitest'
import { enPartida, useEscena } from './estado'

afterEach(() => {
  vi.useRealTimers()
  useEscena.setState({ encontrados: [], aviso: null })
})

describe('descubrir', () => {
  it('ignora repetidos y deja el aviso del principio', () => {
    useEscena.getState().descubrir('estirar')
    useEscena.getState().descubrir('estirar')
    expect(useEscena.getState().encontrados).toEqual(['estirar'])
    expect(useEscena.getState().aviso).toBe('estirar')
  })
  it('el aviso se limpia a los 5200 ms', () => {
    vi.useFakeTimers()
    useEscena.getState().descubrir('hitstop')
    vi.advanceTimersByTime(5199)
    expect(useEscena.getState().aviso).toBe('hitstop')
    vi.advanceTimersByTime(2)
    expect(useEscena.getState().aviso).toBe(null)
  })
})

describe('enPartida', () => {
  afterEach(() => useEscena.setState({ bj: null, tarot: null }))
  it('la Máquina está en partida con blackjack o con tarot en la mesa', () => {
    expect(enPartida(useEscena.getState())).toBe(false)
    useEscena.getState().setTarot({ arcano: 17, invertida: false, id: 't1' })
    expect(enPartida(useEscena.getState())).toBe(true)
    useEscena.getState().setTarot(null)
    useEscena.getState().setBJ({ jugador: [], casa: [], ocultar: true })
    expect(enPartida(useEscena.getState())).toBe(true)
  })
})
