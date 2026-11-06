// Física de la carta de entrada sobre el paño (plano XZ, metros y m/s).
// Es la de la v1 pasada de píxeles a metros. Sin React ni three: se prueba sola.

export const T_TOQUE = 0.22 // s: menos que esto sin moverse es un clic
export const T_CARGA = 0.45 // s: desde aquí tiembla
export const T_ESTALLA = 1.3 // s: aquí se congela (hitstop)
export const PAUSA = 0.15 // s: duración del congelado
export const IMPACTO_SACUDIDA = 3.2 // m/s contra el borde: tiembla la cámara
export const IMPACTO_REBOTE = 0.45 // m/s: rebote que se nota
export const ROCE = 2.4
export const REBOTE = 0.55
export const DT_MAX = 0.033
const VEL_ESTIRA = 2 // m/s a la que el estirado llega a su máximo
const K_MAX = 0.3

export function crearCarta() {
  return {
    x: 0, z: 0, vx: 0, vz: 0,
    rot: 0, w: 0,
    k: 0, angK: 0, q: 0, angQ: 0,
    sostener: null, pausaHasta: 0, temblor: 0,
    lanzada: false, arrastrando: false,
  }
}

// Avanza la carta dt segundos. Devuelve los eventos que pasaron en este paso.
export function paso(c, dt, ahora, limites) {
  const eventos = []
  dt = Math.min(DT_MAX, Math.max(0, dt))

  // Mantener apretada: carga, congelado y estallido.
  const sos = c.sostener
  if (sos) {
    const t = ahora - sos.inicio
    if (sos.fase === 'carga') {
      c.temblor = t > T_CARGA ? Math.min(1, (t - T_CARGA) / (T_ESTALLA - T_CARGA)) : 0
      if (t >= T_ESTALLA) {
        sos.fase = 'pausa'
        c.pausaHasta = ahora + PAUSA
        c.temblor = 0
        eventos.push({ tipo: 'pausa' })
      }
    } else if (sos.fase === 'pausa' && ahora >= c.pausaHasta) {
      sos.fase = 'hecho'
      c.q = 0.28
      c.angQ = Math.PI / 2
      eventos.push({ tipo: 'estallido' })
    }
  }
  if (ahora < c.pausaHasta) return eventos

  if (!c.arrastrando) {
    c.x += c.vx * dt
    c.z += c.vz * dt
    const roce = Math.exp(-ROCE * dt)
    c.vx *= roce
    c.vz *= roce
    if (Math.hypot(c.vx, c.vz) < 0.006) {
      c.vx = 0
      c.vz = 0
    }
    c.rot += c.w * dt
    c.w *= Math.exp(-3 * dt)
  }

  // Bordes del paño (también corrige si los límites encogieron).
  const bordes = [
    ['x', 'vx', limites.x, [1, 0]],
    ['z', 'vz', limites.z, [0, 1]],
  ]
  for (const [eje, vel, lim, normal] of bordes) {
    if (Math.abs(c[eje]) > lim) {
      c[eje] = Math.sign(c[eje]) * lim
      const impacto = Math.abs(c[vel])
      c[vel] = -c[vel] * REBOTE
      if (impacto > IMPACTO_REBOTE) {
        c.q = Math.min(0.3, impacto / 12)
        c.angQ = Math.atan2(normal[1], normal[0])
      }
      eventos.push({ tipo: 'rebote', impacto, normal, punto: [c.x, c.z] })
    }
  }
  if (c.vx === 0 && c.vz === 0) c.lanzada = false

  // Squash & stretch según la velocidad.
  const vel = Math.hypot(c.vx, c.vz)
  const objetivo = Math.min(K_MAX, (vel / VEL_ESTIRA) * K_MAX)
  c.k += (objetivo - c.k) * Math.min(1, dt * 16)
  if (vel > 0.02) c.angK = Math.atan2(c.vz, c.vx)
  c.q *= Math.exp(-9 * dt)
  return eventos
}

export function principiosDe(eventos, c) {
  const hallados = new Set()
  if (c.arrastrando && c.k > 0.13) hallados.add('estirar')
  for (const e of eventos) {
    if (e.tipo === 'estallido') hallados.add('hitstop')
    if (e.tipo !== 'rebote') continue
    if (e.impacto > IMPACTO_SACUDIDA) hallados.add('sacudida')
    else if (e.impacto > IMPACTO_REBOTE && c.lanzada) hallados.add('inercia')
  }
  return [...hallados]
}

// Qué significa soltar la carta.
export function clasificarSoltar(duracion, arrastro, fase) {
  if (fase === 'pausa' || fase === 'hecho') return 'nada'
  if (arrastro) return 'lanzar'
  return duracion < T_TOQUE ? 'voltear' : 'nada'
}
