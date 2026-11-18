export default {
  id: 'hotel-insomnio',
  palo: 'picas',
  valor: '7',
  titulo: 'Hotel Insomnio',
  imagen: null,
  linea: {
    es: 'Juego de gestión cozy con sustos cómicos, en 3D y primera persona: eres el recepcionista nocturno de un hotel gótico de los 90. De noche el hotel se rompe; de día lo arreglas y lo haces tuyo.',
    en: 'A cosy management game with comic scares, in 3D and first person: you are the night clerk of a gothic 90s hotel. By night the hotel falls apart; by day you mend it and make it yours.',
  },
  rol: {
    es: 'Diseñé el juego completo y dirigí su desarrollo: documento de diseño, documento técnico y la hoja de datos de la que sale todo el juego.',
    en: 'I designed the whole game and led its development: the design document, the technical document and the data sheet the whole game is built from.',
  },
  ficha: [
    { k: { es: 'Motor', en: 'Engine' }, v: 'Unity 6 · URP' },
    { k: { es: 'Estado', en: 'Status' }, v: { es: 'Prototipo jugable', en: 'Playable prototype' } },
  ],
  resolvio: {
    es: [
      'Pisos procedurales con anclas fijas que se reorganizan cada noche. La decoración pertenece a la habitación, no a un punto del mapa, así que viaja con ella.',
      'Un ciclo noche, amanecer y día con economía completa: estancias, propinas, reseñas que mueven las estrellas y facturas que te cortan servicios sin llegar al game over.',
      'Todos los datos salen de una hoja de cálculo que se exporta a ScriptableObjects, y todos los textos van en español y en inglés.',
      'Una interfaz física: una libreta en las manos y un reloj de pulsera en lugar de menús en pantalla.',
    ],
    en: [
      'Procedural floors with fixed anchors that rearrange themselves every night. Decoration belongs to the room, not to a spot on the map, so it travels with it.',
      'A night, dawn and day cycle with a full economy: stays, tips, reviews that move the star rating and bills that cut off services without a game over.',
      'All the data comes from a spreadsheet exported to ScriptableObjects, and every line of text is in Spanish and English.',
      'A physical HUD: a notebook in your hands and a wristwatch instead of on-screen menus.',
    ],
  },
  widget: 'piso',
  antesDespues: null,
  enlaces: [],
}
