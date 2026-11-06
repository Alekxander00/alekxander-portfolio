import { describe, expect, it } from 'vitest'
import { crearCaida, soltarDesde, despegar, pasoCaida, ALTURA_CIELO } from './caida'

// Avanza la caída a 60 fps y junta los eventos.
function correr(s, segundos, desde = 0) {
  const eventos = []
  let ahora = desde
  for (let i = 0; i < segundos * 60; i++) {
    ahora += 1 / 60
    eventos.push(...pasoCaida(s, 1 / 60, ahora).map((e) => ({ ...e, ahora })))
  }
  return eventos
}

describe('caída del cielo', () => {
  it('empieza fuera de la mesa', () => expect(crearCaida().fase).toBe('fuera'))
  it('al soltarla cae, se estira mientras cae y aterriza con un solo impacto', () => {
    const s = crearCaida()
    soltarDesde(s)
    expect(s.y).toBe(ALTURA_CIELO)
    correr(s, 0.25)
    expect(s.fase).toBe('cayendo')
    expect(s.k).toBeGreaterThan(0.1)
    const ev = correr(s, 2, 0.25)
    expect(ev.filter((e) => e.tipo === 'impacto')).toHaveLength(1)
    expect(s.fase).toBe('posada')
    expect(s.y).toBe(0)
  })
  it('al tocar la mesa se congela un instante (hitstop) y luego se aplasta', () => {
    const s = crearCaida()
    soltarDesde(s)
    const ev = correr(s, 2)
    const t = ev.find((e) => e.tipo === 'impacto').ahora
    const s2 = crearCaida()
    soltarDesde(s2)
    correr(s2, t + 0.02)
    expect(s2.fase).toBe('hitstop')
    correr(s2, 0.1, t + 0.02)
    expect(s2.fase).toBe('posada')
    expect(s2.q).toBeGreaterThan(0.05)
  })
  it('al despegar se agacha primero (anticipación) y luego sube hasta salir', () => {
    const s = crearCaida()
    soltarDesde(s)
    correr(s, 2)
    despegar(s, 2)
    correr(s, 0.05, 2)
    expect(s.fase).toBe('agachada')
    expect(s.q).toBeGreaterThan(0)
    correr(s, 2, 2.05)
    expect(s.fase).toBe('fuera')
  })
})
