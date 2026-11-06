import { lazy, Suspense, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useIdioma } from '../../lib/idioma'
import { useMovimientoReducido } from '../../lib/useMovimientoReducido'
import { PALOS } from '../../content/proyectos'
import { T } from '../../content/textos'
import AntesDespues from './AntesDespues'
import './caso.css'

const WIDGETS = {
  horda: lazy(() => import('./widgets/Horda')),
  viento: lazy(() => import('./widgets/Viento')),
  estados: lazy(() => import('./widgets/Estados')),
  plano: lazy(() => import('./widgets/Plano')),
  lineas: lazy(() => import('./widgets/Lineas')),
  firma: lazy(() => import('./widgets/Firma')),
}

// Diálogo con foco atrapado. Escape cierra y el foco vuelve a la carta.
export default function Caso({ proyecto: p, onCerrar, secreto }) {
  const { t } = useIdioma()
  const reducido = useMovimientoReducido()
  const panel = useRef(null)
  const cerrarRef = useRef(null)

  useEffect(() => {
    const previo = document.activeElement
    cerrarRef.current?.focus()
    const html = document.documentElement
    const desborde = html.style.overflow
    html.style.overflow = 'hidden'

    const tecla = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCerrar()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const foco = panel.current.querySelectorAll(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      )
      if (!foco.length) return
      const primero = foco[0]
      const ultimo = foco[foco.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('keydown', tecla)
      html.style.overflow = desborde
      previo?.focus?.()
    }
  }, [onCerrar])

  const Widget = p.widget ? WIDGETS[p.widget] : null
  const palo = PALOS[p.palo]
  const rojo = palo?.rojo

  return (
    <motion.div
      className="caso__fondo"
      onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.article
        ref={panel}
        className={`caso ${rojo ? 'caso--rojo' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="caso-titulo"
        initial={reducido ? { opacity: 0 } : { rotateY: -92, scale: 0.86, opacity: 0.4 }}
        animate={reducido ? { opacity: 1 } : { rotateY: 0, scale: 1, opacity: 1 }}
        exit={reducido ? { opacity: 0 } : { rotateY: 92, scale: 0.9, opacity: 0, transition: { duration: 0.22 } }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      >
        <span className="caso__indice" aria-hidden="true">
          <span>{p.valor}</span>
          {palo && <span>{palo.simbolo}</span>}
        </span>

        <button ref={cerrarRef} type="button" className="caso__cerrar" onClick={onCerrar}>
          <span aria-hidden="true">×</span>
          <span className="solo-lector">{t(T.cerrar)}</span>
        </button>

        <header className="caso__cabeza">
          {palo && <p className="caso__palo">{t(palo.nombre)}</p>}
          <h2 id="caso-titulo" className="caso__titulo">
            {t(p.titulo)}
          </h2>
          {p.linea && <p className="caso__linea">{t(p.linea)}</p>}
        </header>

        {secreto ? (
          <div className="caso__cuerpo caso__cuerpo--secreto">
            {t(secreto).map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
        ) : (
          <>
            {p.imagen && (
              <figure className="caso__portada">
                <img src={p.imagen} alt={t(p.imagenAlt)} width="1600" height="860" fetchPriority="high" />
              </figure>
            )}

            <div className="caso__cuerpo">
              <dl className="caso__ficha">
                <div>
                  <dt>{t(T.rol)}</dt>
                  <dd>{t(p.rol)}</dd>
                </div>
                {p.ficha?.map((f, i) => (
                  <div key={i}>
                    <dt>{t(f.k)}</dt>
                    <dd>{t(f.v)}</dd>
                  </div>
                ))}
              </dl>

              <section className="caso__resolvio" aria-labelledby="caso-resolvio">
                <h3 id="caso-resolvio">{t(T.resolvio)}</h3>
                <ul>
                  {t(p.resolvio).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </section>

              {Widget && (
                <section className="caso__widget" aria-labelledby="caso-widget">
                  <h3 id="caso-widget">{t(T.comoFunciona)}</h3>
                  <Suspense fallback={<div className="caso__widget-cargando" />}>
                    <Widget />
                  </Suspense>
                </section>
              )}

              {p.antesDespues && <AntesDespues {...p.antesDespues} />}

              {p.galeria?.length > 0 && (
                <div className="caso__galeria">
                  {p.galeria.map((g) => (
                    <img key={g.src} src={g.src} alt={t(g.alt)} width="1600" height="800" loading="lazy" />
                  ))}
                </div>
              )}

              {p.enlaces?.length > 0 && (
                <p className="caso__enlaces">
                  {p.enlaces.map((e) => (
                    <a key={e.href} className="boton boton--tinta" href={e.href} target="_blank" rel="noreferrer">
                      {t(e.texto)}
                    </a>
                  ))}
                </p>
              )}
            </div>
          </>
        )}
      </motion.article>
    </motion.div>
  )
}
