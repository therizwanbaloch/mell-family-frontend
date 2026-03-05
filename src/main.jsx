import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import MobileOnly from "./MobileOnly.jsx"

createRoot(document.getElementById('root')).render(
 <StrictMode>
    <MobileOnly>
    <HashRouter>
      <App />
    </HashRouter>
    </MobileOnly>
  </StrictMode>,
)