import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useIdioma } from './lib/idioma'
import { despertarAudio } from './lib/sonido'
import { proyectos } from './content/proyectos'
import { cartaSecreta } from './content/perfil'
import { T } from './content/textos'
import Barra from './components/ui/Barra'
import Entrada from './components/entrada/Entrada'
import Mesa from './components/mesa/Mesa'
import Caso from './components/caso/Caso'
import Maquina from './components/maquina/Maquina'
import Joker from './components/joker/Joker'

const SECRETA = { id: 'secreta', valor: '★', palo: null, titulo: cartaSecreta.titulo }

// La carta abierta vive en el hash (#carta/baluarte): se puede compartir y el
// botón Atrás la cierra.
function leerHash() {
  const m = window.location.hash.match(/^#carta\/([\w-]+)$/)
  return m ? m[1] : null
}

export default function App() {
  const { t } = useIdioma()
  const [abierta, setAbierta] = useState(leerHash)

  useEffect(() => {
    const alCambiar = () => setAbierta(leerHash())
    window.addEventListener('popstate', alCambiar)
    window.addEventListener('hashchange', alCambiar)
    return () => {
      window.removeEventListener('popstate', alCambiar)
      window.removeEventListener('hashchange', alCambiar)
    }
  }, [])

  // El navegador no deja sonar nada hasta el primer gesto.
  useEffect(() => {
    const uno = () => despertarAudio()
    window.addEventListener('pointerdown', uno, { once: true })
    window.addEventListener('keydown', uno, { once: true })
    return () => {
      window.removeEventListener('pointerdown', uno)
      window.removeEventListener('keydown', uno)
    }
  }, [])

  const abrir = useCallback((id) => {
    history.pushState({ carta: id }, '', `#carta/${id}`)
    setAbierta(id)
  }, [])

  const cerrar = useCallback(() => {
    if (history.state?.carta) history.back()
    else {
      history.replaceState(null, '', window.location.pathname + window.location.search)
      setAbierta(null)
    }
  }, [])

  const proyecto = abierta === 'secreta' ? SECRETA : proyectos.find((p) => p.id === abierta)

  return (
    <>
      <Barra />
      <main id="top">
        <Entrada />
        <Mesa onAbrir={abrir} />
        <Maquina onAbrirSecreta={() => abrir('secreta')} />
        <Joker />
      </main>
      <footer className="pie">
        <p>{t(T.pie)}</p>
      </footer>
      <AnimatePresence>
        {proyecto && (
          <Caso
            key={proyecto.id}
            proyecto={proyecto}
            onCerrar={cerrar}
            secreto={abierta === 'secreta' ? cartaSecreta.texto : null}
          />
        )}
      </AnimatePresence>
    </>
  )
}
