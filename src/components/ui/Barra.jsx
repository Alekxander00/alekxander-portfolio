import { useEffect, useState } from 'react'
import { useIdioma } from '../../lib/idioma'
import { alCambiarSilencio, despertarAudio, estaSilenciado, setSilencio } from '../../lib/sonido'
import { T } from '../../content/textos'
import './barra.css'

export default function Barra() {
  const { t, idioma, setIdioma } = useIdioma()
  const [silencio, setSil] = useState(estaSilenciado)

  useEffect(() => alCambiarSilencio(setSil), [])

  return (
    <header className="barra">
      <a className="barra__saltar" href="#mano">
        {t(T.saltar)}
      </a>
      <a className="barra__marca" href="#top" aria-label="Alekxander">
        <span className="barra__tela" aria-hidden="true" />
      </a>
      <nav className="barra__acciones" aria-label={t({ es: 'Ajustes', en: 'Settings' })}>
        <button
          type="button"
          className="barra__boton"
          onClick={() => {
            despertarAudio()
            setSilencio(!silencio)
          }}
          aria-pressed={!silencio}
        >
          {silencio ? t(T.sonidoOff) : t(T.sonidoOn)}
        </button>
        <button
          type="button"
          className="barra__boton"
          onClick={() => setIdioma(idioma === 'es' ? 'en' : 'es')}
          title={t(T.idiomaEtiqueta)}
          lang={idioma === 'es' ? 'en-GB' : 'es'}
        >
          {t(T.idioma)}
        </button>
      </nav>
    </header>
  )
}
