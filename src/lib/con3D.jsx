import { createContext, useContext } from 'react'

// ¿Se está usando la mesa 3D? El caso de estudio lo mira para elegir prueba 3D o plana.
const Con3D = createContext(false)
export const Con3DProvider = Con3D.Provider

 
export function useCon3D() {
  return useContext(Con3D)
}
