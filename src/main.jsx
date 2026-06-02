import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import { MasterDataProvider } from './context/MasterDataContext'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('main')).render(
  // <StrictMode>
  <ErrorBoundary>
    <ThemeProvider>
      <MasterDataProvider>
        <App />
      </MasterDataProvider>
    </ThemeProvider>
  </ErrorBoundary>
  // </StrictMode>,
)
