import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useIdioma } from '../../lib/idioma'
import { despertarAudio, hablar, sonar } from '../../lib/sonido'
import { FRASES, T } from '../../content/textos'
import { ReversoNaipe } from '../ui/Naipe'
import Blackjack from './Blackjack'
import { GANA } from './reglasBlackjack'
import { tieneWebGL } from '../../escena/webgl'
import './maquina.css'

const MaquinaEscena = lazy(() => import('./MaquinaEscena'))

const azar = (lista) => lista[Math.floor(Math.random() * lista.length)]

function leerGanada() {
  try {
    return localStorage.getItem('maquina-ganada') === '1'
  } catch {
    return false
  }
}

// La esquina de la mesa donde vive la Máquina. Nada la anuncia: se golpea.
export default function Maquina({ onAbrirSecreta }) {
  const { t } = useIdioma()
  const seccion = useRef(null)
  const [cerca, setCerca] = useState(false)
  const [visible, setVisible] = useState(false)
  // Sin WebGL la Máquina no se dibuja, pero el blackjack se juega igual con el botón.
  const [carga, setCarga] = useState(() => (tieneWebGL() ? 'cargando' : 'sinDibujo'))
  const [golpes, setGolpes] = useState(0)
  const [frase, setFrase] = useState(null)
  const [abierta, setAbierta] = useState(false)
  const [ganada, setGanada] = useState(leerGanada)
  const [recienGanada, setRecienGanada] = useState(false)
  const timerFrase = useRef(0)

  // Cargar la escena solo cuando se acerca, y pausarla cuando no se ve.
  useEffect(() => {
    const el = seccion.current
    const lejos = new IntersectionObserver(([e]) => e.isIntersecting && setCerca(true), { rootMargin: '400px' })
    const dentro = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    lejos.observe(el)
    dentro.observe(el)
    return () => {
      lejos.disconnect()
      dentro.disconnect()
    }
  }, [])

  useEffect(() => () => clearTimeout(timerFrase.current), [])

  const decir = useCallback(
    (f, ms = 3600) => {
      setFrase(f)
      hablar(t(f))
      clearTimeout(timerFrase.current)
      timerFrase.current = setTimeout(() => setFrase(null), ms)
    },
    [t],
  )

  // Si lleva un rato a la vista y nadie la toca, pide un golpe. Una sola vez.
  const pidio = useRef(false)
  useEffect(() => {
    if (!visible || (carga !== 'lista' && carga !== 'sinDibujo') || golpes > 0 || pidio.current) return
    const id = setTimeout(() => {
      pidio.current = true
      decir(FRASES.pide, 4200)
    }, 3500)
    return () => clearTimeout(id)
  }, [visible, carga, golpes, decir])

  const golpear = () => {
    despertarAudio()
    sonar('golpe', { volumen: 0.9 })
    const n = golpes + 1
    setGolpes(n)
    if (abierta) {
      decir(azar(FRASES.insistir))
      return
    }
    decir(FRASES.golpes[Math.min(n, FRASES.golpes.length) - 1])
    if (n >= FRASES.golpes.length) {
      setTimeout(() => {
        sonar('activar', { volumen: 0.7 })
        setAbierta(true)
      }, 700)
    }
  }

  const alResultado = useCallback(
    (r) => {
      if (GANA.has(r)) {
        if (!ganada) {
          decir(r === 'blackjack' ? FRASES.blackjack[0] : FRASES.ganas[0], 4200)
          setTimeout(() => {
            sonar('eyeccion', { volumen: 0.8 })
            setGanada(true)
            setRecienGanada(true)
            try {
              localStorage.setItem('maquina-ganada', '1')
            } catch {
              /* sin almacenamiento: la carta dura lo que dure la visita */
            }
          }, 900)
        } else {
          decir(r === 'blackjack' ? FRASES.blackjack[0] : r === 'mePase' ? FRASES.mePase[0] : FRASES.ganasOtraVez[0])
        }
      } else if (r === 'tePasaste') decir(FRASES.tePasaste[0])
      else if (r === 'empate') decir(FRASES.empate[0])
      else decir(azar(FRASES.pierdes))
    },
    [decir, ganada],
  )

  return (
    <section ref={seccion} data-parada="maquina" className={`casa ${abierta ? 'is-abierta' : ''}`} aria-labelledby="casa-titulo">
      <h2 id="casa-titulo" className="solo-lector">
        {t(T.casa)}
      </h2>

      <div className="casa__maquina">
        <div className="casa__letrero" aria-live="polite">
          <AnimatePresence mode="wait">
            {frase && (
              <motion.p
                key={t(frase)}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
              >
                {t(frase)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="casa__escena">
          {cerca && (carga === 'cargando' || carga === 'lista') && (
            <Suspense fallback={null}>
              <MaquinaEscena
                golpes={golpes}
                activa={visible}
                onListo={() => setCarga('lista')}
                onError={() => setCarga('error')}
              />
            </Suspense>
          )}
          {carga === 'cargando' && <p className="casa__estado">{t(T.cargando)}</p>}
          {carga === 'error' && <p className="casa__estado">{t(T.errorMaquina)}</p>}
          <button
            type="button"
            className={carga === 'sinDibujo' ? 'boton casa__golpe casa__golpe--visible' : 'casa__golpe'}
            onClick={golpear}
            disabled={carga === 'error'}
            aria-label={carga === 'sinDibujo' ? undefined : t(T.golpear)}
          >
            {carga === 'sinDibujo' && t(T.golpear)}
          </button>
          <span className="casa__sombra" aria-hidden="true" />
        </div>

        <AnimatePresence>
          {ganada && (
            <motion.button
              type="button"
              className="casa__secreta"
              onClick={onAbrirSecreta}
              initial={recienGanada ? { opacity: 0, y: -80, rotate: -30, scale: 0.6 } : false}
              animate={{ opacity: 1, y: 0, rotate: -6, scale: 1 }}
              transition={{ type: 'spring', stiffness: 160, damping: 12 }}
            >
              <ReversoNaipe />
              <span className="casa__secreta-texto">{t(T.secreta)}</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {abierta && (
          <motion.div
            className="casa__mesa"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          >
            <Blackjack onResultado={alResultado} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
