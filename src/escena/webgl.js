// ¿Puede este navegador dibujar la mesa? Si no, se muestra la versión plana.
export function tieneWebGL(crearLienzo = () => document.createElement('canvas')) {
  try {
    const lienzo = crearLienzo()
    const contexto = lienzo.getContext('webgl2') || lienzo.getContext('webgl')
    // Solo era una prueba: se suelta enseguida, el navegador da pocos contextos.
    contexto?.getExtension?.('WEBGL_lose_context')?.loseContext()
    return Boolean(contexto)
  } catch {
    return false
  }
}
