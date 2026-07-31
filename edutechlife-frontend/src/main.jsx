import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import * as Sentry from "@sentry/react";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import { I18nProvider } from "./i18n/I18nProvider";
import ErrorBoundary from "./components/forum/ErrorBoundary";
import { AnalyticsProvider } from "./providers/AnalyticsProvider";
import { registerSW } from "./utils/registerSW";
import "./index.css";

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_RATE) || 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    environment: import.meta.env.MODE,
  });
}

registerSW();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <I18nProvider>
          <AuthProvider>
            <NotificationProvider>
              <ThemeProvider>
                <AnalyticsProvider>
                  <ErrorBoundary>
                    <App />
                  </ErrorBoundary>
                </AnalyticsProvider>
              </ThemeProvider>
            </NotificationProvider>
          </AuthProvider>
        </I18nProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
