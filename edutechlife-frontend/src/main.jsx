import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ClerkProviderWrapper from './providers/ClerkProviderWrapper'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProviderWrapper>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ClerkProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>,
)
