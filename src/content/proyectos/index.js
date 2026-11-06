import baluarte from './baluarte'
import sargazo from './sargazo'
import museo from './museo'
import theOthers from './the-others'
import cadence from './cadence'
import kinet from './kinet'
import salud from './salud'
import eclipse from './eclipse'

// El orden es el de la mano. El valor de la carta dice cuánto pesa el proyecto.
export const proyectos = [baluarte, sargazo, museo, theOthers, cadence, kinet, salud, eclipse]

export const PALOS = {
  picas: { simbolo: '♠', rojo: false, nombre: { es: 'Videojuegos', en: 'Games' } },
  diamantes: { simbolo: '♦', rojo: true, nombre: { es: 'Web interactiva', en: 'Interactive web' } },
  treboles: { simbolo: '♣', rojo: false, nombre: { es: 'Sistemas', en: 'Systems' } },
  corazones: { simbolo: '♥', rojo: true, nombre: { es: 'Arte y narrativa', en: 'Art and narrative' } },
}
