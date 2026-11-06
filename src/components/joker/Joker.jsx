import { useState } from 'react'
import { useIdioma } from '../../lib/idioma'
import { perfil } from '../../content/perfil'
import { T } from '../../content/textos'
import { useCon3D } from '../../lib/con3D'
import './joker.css'

export default function Joker() {
  const { t } = useIdioma()
  const con3D = useCon3D()
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(perfil.correo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      window.location.href = `mailto:${perfil.correo}`
    }
  }

  return (
    <section className={con3D ? 'joker-sec parada joker-sec--mesa' : 'joker-sec'} id="joker" data-parada="joker" aria-labelledby="joker-titulo">
      <div className="joker-sec__carta" aria-hidden="true">
        <span className="joker-sec__palo">JOKER</span>
        <span className="joker-sec__tela" />
      </div>

      <div className="joker-sec__texto">
        <h2 id="joker-titulo" className="joker-sec__titulo">
          {t(T.joker)}
        </h2>
        <p className="joker-sec__nombre">
          {perfil.nombreCompleto} · {t(perfil.lugar)}
        </p>
        {t(perfil.sobreMi).map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <h3 className="joker-sec__sub">{t(T.herramientas)}</h3>
        <p className="joker-sec__herramientas">{perfil.herramientas.join(' · ')}</p>

        <div className="joker-sec__contacto">
          <a className="boton boton--marfil" href={`mailto:${perfil.correo}`}>
            {t(T.escribeme)}: {perfil.correo}
          </a>
          <button type="button" className="boton" onClick={copiar} aria-live="polite">
            {copiado ? t(T.copiado) : t(T.copiar)}
          </button>
        </div>

        <ul className="joker-sec__lista">
          {perfil.cv.map((c) => (
            <li key={c.href}>
              <a href={c.href} download>
                {t(c.texto)}
              </a>{' '}
              <span>{t(c.nota)}</span>
            </li>
          ))}
          {perfil.redes.map((r) => (
            <li key={r.href}>
              <a href={r.href} target="_blank" rel="noreferrer">
                {r.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
