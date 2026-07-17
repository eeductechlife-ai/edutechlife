import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import * as Sentry from '@sentry/react'
import App from './App.jsx'
import ClerkProviderWrapper from './providers/ClerkProviderWrapper'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ThemeProvider } from './context/ThemeContext'
import { I18nProvider } from './i18n/I18nProvider'
import ErrorBoundary from './components/forum/ErrorBoundary'
import { registerSW } from './utils/registerSW'
import './index.css'

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    environment: import.meta.env.MODE,
  })
}

registerSW()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
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
    </HelmetProvider>
  </React.StrictMode>,
)
