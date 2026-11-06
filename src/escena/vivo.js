// Valores que cambian cada fotograma y no deben provocar renders: la cámara los
// escribe y los objetos de la mesa los leen dentro de useFrame.
export const vivo = { progreso: 0, movil: false, boca: [0, 0.2, -0.72] }
