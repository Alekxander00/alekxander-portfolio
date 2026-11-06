import { create } from 'zustand'

// Lo que comparten la escena 3D y el HTML de encima.
let timerAviso = 0

export const useEscena = create((set, get) => ({
  volteada: false,
  encontrados: [],
  aviso: null,
  sacudida: 0,
  pausada: false,
  // Órdenes del botón accesible a la carta 3D (la carta las consume).
  orden: null,
  soltarFichas: () => {},

  setVolteada: (v) => set({ volteada: v }),
  descubrir: (clave) => {
    if (get().encontrados.includes(clave)) return
    set((s) => ({ encontrados: [...s.encontrados, clave], aviso: clave }))
    clearTimeout(timerAviso)
    timerAviso = setTimeout(() => set({ aviso: null }), 5200)
  },
  sacudir: (fuerza) => set((s) => ({ sacudida: Math.max(s.sacudida, fuerza) })),
  setPausada: (v) => set({ pausada: v }),
  ordenar: (tipo, datos) => set({ orden: { tipo, datos, id: Math.random() } }),
  registrarFichas: (fn) => set({ soltarFichas: fn }),
}))
