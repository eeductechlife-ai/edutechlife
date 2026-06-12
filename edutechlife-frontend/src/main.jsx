import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ClerkProviderWrapper from './providers/ClerkProviderWrapper'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ThemeProvider } from './context/ThemeContext'
import { I18nProvider } from './i18n/I18nProvider'
import ErrorBoundary from './components/forum/ErrorBoundary'
import { registerSW } from './utils/registerSW'
import './index.css'

registerSW()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProviderWrapper>
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider>
              <I18nProvider>
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
              </I18nProvider>
            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
      </ClerkProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>,
)
