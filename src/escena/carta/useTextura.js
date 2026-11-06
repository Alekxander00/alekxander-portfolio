import { useEffect, useRef, useState } from 'react'

// Crea una textura con una función asíncrona. La anterior se libera cuando llega
// la nueva (p. ej. al cambiar de idioma) y la última, al desmontar el componente.
export function useTextura(crear, deps) {
  const [textura, setTextura] = useState(null)
  const actual = useRef(null)
  useEffect(() => {
    let vigente = true
    crear().then((tx) => {
      if (!vigente) return tx.dispose()
      actual.current?.dispose()
      actual.current = tx
      setTextura(tx)
    })
    return () => {
      vigente = false
    }
    // las dependencias las decide quien llama
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  useEffect(
    () => () => {
      actual.current?.dispose()
      actual.current = null
    },
    [],
  )
  return textura
}
