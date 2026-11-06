import { Component } from 'react'

// Si la mesa 3D revienta al arrancar (p. ej. three no logra crear el contexto
// aunque el sondeo dijera que sí), avisamos y la página sigue en su versión plana.
export default class LimiteError extends Component {
  state = { roto: false }

  static getDerivedStateFromError() {
    return { roto: true }
  }

  componentDidCatch(error) {
    console.warn('La mesa 3D no pudo arrancar; se usa la versión plana.', error)
    this.props.onError?.()
  }

  render() {
    return this.state.roto ? null : this.props.children
  }
}
