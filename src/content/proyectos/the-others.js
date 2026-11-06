export default {
  id: 'the-others',
  palo: 'picas',
  valor: '10',
  titulo: 'The Others',
  imagen: null,
  linea: {
    es: 'Metroidvania 2.5D: escenarios en 3D y movimiento atado al plano XY, repartido en tres capas de juego.',
    en: 'A 2.5D metroidvania: 3D environments with movement locked to the XY plane, spread across three gameplay layers.',
  },
  rol: { es: 'Programación de la arquitectura y los sistemas.', en: 'Architecture and systems programming.' },
  ficha: [
    { k: { es: 'Motor', en: 'Engine' }, v: 'Unity' },
    { k: { es: 'Estado', en: 'Status' }, v: { es: 'Arquitectura base', en: 'Base architecture' } },
  ],
  resolvio: {
    es: [
      'Módulos repartidos como en Unreal: un manager por responsabilidad, comunicados por eventos e interfaces, nunca buscándose componentes.',
      'Todo el ajuste vive en datos: habilidades, perfiles de vida, estados alterados, karma y lo que puede hacer cada enemigo.',
      'Enemigos separados en cuerpo (caminar, volar, atacar) y cerebro (patrullar, investigar, huir), combinables entre sí.',
    ],
    en: [
      'Modules split the way an Unreal project is: one manager per concern, talking through events and interfaces, never by looking up components.',
      'All tuning lives in data: abilities, health profiles, status effects, karma and what each enemy can do.',
      'Enemies split into body (walk, fly, attack) and brain (patrol, investigate, flee), mixable with each other.',
    ],
  },
  widget: 'plano',
  antesDespues: null,
  enlaces: [],
}
