import { describe, expect, it } from 'vitest'
import { crearCarta, paso, principiosDe, clasificarSoltar, IMPACTO_SACUDIDA, T_ESTALLA, PAUSA } from './fisica'

const L = { x: 0.5, z: 0.3 }

describe('vuelo libre', () => {
  it('el roce frena la carta', () => {
    const c = crearCarta()
    c.vx = 1
    paso(c, 0.016, 0, L)
    expect(c.vx).toBeLessThan(1)
    expect(c.x).toBeGreaterThan(0)
  })
  it('rebota en el borde invirtiendo y amortiguando la velocidad', () => {
    const c = crearCarta()
    c.x = 0.49
    c.vx = 2
    const ev = paso(c, 0.016, 0, L)
    expect(c.x).toBeLessThanOrEqual(0.5)
    expect(c.vx).toBeCloseTo(-2 * 0.55 * Math.exp(-2.4 * 0.016), 2)
    expect(ev[0]).toMatchObject({ tipo: 'rebote', normal: [1, 0] })
  })
  it('dt enorme se acota (pestaña que vuelve de segundo plano)', () => {
    const c = crearCarta()
    c.vx = 1
    paso(c, 30, 0, L)
    expect(Math.abs(c.x)).toBeLessThanOrEqual(L.x)
    expect(c.x).toBeLessThan(0.05)
  })
  it('limitar tras cambiar límites (girar el celular) la devuelve al paño', () => {
    const c = crearCarta()
    c.x = 0.5
    c.z = 0.3
    paso(c, 0.016, 0, { x: 0.2, z: 0.15 })
    expect(c.x).toBeLessThanOrEqual(0.2)
    expect(c.z).toBeLessThanOrEqual(0.15)
  })
})

describe('principios', () => {
  it('un rebote fuerte es sacudida; uno suave tras lanzar es inercia', () => {
    const c = crearCarta()
    c.lanzada = true
    expect(principiosDe([{ tipo: 'rebote', impacto: IMPACTO_SACUDIDA + 0.1 }], c)).toContain('sacudida')
    expect(principiosDe([{ tipo: 'rebote', impacto: 0.8 }], c)).toEqual(['inercia'])
  })
  it('estirar se detecta con k > 0.13 mientras se arrastra', () => {
    const c = crearCarta()
    c.k = 0.2
    c.arrastrando = true
    expect(principiosDe([], c)).toContain('estirar')
  })
  it('mantener apretada: pausa en T_ESTALLA y estallido tras PAUSA', () => {
    const c = crearCarta()
    c.sostener = { inicio: 0, fase: 'carga' }
    expect(paso(c, 0.016, T_ESTALLA, L).map((e) => e.tipo)).toContain('pausa')
    expect(paso(c, 0.016, T_ESTALLA + PAUSA + 0.01, L).map((e) => e.tipo)).toContain('estallido')
    expect(principiosDe([{ tipo: 'estallido' }], c)).toContain('hitstop')
  })
})

describe('clasificarSoltar', () => {
  it('toque corto voltea', () => expect(clasificarSoltar(0.1, false)).toBe('voltear'))
  it('arrastre lanza', () => expect(clasificarSoltar(0.5, true)).toBe('lanzar'))
  it('soltar a media carga no hace nada', () => expect(clasificarSoltar(0.8, false, 'carga')).toBe('nada'))
  it('tras el estallido no voltea', () => expect(clasificarSoltar(1.6, false, 'hecho')).toBe('nada'))
})
