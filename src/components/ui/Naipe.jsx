import './naipe.css'

const SIMBOLO = { picas: '♠', corazones: '♥', diamantes: '♦', treboles: '♣' }
const ES_ROJO = { corazones: true, diamantes: true }

// Posiciones clásicas de los pips (x, y en 0..1 dentro del centro de la carta).
const L = 0.22
const C = 0.5
const R = 0.78
const PIPS = {
  2: [[C, 0.08], [C, 0.92]],
  3: [[C, 0.08], [C, 0.5], [C, 0.92]],
  4: [[L, 0.08], [R, 0.08], [L, 0.92], [R, 0.92]],
  5: [[L, 0.08], [R, 0.08], [C, 0.5], [L, 0.92], [R, 0.92]],
  6: [[L, 0.08], [R, 0.08], [L, 0.5], [R, 0.5], [L, 0.92], [R, 0.92]],
  7: [[L, 0.08], [R, 0.08], [C, 0.29], [L, 0.5], [R, 0.5], [L, 0.92], [R, 0.92]],
  8: [[L, 0.08], [R, 0.08], [C, 0.29], [L, 0.5], [R, 0.5], [C, 0.71], [L, 0.92], [R, 0.92]],
  9: [[L, 0.08], [R, 0.08], [L, 0.36], [R, 0.36], [C, 0.5], [L, 0.64], [R, 0.64], [L, 0.92], [R, 0.92]],
  10: [[L, 0.08], [R, 0.08], [C, 0.22], [L, 0.36], [R, 0.36], [L, 0.64], [R, 0.64], [C, 0.78], [L, 0.92], [R, 0.92]],
}

function Indice({ valor, palo }) {
  return (
    <span className="naipe__indice" aria-hidden="true">
      <span className="naipe__valor">{valor}</span>
      <span className="naipe__palo">{SIMBOLO[palo]}</span>
    </span>
  )
}

function CentroPips({ valor, palo }) {
  if (valor === 'A') {
    return <span className="naipe__as" aria-hidden="true">{SIMBOLO[palo]}</span>
  }
  if (valor === 'J' || valor === 'Q' || valor === 'K') {
    return (
      <span className="naipe__figura" aria-hidden="true">
        <span className="naipe__figura-letra">{valor}</span>
        <span className="naipe__figura-palo">{SIMBOLO[palo]}</span>
      </span>
    )
  }
  const pips = PIPS[valor] || []
  return (
    <span className="naipe__pips" aria-hidden="true">
      {pips.map(([x, y], i) => (
        <span
          key={i}
          className="naipe__pip"
          style={{ left: `${x * 100}%`, top: `${y * 100}%`, transform: `translate(-50%, -50%)${y > 0.55 ? ' rotate(180deg)' : ''}` }}
        >
          {SIMBOLO[palo]}
        </span>
      ))}
    </span>
  )
}

// La cara de un naipe. El centro puede ser una imagen o lo que se pase como hijos;
// si no hay nada, se dibujan los pips como en una baraja de verdad.
export function CaraNaipe({ valor, palo, children, className = '' }) {
  return (
    <div className={`naipe naipe--cara ${ES_ROJO[palo] ? 'naipe--rojo' : ''} ${className}`}>
      <Indice valor={valor} palo={palo} />
      <div className="naipe__centro">{children ?? <CentroPips valor={valor} palo={palo} />}</div>
      <span className="naipe__indice naipe__indice--abajo" aria-hidden="true">
        <span className="naipe__valor">{valor}</span>
        <span className="naipe__palo">{SIMBOLO[palo]}</span>
      </span>
    </div>
  )
}

// El reverso: la telaraña del logo, dos veces, como en una carta simétrica.
export function ReversoNaipe({ className = '' }) {
  return (
    <div className={`naipe naipe--reverso ${className}`} aria-hidden="true">
      <div className="naipe__marco">
        <span className="naipe__tela" />
        <span className="naipe__tela naipe__tela--b" />
      </div>
    </div>
  )
}
