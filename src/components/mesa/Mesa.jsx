import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useIdioma } from '../../lib/idioma'
import { sonar } from '../../lib/sonido'
import { useMovimientoReducido } from '../../lib/useMovimientoReducido'
import { PALOS, proyectos } from '../../content/proyectos'
import { T } from '../../content/textos'
import { CaraNaipe } from '../ui/Naipe'
import './mesa.css'

// Inclinación fija por carta: parecen repartidas a mano, pero no cambian al recargar.
const INCLINACION = [-2.5, 1.8, -1.2, 2.4, -1.8, 1.1, -2.2, 1.6]

function CartaProyecto({ p, indice, onAbrir, reducido }) {
  const { t } = useIdioma()
  const grande = p.valor === 'A'
  return (
    <motion.li
      layout={!reducido}
      className={`mano__hueco ${grande ? 'mano__hueco--as' : ''}`}
      initial={reducido ? false : { opacity: 0, y: -120, rotate: -14, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotate: INCLINACION[indice % INCLINACION.length], scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      exit={{ opacity: 0, y: 40, rotate: 8, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 170, damping: 19, delay: reducido ? 0 : 0.06 * indice }}
      onViewportEnter={() => !reducido && setTimeout(() => sonar('aterrizar', { volumen: 0.35 }), 60 * indice)}
    >
      <button
        type="button"
        className="mano__carta"
        onClick={() => onAbrir(p.id)}
        onPointerEnter={() => sonar('recoger', { volumen: 0.25 })}
        aria-label={`${p.valor} ${PALOS[p.palo].simbolo} · ${t(p.titulo)}. ${t(p.linea)}`}
      >
        <CaraNaipe valor={p.valor} palo={p.palo} className="mano__naipe">
          {p.imagen ? (
            <img
              className="mano__img"
              src={p.imagen}
              alt=""
              width="1600"
              height="860"
              loading="lazy"
              decoding="async"
              style={p.imagenEncaje ? { objectFit: p.imagenEncaje.ajuste, background: p.imagenEncaje.fondo } : undefined}
            />
          ) : undefined}
        </CaraNaipe>
        <span className="mano__titulo" aria-hidden="true">
          {t(p.titulo)}
        </span>
      </button>
    </motion.li>
  )
}

export default function Mesa({ onAbrir, extra }) {
  const { t } = useIdioma()
  const reducido = useMovimientoReducido()
  const [palo, setPalo] = useState(null)
  const visibles = proyectos.filter((p) => !palo || p.palo === palo)

  useEffect(() => {
    if (palo) sonar('cambio', { volumen: 0.4 })
  }, [palo])

  return (
    <section className="mesa" id="mano" aria-labelledby="mano-titulo">
      <div className="mesa__cabeza">
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
              onClick={() => setPalo((v) => (v === clave ? null : clave))}
              title={t(info.nombre)}
            >
              <span aria-hidden="true" className="palos__simbolo">
                {info.simbolo}
              </span>
              <span className="palos__nombre">{t(info.nombre)}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="mano">
        <AnimatePresence mode="popLayout">
          {visibles.map((p, i) => (
            <CartaProyecto key={p.id} p={p} indice={i} onAbrir={onAbrir} reducido={reducido} />
          ))}
          {extra}
        </AnimatePresence>
      </ul>
    </section>
  )
}
