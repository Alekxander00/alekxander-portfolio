import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IdiomaProvider } from './lib/idioma'
import App from './App'
import './styles/base.css'
import './styles/pie.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IdiomaProvider>
      <App />
    </IdiomaProvider>
  </StrictMode>,
)
