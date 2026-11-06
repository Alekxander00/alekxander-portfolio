import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { soloVisibles } from './visibles'

const choque = (object) => ({ object, distance: 1 })

describe('soloVisibles', () => {
  it('deja pasar lo que se ve', () => {
    const m = new THREE.Mesh()
    expect(soloVisibles([choque(m)])).toHaveLength(1)
  })
  it('descarta un objeto oculto', () => {
    const m = new THREE.Mesh()
    m.visible = false
    expect(soloVisibles([choque(m)])).toEqual([])
  })
  it('descarta un objeto cuyo grupo padre está oculto (carta de la mano escondida)', () => {
    const grupo = new THREE.Group()
    const m = new THREE.Mesh()
    grupo.add(m)
    grupo.visible = false
    const otro = new THREE.Mesh()
    expect(soloVisibles([choque(m), choque(otro)]).map((c) => c.object)).toEqual([otro])
  })
})
