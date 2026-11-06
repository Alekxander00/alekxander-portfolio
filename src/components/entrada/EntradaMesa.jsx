import { useIdioma } from '../../lib/idioma'
import { useEscena } from '../../escena/estado'
import { perfil } from '../../content/perfil'
import { PRINCIPIOS, T } from '../../content/textos'
import './entrada.css'
import './entrada-mesa.css'

const ORDEN = ['estirar', 'inercia', 'sacudida', 'hitstop', 'anticipacion']
const EMPUJES = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }

// La entrada cuando la carta vive en la mesa 3D: aquí solo queda el HTML que
// se lee y se usa con teclado. El puntero pasa a través hasta la carta.
export default function EntradaMesa() {
  const { t } = useIdioma()
  const volteada = useEscena((s) => s.volteada)
  const encontrados = useEscena((s) => s.encontrados)
  const aviso = useEscena((s) => s.aviso)
  const ordenar = useEscena((s) => s.ordenar)
  const setFoco = useEscena((s) => s.setFoco)
  const principio = aviso ? PRINCIPIOS[aviso] : null

  // Enter y Espacio ya disparan el clic del botón; aquí solo van las flechas.
  const tecla = (e) => {
    const d = EMPUJES[e.key]
    if (d) {
      e.preventDefault()
      ordenar('empujar', [d[0], d[1], e.shiftKey])
    }
  }

  return (
    <section className="entrada parada" data-parada="entrada" aria-labelledby="entrada-titulo">
      <h1 id="entrada-titulo" className="solo-lector">
        {perfil.nombre}. {t(perfil.oficio)}
      </h1>

      <button
        type="button"
        className="entrada-mesa__carta solo-lector"
        aria-describedby="entrada-pista"
        onClick={() => ordenar('voltear')}
        onKeyDown={tecla}
        onFocus={() => setFoco(true)}
        onBlur={() => setFoco(false)}
      >
        {volteada ? t(T.cartaEntradaVolteada) : t(T.cartaEntrada)}
      </button>
      <span id="entrada-pista" className="solo-lector">
        {t(T.pistaFlechas)}
      </span>

      <div className="entrada__principios" role="status" aria-live="polite">
        <span className="solo-lector">
          {t(T.principios)}: {encontrados.length} / {ORDEN.length}
        </span>
        <span className="entrada__marcas" aria-hidden="true">
          {ORDEN.map((c) => (
            <span key={c} className={`entrada__marca ${encontrados.includes(c) ? 'is-on' : ''}`} />
          ))}
        </span>
        {principio && (
          <span className="entrada__aviso" key={aviso}>
            <strong>{t(principio.nombre)}</strong>
            <span>{t(principio.idea)}</span>
          </span>
        )}
      </div>

      <a className={`entrada__bajar ${volteada ? 'is-visible' : ''}`} href="#mano" tabIndex={volteada ? 0 : -1} aria-hidden={!volteada}>
        <span aria-hidden="true">♠ ♥ ♣ ♦</span>
        <span>{t(T.mano)}</span>
      </a>
    </section>
  )
}
