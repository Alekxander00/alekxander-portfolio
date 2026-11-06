// Quién es el Joker. Datos tomados del CV y de las redes que ya enlazaba el sitio anterior.
export const perfil = {
  nombre: 'Alekxander',
  nombreCompleto: 'Mauricio Alekxander',
  oficio: {
    es: 'Hago videojuegos y webs que se pueden jugar.',
    en: 'I make games, and websites you can play with.',
  },
  lugar: { es: 'Tunja, Boyacá · Colombia', en: 'Tunja, Boyacá · Colombia' },
  sobreMi: {
    es: [
      'Estudio Ingeniería en Multimedia en la Universidad de Boyacá y trabajo como desarrollador full stack freelance desde 2024. Antes, técnico en sistemas en el SENA.',
      'Lo que más me gusta es que las cosas se sientan bien al tocarlas: el peso de un golpe, el rebote de una carta, una interfaz que se entiende sin leer el manual. Por eso esta web se descubre jugando, igual que mis juegos.',
      'Fuera del código: fotografía, video y modelado 3D.',
    ],
    en: [
      'I study Multimedia Engineering at the Universidad de Boyacá and have worked as a freelance full-stack developer since 2024. Before that, I trained as a systems technician at SENA.',
      'What I enjoy most is making things feel good to touch: the weight of a hit, the bounce of a card, an interface you understand without reading a manual. That is why this site is discovered by playing, like my games.',
      'Away from code: photography, video and 3D modelling.',
    ],
  },
  herramientas: ['Unity', 'C#', 'Unreal', 'React', 'JavaScript', 'Node', 'PostgreSQL', 'Blockbench', 'Blender', 'Figma', 'DaVinci Resolve'],
  correo: 'alekxander450@gmail.com',
  redes: [
    { nombre: 'GitHub', href: 'https://github.com/Alekxander00' },
    { nombre: 'LinkedIn', href: 'https://www.linkedin.com/in/alekxander-ordo%C3%B1ez-2797133b7/' },
    { nombre: 'Instagram', href: 'https://www.instagram.com/alekxander____/' },
  ],
  cv: [
    { texto: { es: 'CV con diseño', en: 'Designed CV' }, href: '/cv-estilizado.pdf', nota: { es: 'PDF, en español', en: 'PDF, in Spanish' } },
    { texto: { es: 'CV para ATS', en: 'ATS-friendly CV' }, href: '/cv-ats.pdf', nota: { es: 'PDF, texto plano', en: 'PDF, plain text' } },
  ],
}

// La carta que escupe la Máquina cuando le ganas.
export const cartaSecreta = {
  titulo: { es: 'La Máquina', en: 'The Machine' },
  texto: {
    es: [
      'Me hiciste en Blockbench, por grupos: caja, cristal, portal y boca. Cada grupo es un hueso que se anima solo.',
      'Esta web no usa una copia exportada: lee mi archivo .bbmodel original y reproduce las mismas animaciones que tengo en Baluarte.',
      'Mi voz no tiene palabras. Cuento las letras de lo que digo y suelto una sílaba por cada dos; si exclamo, subo el tono.',
      'En el juego vendo torretas. Aquí solo reparto cartas. Y pierdo, a veces.',
    ],
    en: [
      'You built me in Blockbench, in groups: case, glass, portal and mouth. Each group is a bone that animates on its own.',
      'This site does not use an exported copy: it reads my original .bbmodel file and plays the same animations I have in Baluarte.',
      'My voice has no words. I count the letters of what I say and let out one syllable for every two; when I exclaim, my pitch goes up.',
      'In the game I sell turrets. Here I only deal cards. And I lose, sometimes.',
    ],
  },
}
