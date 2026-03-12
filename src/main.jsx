import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import MobileOnly from "./MobileOnly.jsx"
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <MobileOnly>
        <HashRouter>
          <App />
        </HashRouter>
      </MobileOnly>
    </Provider>
  </StrictMode>
)