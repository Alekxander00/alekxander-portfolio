export default {
  id: 'museo',
  palo: 'picas',
  valor: 'Q',
  titulo: { es: 'El Museo de las Emociones Perdidas', en: 'The Museum of Lost Emotions' },
  imagen: '/images/museo.webp',
  imagenAlt: {
    es: 'Escena de pruebas del Museo: el personaje en blocking, una cápsula, sobre un suelo gris.',
    en: 'Museum test scene: the blocking character, a capsule, on a grey floor.',
  },
  linea: {
    es: 'Metroidvania 3D. Nicol, restauradora de arte, cae en un museo de mundos literarios que el Olvido Gris se está comiendo.',
    en: 'A 3D metroidvania. Nicol, an art restorer, falls into a museum of literary worlds being eaten by the Grey Oblivion.',
  },
  rol: { es: 'Proyecto personal. Diseño, GDD y programación.', en: 'Personal project. Design, GDD and programming.' },
  ficha: [
    { k: { es: 'Motor', en: 'Engine' }, v: 'Unity · URP · Cinemachine' },
    { k: { es: 'Estado', en: 'Status' }, v: { es: 'Mundo 1 en desarrollo', en: 'World 1 in development' } },
  ],
  resolvio: {
    es: [
      'Movimiento completo sobre una máquina de estados: salto con coyote time y buffer, dash en suelo y aire, carrera por pared, planeo, slide y golpe al suelo.',
      'Combate con combo de tres golpes, proyectil de tinta cargado y parry con ventana de 0,2 s.',
      'Medidor de Inspiración: encadenar acciones sin recibir daño potencia al personaje.',
      'Lienzos como puntos de guardado y viaje rápido.',
    ],
    en: [
      'Full movement on a state machine: jump with coyote time and buffering, ground and air dash, wall run, glide, slide and ground pound.',
      'Combat with a three-hit combo, a charged ink shot and a parry with a 0.2 s window.',
      'Inspiration meter: chaining actions without taking damage powers the character up.',
      'Canvases as save points and fast travel.',
    ],
  },
  widget: 'estados',
  antesDespues: null,
  enlaces: [],
}
