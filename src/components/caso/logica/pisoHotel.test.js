import { expect, it } from 'vitest'
import { ANCLAS, DECORACIONES, HABITACIONES, decorar, pisoInicial, siguienteNoche } from './pisoHotel'

it('seis anclas y seis habitaciones', () => {
  expect(ANCLAS).toHaveLength(6)
  expect(HABITACIONES.map((h) => h.id)).toEqual(['101', '102', '103', '104', '105', '106'])
})

it('la noche reparte las mismas habitaciones', () => {
  const { orden } = pisoInicial()
  expect([...siguienteNoche(orden)].sort()).toEqual([...orden].sort())
})

it('ninguna habitación repite ancla', () => {
  let orden = pisoInicial().orden
  for (let i = 0; i < 200; i++) {
    const nuevo = siguienteNoche(orden)
    nuevo.forEach((id, a) => expect(id).not.toBe(orden[a]))
    orden = nuevo
  }
})

it('tampoco con azar en los extremos', () => {
  const { orden } = pisoInicial()
  for (const v of [0, 0.9999]) siguienteNoche(orden, () => v).forEach((id, a) => expect(id).not.toBe(orden[a]))
})

it('no muta el orden de entrada', () => {
  const { orden } = pisoInicial()
  const copia = [...orden]
  siguienteNoche(orden)
  expect(orden).toEqual(copia)
})

it('decorar cicla solo esa habitación y vuelve al principio', () => {
  const { deco } = pisoInicial()
  const d = decorar(deco, '101')
  expect(d['101']).toBe('retrato')
  expect({ ...d, 101: deco['101'] }).toEqual(deco)
  expect(decorar(deco, '106')['106']).toBe(DECORACIONES[0].id)
  expect(deco['101']).toBe('vela')
})
