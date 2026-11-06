import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useIdioma } from '../../lib/idioma'
import { despertarAudio, hablar, sonar } from '../../lib/sonido'
import { useEscena } from '../../escena/estado'
import { FRASES, T } from '../../content/textos'
import { casaPide, esBlackjack, GANA, nuevoMazo, puntos, resolver } from './reglasBlackjack'
import './maquina.css'
import './maquina-html.css'

const azar = (l) => l[Math.floor(Math.random() * l.length)]

function leerGanada() {
  try {
    return localStorage.getItem('maquina-ganada') === '1'
  } catch {
    return false
  }
}

function mesaNueva() {
  const mazo = nuevoMazo()
  return { mazo, jugador: [mazo.pop(), mazo.pop()], casa: [mazo.pop(), mazo.pop()], fase: 'jugando' }
}

// La Máquina cuando vive en la mesa 3D: aquí quedan el letrero, los botones del
// blackjack y los totales. Las cartas y la Máquina se ven en la escena.
export default function MaquinaHTML({ onAbrirSecreta }) {
  const { t } = useIdioma()
  const seccion = useRef(null)
  const golpes = useEscena((s) => s.golpesMaquina)
  const golpear = useEscena((s) => s.golpear)
  const setBJ = useEscena((s) => s.setBJ)
  const setSecretaFuera = useEscena((s) => s.setSecretaFuera)
  const [frase, setFrase] = useState(null)
  const [abierta, setAbierta] = useState(false)
  const [mesa, setMesa] = useState(null)
  const [ganada, setGanada] = useState(leerGanada)
  const [visible, setVisible] = useState(false)
  const timerFrase = useRef(0)
  const timers = useRef([])
  const ocupada = useRef(false) // la casa está jugando: nada de pedir ni plantarse
  const ultimoPedido = useRef(0) // un doble toque accidental no pide dos cartas
  const pidio = useRef(false)

  const despues = (ms, fn) => timers.current.push(setTimeout(fn, ms))
  useEffect(
    () => () => {
      clearTimeout(timerFrase.current)
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  // Si ya le ganaste en otra visita, la carta secreta está sobre la mesa.
  useEffect(() => {
    if (ganada) setSecretaFuera(true)
  }, [ganada, setSecretaFuera])

  // Publicar la mesa para la escena 3D.
  useEffect(() => {
    setBJ(mesa ? { jugador: mesa.jugador, casa: mesa.casa, ocultar: mesa.fase === 'jugando' } : null)
  }, [mesa, setBJ])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 })
    io.observe(seccion.current)
    return () => io.disconnect()
  }, [])

  const decir = useCallback(
    (f, ms = 3600) => {
      setFrase(f)
      hablar(t(f))
      clearTimeout(timerFrase.current)
      timerFrase.current = setTimeout(() => setFrase(null), ms)
    },
    [t],
  )

  // Si nadie la toca un rato, pide un golpe (una vez).
  useEffect(() => {
    if (!visible || golpes > 0 || pidio.current) return
    const id = setTimeout(() => {
      pidio.current = true
      decir(FRASES.pide, 4200)
    }, 3500)
    return () => clearTimeout(id)
  }, [visible, golpes, decir])

  const terminar = useCallback(
    (m) => {
      const r = resolver(m.jugador, m.casa)
      ocupada.current = false
      setMesa({ ...m, fase: 'fin' })
      if (GANA.has(r)) {
        if (!ganada) {
          decir(r === 'blackjack' ? FRASES.blackjack[0] : FRASES.ganas[0], 4200)
          despues(900, () => {
            sonar('eyeccion', { volumen: 0.8 })
            setGanada(true)
            try {
              localStorage.setItem('maquina-ganada', '1')
            } catch {
              /* sin almacenamiento: la carta dura lo que dure la visita */
            }
          })
        } else decir(r === 'blackjack' ? FRASES.blackjack[0] : r === 'mePase' ? FRASES.mePase[0] : FRASES.ganasOtraVez[0])
      } else if (r === 'tePasaste') decir(FRASES.tePasaste[0])
      else if (r === 'empate') decir(FRASES.empate[0])
      else decir(azar(FRASES.pierdes))
    },
    [decir, ganada],
  )

  const repartir = useCallback(() => {
    const m = mesaNueva()
    ocupada.current = false
    setMesa(m)
    sonar('escupir', { volumen: 0.6 })
    if (esBlackjack(m.jugador) || esBlackjack(m.casa)) {
      ocupada.current = true
      despues(900, () => terminar(m))
    }
  }, [terminar])

  // Cada golpe a la Máquina (llega desde la escena o desde el botón accesible):
  // se escucha el store como sistema externo y se reacciona en su callback.
  const alGolpe = useRef(() => {})
  useEffect(() => {
    alGolpe.current = (n) => {
      despertarAudio()
      sonar('golpe', { volumen: 0.9 })
      if (abierta) {
        decir(azar(FRASES.insistir))
        return
      }
      decir(FRASES.golpes[Math.min(n, FRASES.golpes.length) - 1])
      if (n >= FRASES.golpes.length) {
        despues(700, () => {
          sonar('activar', { volumen: 0.7 })
          setAbierta(true)
          repartir()
        })
      }
    }
  }, [abierta, decir, repartir])
  useEffect(
    () =>
      useEscena.subscribe((s, antes) => {
        if (s.golpesMaquina > antes.golpesMaquina) alGolpe.current(s.golpesMaquina)
      }),
    [],
  )

  const pedir = () => {
    if (!mesa || mesa.fase !== 'jugando' || ocupada.current) return
    if (performance.now() - ultimoPedido.current < 400) return
    ultimoPedido.current = performance.now()
    const mazo = [...mesa.mazo]
    const m = { ...mesa, mazo, jugador: [...mesa.jugador, mazo.pop()] }
    setMesa(m)
    sonar('escupir', { volumen: 0.5 })
    if (puntos(m.jugador).total > 21) {
      ocupada.current = true
      despues(500, () => terminar(m))
    }
  }

  const plantarse = () => {
    if (!mesa || mesa.fase !== 'jugando' || ocupada.current) return
    ocupada.current = true
    let m = { ...mesa, fase: 'casa', mazo: [...mesa.mazo] }
    setMesa(m)
    const jugar = () => {
      if (casaPide(m.casa)) {
        const mazo = [...m.mazo]
        m = { ...m, mazo, casa: [...m.casa, mazo.pop()] }
        setMesa(m)
        sonar('escupir', { volumen: 0.5 })
        despues(700, jugar)
      } else despues(400, () => terminar(m))
    }
    despues(600, jugar)
  }

  // DEV: forzar un resultado desde las pruebas.
  useEffect(() => {
    if (import.meta.env.DEV) window.__bj = { forzar: () => mesa && terminar({ ...mesa, jugador: [{ valor: 'A', palo: 'picas', id: 'Apicas-f' }, { valor: 'K', palo: 'picas', id: 'Kpicas-f' }], casa: [{ valor: '9', palo: 'treboles', id: '9treboles-f' }, { valor: '8', palo: 'treboles', id: '8treboles-f' }] }) }
  }, [mesa, terminar])

  const jugando = mesa?.fase === 'jugando'
  const total = (mano, ocultar) => (ocultar ? `${puntos([mano[0]]).total}+` : puntos(mano).total)

  return (
    <section ref={seccion} className="maquina-html parada" data-parada="maquina" aria-labelledby="casa-titulo">
      <h2 id="casa-titulo" className="solo-lector">
        {t(T.casa)}
      </h2>
      <div className="maquina-html__fija">
        <div className="casa__letrero maquina-html__letrero" aria-live="polite">
          <AnimatePresence mode="wait">
            {frase && (
              <motion.p key={t(frase)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                {t(frase)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button type="button" className="solo-lector maquina-html__golpe" onClick={golpear}>
          {t(T.golpear)}
        </button>

        {abierta && mesa && (
          <div className="maquina-html__panel">
            <p className="maquina-html__totales">
              <span>
                {t(T.casa)} <strong>{total(mesa.casa, mesa.fase === 'jugando')}</strong>
              </span>
              <span>
                {t(T.tu)} <strong>{total(mesa.jugador, false)}</strong>
              </span>
            </p>
            <div className="bj__acciones">
              {mesa.fase === 'fin' ? (
                <button type="button" className="boton boton--marfil" onClick={repartir}>
                  {t(T.otraMano)}
                </button>
              ) : (
                <>
                  <button type="button" className="boton boton--marfil" onClick={pedir} disabled={!jugando}>
                    {t(T.pedir)}
                  </button>
                  <button type="button" className="boton" onClick={plantarse} disabled={!jugando}>
                    {t(T.plantarse)}
                  </button>
                </>
              )}
              {ganada && (
                <button type="button" className="boton maquina-html__secreta" onClick={onAbrirSecreta}>
                  {t(T.secreta)}
                </button>
              )}
            </div>
          </div>
        )}
        {!abierta && ganada && (
          <div className="maquina-html__panel">
            <button type="button" className="boton maquina-html__secreta" onClick={onAbrirSecreta}>
              {t(T.secreta)}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
