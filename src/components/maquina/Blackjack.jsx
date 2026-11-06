import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useIdioma } from '../../lib/idioma'
import { sonar } from '../../lib/sonido'
import { T } from '../../content/textos'
import { CaraNaipe, ReversoNaipe } from '../ui/Naipe'
import { casaPide, esBlackjack, nuevoMazo, puntos, resolver } from './reglasBlackjack'

function Mano({ cartas, ocultarSegunda, etiqueta, total }) {
  const { t } = useIdioma()
  const visibles = ocultarSegunda ? cartas.filter((_, i) => i !== 1) : cartas
  const nombres = visibles.map((c) => c.valor).join(', ')
  return (
    <div className="bj__mano">
      <p className="bj__etiqueta">
        <span>{t(etiqueta)}</span>
        <span className="bj__total" aria-label={`${t(etiqueta)}: ${total}. ${nombres}`}>
          {total}
        </span>
      </p>
      <ul className="bj__cartas">
        <AnimatePresence>
          {cartas.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, x: 120, y: -40, rotate: 20 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: (i - 1) * 3 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className="bj__carta"
            >
              {ocultarSegunda && i === 1 ? <ReversoNaipe /> : <CaraNaipe valor={c.valor} palo={c.palo} />}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

function mesaNueva() {
  const mazo = nuevoMazo()
  const jugador = [mazo.pop(), mazo.pop()]
  const casa = [mazo.pop(), mazo.pop()]
  return { mazo, jugador, casa, fase: 'jugando', resultado: null }
}

export default function Blackjack({ onResultado }) {
  const { t } = useIdioma()
  const [mesa, setMesa] = useState(mesaNueva)
  const timers = useRef([])
  const avisar = useRef(onResultado)
  useEffect(() => {
    avisar.current = onResultado
  }, [onResultado])

  const despues = (ms, fn) => timers.current.push(setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const terminar = useCallback((jugador, casa) => {
    const r = resolver(jugador, casa)
    setMesa((m) => ({ ...m, fase: 'fin', resultado: r }))
    avisar.current(r)
  }, [])

  // Un blackjack natural (de cualquiera de los dos) termina la mano sola.
  const revisarNatural = useCallback(
    (m) => {
      if (esBlackjack(m.jugador) || esBlackjack(m.casa)) {
        timers.current.push(setTimeout(() => terminar(m.jugador, m.casa), 700))
      }
    },
    [terminar],
  )

  const primera = useRef(mesa)
  useEffect(() => {
    sonar('escupir', { volumen: 0.6 })
    revisarNatural(primera.current)
  }, [revisarNatural])

  const repartir = () => {
    const m = mesaNueva()
    setMesa(m)
    sonar('escupir', { volumen: 0.6 })
    revisarNatural(m)
  }

  const pedir = () => {
    if (!mesa || mesa.fase !== 'jugando') return
    const mazo = [...mesa.mazo]
    const jugador = [...mesa.jugador, mazo.pop()]
    sonar('aterrizar', { volumen: 0.6 })
    setMesa({ ...mesa, mazo, jugador })
    if (puntos(jugador).total > 21) despues(450, () => terminar(jugador, mesa.casa))
  }

  // La casa juega sola, una carta cada poco, para que se vea.
  const plantarse = () => {
    if (!mesa || mesa.fase !== 'jugando') return
    setMesa({ ...mesa, fase: 'casa' })
    const mazo = [...mesa.mazo]
    let casa = [...mesa.casa]
    const jugar = () => {
      if (casaPide(casa)) {
        casa = [...casa, mazo.pop()]
        sonar('escupir', { volumen: 0.5 })
        setMesa((m) => ({ ...m, casa, mazo }))
        despues(650, jugar)
      } else {
        despues(350, () => terminar(mesa.jugador, casa))
      }
    }
    despues(500, jugar)
  }

  if (!mesa) return null
  const ocultar = mesa.fase === 'jugando'
  const totalCasa = ocultar ? puntos([mesa.casa[0]]).total : puntos(mesa.casa).total

  return (
    <div className="bj">
      <Mano cartas={mesa.casa} ocultarSegunda={ocultar} etiqueta={T.casa} total={ocultar ? `${totalCasa}+` : totalCasa} />
      <Mano cartas={mesa.jugador} etiqueta={T.tu} total={puntos(mesa.jugador).total} />
      <div className="bj__acciones">
        {mesa.fase === 'fin' ? (
          <button type="button" className="boton boton--marfil" onClick={repartir}>
            {t(T.otraMano)}
          </button>
        ) : (
          <>
            <button type="button" className="boton boton--marfil" onClick={pedir} disabled={mesa.fase !== 'jugando'}>
              {t(T.pedir)}
            </button>
            <button type="button" className="boton" onClick={plantarse} disabled={mesa.fase !== 'jugando'}>
              {t(T.plantarse)}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
