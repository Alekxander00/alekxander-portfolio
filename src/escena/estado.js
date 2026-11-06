import { create } from 'zustand'

// Lo que comparten la escena 3D y el HTML de encima.
let timerAviso = 0

export const useEscena = create((set, get) => ({
  volteada: false,
  encontrados: [],
  aviso: null,
  sacudida: 0,
  pausada: false,
  // El botón accesible de la carta tiene el foco: la carta se resalta.
  foco: false,
  // Órdenes del botón accesible a la carta 3D (la carta las consume).
  orden: null,
  soltarFichas: () => {},
  // La mano
  palo: null,
  resaltada: null,
  abierta: null,
  abrir: () => {},
  // La Máquina y el blackjack
  golpesMaquina: 0,
  bj: null,
  secretaFuera: false,

  setVolteada: (v) => set({ volteada: v }),
  descubrir: (clave) => {
    if (get().encontrados.includes(clave)) return
    set((s) => ({ encontrados: [...s.encontrados, clave], aviso: clave }))
    clearTimeout(timerAviso)
    timerAviso = setTimeout(() => set({ aviso: null }), 5200)
  },
  sacudir: (fuerza) => set((s) => ({ sacudida: Math.max(s.sacudida, fuerza) })),
  setPausada: (v) => set({ pausada: v }),
  setFoco: (v) => set({ foco: v }),
  ordenar: (tipo, datos) => set({ orden: { tipo, datos, id: Math.random() } }),
  registrarFichas: (fn) => set({ soltarFichas: fn }),
  setPalo: (p) => set({ palo: p }),
  setResaltada: (id) => set({ resaltada: id }),
  setAbierta: (id) => set({ abierta: id }),
  registrarAbrir: (fn) => set({ abrir: fn }),
  golpear: () => set((s) => ({ golpesMaquina: s.golpesMaquina + 1 })),
  setBJ: (bj) => set({ bj }),
  setSecretaFuera: (v) => set({ secretaFuera: v }),
}))

// DEV: el estado de la escena a mano en la consola y en las pruebas.
if (import.meta.env?.DEV && typeof window !== 'undefined') window.__escena = useEscena
