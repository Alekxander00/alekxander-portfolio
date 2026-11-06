// La máquina de estados del movimiento del Museo.
export const REGLAS = {
  suelo: { saltar: 'aire', dash: 'dash' },
  aire: { dash: 'dash', pared: 'pared', planear: 'planeo' },
  dash: {},
  pared: { saltar: 'aire' },
  planeo: { planear: 'aire', dash: 'dash' },
}

// Lo que pasa solo si no haces nada: [destino (null = volver al anterior), ms].
export const SOLO = { aire: ['suelo', 1300], dash: [null, 320], pared: ['aire', 1600], planeo: ['suelo', 2400] }

export const transicion = (estado, accion) => REGLAS[estado]?.[accion] ?? null
