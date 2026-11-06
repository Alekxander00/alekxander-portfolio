import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useIdioma } from './lib/idioma'
import { despertarAudio } from './lib/sonido'
import { proyectos } from './content/proyectos'
import { cartaSecreta } from './content/perfil'
import { T } from './content/textos'
import Barra from './components/ui/Barra'
import EntradaMesa from './components/entrada/EntradaMesa'
import Entrada from './components/entrada/Entrada'
import { tieneWebGL } from './escena/webgl'
import LimiteError from './escena/LimiteError'
import Mesa from './components/mesa/Mesa'
import Caso from './components/caso/Caso'
import Maquina from './components/maquina/Maquina'
import Joker from './components/joker/Joker'
import ManoHTML from './components/mesa/ManoHTML'
import MaquinaHTML from './components/maquina/MaquinaHTML'
import { useEscena } from './escena/estado'
import { Con3DProvider } from './lib/con3D'

// three.js (~220 KB comprimido) llega en su propio paquete: el texto se pinta
// enseguida y la mesa aparece en cuanto se descarga. Si falla, LimiteError deja
// la versión plana.
const Escena = lazy(() => import('./escena/Escena'))

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
  // Sin WebGL (o si se pierde el contexto) se queda la versión plana.
  const [con3D, setCon3D] = useState(tieneWebGL)

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

  // La mesa sabe qué caso está abierto, se pausa mientras tanto y puede abrir casos.
  useEffect(() => {
    useEscena.getState().registrarAbrir(abrir)
  }, [abrir])
  useEffect(() => {
    useEscena.getState().setAbierta(abierta)
    useEscena.getState().setPausada(con3D && Boolean(abierta))
  }, [abierta, con3D])

  const proyecto = abierta === 'secreta' ? SECRETA : proyectos.find((p) => p.id === abierta)

  return (
    <Con3DProvider value={con3D}>
      {con3D && (
        <LimiteError onError={() => setCon3D(false)}>
          <Suspense fallback={null}>
            <Escena onPerdida={() => setCon3D(false)} />
          </Suspense>
        </LimiteError>
      )}
      <Barra />
      <main id="top">
        {con3D ? <EntradaMesa /> : <Entrada />}
        {con3D ? <ManoHTML onAbrir={abrir} /> : <Mesa onAbrir={abrir} />}
        {con3D ? <MaquinaHTML onAbrirSecreta={() => abrir('secreta')} /> : <Maquina onAbrirSecreta={() => abrir('secreta')} />}
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
    </Con3DProvider>
  )
}
