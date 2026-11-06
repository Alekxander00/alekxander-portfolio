// ¿Puede este navegador dibujar la mesa? Si no, se muestra la versión plana.
export function tieneWebGL(crearLienzo = () => document.createElement('canvas')) {
  try {
    const lienzo = crearLienzo()
    return Boolean(lienzo.getContext('webgl2') || lienzo.getContext('webgl'))
  } catch {
    return false
  }
}
