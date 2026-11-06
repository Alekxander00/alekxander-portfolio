import { afterEach, describe, expect, it, vi } from 'vitest'
import { useEscena } from './estado'

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
