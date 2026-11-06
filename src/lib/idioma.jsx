import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Español por defecto; inglés británico como segunda lengua.
const IdiomaCtx = createContext(null)

function leerGuardado() {
  try {
    const v = localStorage.getItem('idioma')
    if (v === 'es' || v === 'en') return v
  } catch {
    /* sin almacenamiento: seguimos con el idioma del navegador */
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(leerGuardado)

  useEffect(() => {
    document.documentElement.lang = idioma === 'es' ? 'es' : 'en-GB'
    try {
      localStorage.setItem('idioma', idioma)
    } catch {
      /* no pasa nada si no se guarda */
    }
  }, [idioma])

  const t = useCallback(
    (v) => {
      if (v == null) return ''
      if (typeof v === 'string' || Array.isArray(v)) return v
      return v[idioma] ?? v.es
    },
    [idioma],
  )

  const valor = useMemo(() => ({ idioma, setIdioma, t }), [idioma, t])
  return <IdiomaCtx.Provider value={valor}>{children}</IdiomaCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useIdioma() {
  return useContext(IdiomaCtx)
}
