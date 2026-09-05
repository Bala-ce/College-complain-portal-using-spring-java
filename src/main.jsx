import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Auth from './components/Auth.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth />
  </StrictMode>,
)
