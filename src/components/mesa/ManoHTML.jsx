import { useIdioma } from '../../lib/idioma'
import { sonar } from '../../lib/sonido'
import { useEscena } from '../../escena/estado'
import { PALOS, proyectos } from '../../content/proyectos'
import { T } from '../../content/textos'
import './mesa.css'
import './mano-html.css'

// La mano cuando las cartas viven en la mesa 3D: aquí quedan el título, los
// palos para filtrar y un botón accesible por carta (Tab la resalta en la mesa).
export default function ManoHTML({ onAbrir }) {
  const { t } = useIdioma()
  const palo = useEscena((s) => s.palo)
  const setPalo = useEscena((s) => s.setPalo)
  const setResaltada = useEscena((s) => s.setResaltada)
  const visibles = proyectos.filter((p) => !palo || p.palo === palo)

  return (
    <section className="mano-html parada" id="mano" data-parada="mano" aria-labelledby="mano-titulo">
      <div className="mesa__cabeza mano-html__cabeza">
        <h2 id="mano-titulo" className="mesa__titulo">
          {t(T.mano)}
        </h2>
        <div className="palos" role="group" aria-label={t(T.filtro)}>
          {Object.entries(PALOS).map(([clave, info]) => (
            <button
              key={clave}
              type="button"
              className={`palos__boton ${info.rojo ? 'palos__boton--rojo' : ''}`}
              aria-pressed={palo === clave}
              onClick={() => {
                sonar('cambio', { volumen: 0.4 })
                setPalo(palo === clave ? null : clave)
              }}
            >
              <span aria-hidden="true" className="palos__simbolo">
                {info.simbolo}
              </span>
              <span className="palos__nombre">{t(info.nombre)}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="mano-html__lista">
        {visibles.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className="solo-lector mano-html__carta"
              onFocus={() => setResaltada(p.id)}
              onBlur={() => setResaltada(null)}
              onClick={() => onAbrir(p.id)}
            >
              {`${p.valor} ${PALOS[p.palo].simbolo} · ${t(p.titulo)}. ${t(p.linea)}`}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
