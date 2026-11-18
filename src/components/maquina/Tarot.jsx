import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useIdioma } from '../../lib/idioma'
import { hablar, sonar } from '../../lib/sonido'
import { canvasTarot } from '../../lib/caraTarot'
import { ARCANOS } from '../../content/tarot'
import { T } from '../../content/textos'
import { tirar } from './tirada'

// La lectura del tarot en la versión plana: la carta es una imagen del mismo
// dibujo que usa la mesa 3D.
export default function Tarot() {
  const { t, idioma } = useIdioma()
  const [lectura, setLectura] = useState(() => ({ ...tirar(null), id: `t${Date.now()}` }))
  const [imagen, setImagen] = useState(null)
  const anterior = useRef(lectura.arcano)

  useEffect(() => {
    let viva = true
    canvasTarot(lectura.arcano, idioma).then((c) => viva && setImagen({ id: lectura.id, src: c.toDataURL() }))
    return () => {
      viva = false
    }
  }, [lectura, idioma])

  useEffect(() => {
    sonar('escupir', { volumen: 0.6 })
    const a = ARCANOS[lectura.arcano]
    hablar(t(lectura.invertida ? a.invertido : a.derecho))
    // Solo al sacar una carta nueva, no al cambiar de idioma.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectura])

  const otra = () => {
    const nueva = { ...tirar(anterior.current), id: `t${Date.now()}` }
    anterior.current = nueva.arcano
    setLectura(nueva)
  }

  const a = ARCANOS[lectura.arcano]
  const lista = imagen?.id === lectura.id
  return (
    <div className="bj tarot-plano">
      <div className="tarot-plano__carta">
        <AnimatePresence mode="wait">
          {lista && (
            <motion.img
              key={lectura.id}
              src={imagen.src}
              alt=""
              initial={{ opacity: 0, x: 120, y: -40, rotate: 20 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: lectura.invertida ? 180 : 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            />
          )}
        </AnimatePresence>
      </div>
      {/* Nace vacía y se llena con la carta: así el lector anuncia también la primera. */}
      <div className="maquina-html__lectura" aria-live="polite">
        {lista && (
          <>
            <p className="maquina-html__arcano">
              {a.romano} · {t(a.nombre)}
              {lectura.invertida && <em> ({t(T.invertida)})</em>}
            </p>
            <p className="maquina-html__prediccion">{t(lectura.invertida ? a.invertido : a.derecho)}</p>
          </>
        )}
      </div>
      <div className="bj__acciones">
        <button type="button" className="boton boton--marfil" onClick={otra}>
          {t(T.otraLectura)}
        </button>
      </div>
    </div>
  )
}
