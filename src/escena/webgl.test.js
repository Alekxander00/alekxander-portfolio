import { describe, expect, it } from 'vitest'
import { tieneWebGL } from './webgl'

const lienzoCon = (contextos) => () => ({ getContext: (tipo) => (contextos.includes(tipo) ? {} : null) })

describe('tieneWebGL', () => {
  it('sí con webgl2', () => expect(tieneWebGL(lienzoCon(['webgl2']))).toBe(true))
  it('sí con webgl 1 aunque no haya webgl2', () => expect(tieneWebGL(lienzoCon(['webgl']))).toBe(true))
  it('no si ninguno responde', () => expect(tieneWebGL(lienzoCon([]))).toBe(false))
  it('no si crear el contexto lanza un error', () => {
    const roto = () => ({
      getContext: () => {
        throw new Error('bloqueado')
      },
    })
    expect(tieneWebGL(roto)).toBe(false)
  })
})
