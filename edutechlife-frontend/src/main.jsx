import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import ClerkProviderWrapper from './providers/ClerkProviderWrapper'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ClerkProviderWrapper>
        <App />
      </ClerkProviderWrapper>
    </AuthProvider>
  </React.StrictMode>,
)
