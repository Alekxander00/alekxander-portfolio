import { useState } from 'react'
import { useIdioma } from '../../lib/idioma'
import { T } from '../../content/textos'

// Del blocking a la versión final. Se arrastra la línea o se usan las flechas.
export default function AntesDespues({ antes, despues, alt, etiquetas }) {
  const { t } = useIdioma()
  const [corte, setCorte] = useState(50)
  return (
    <figure className="antes-despues">
      <div className="antes-despues__marco" style={{ '--corte': `${corte}%` }}>
        <img src={despues} alt={t(alt?.despues) || ''} width="1600" height="900" loading="lazy" />
        <img className="antes-despues__antes" src={antes} alt={t(alt?.antes) || ''} width="1600" height="900" loading="lazy" />
        <span className="antes-despues__linea" aria-hidden="true" />
        <input
          className="antes-despues__control"
          type="range"
          min="0"
          max="100"
          value={corte}
          onChange={(e) => setCorte(Number(e.target.value))}
          aria-label={`${t(etiquetas?.antes ?? T.antes)} / ${t(etiquetas?.despues ?? T.despues)}`}
        />
      </div>
      <figcaption className="antes-despues__pie">
        <span>{t(etiquetas?.antes ?? T.antes)}</span>
        <span>{t(etiquetas?.despues ?? T.despues)}</span>
      </figcaption>
    </figure>
  )
}
