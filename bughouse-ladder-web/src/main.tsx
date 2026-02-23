import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import LadderForm from './components/LadderForm'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LadderForm />
  </StrictMode>,
)