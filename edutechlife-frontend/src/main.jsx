import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import { I18nProvider } from "./i18n/I18nProvider";
import ErrorBoundary from "./components/forum/ErrorBoundary";
import { AnalyticsProvider } from "./providers/AnalyticsProvider";
import { registerSW } from "./utils/registerSW";
import "./index.css";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

registerSW();

// Sentry se inicializa después del primer render para no bloquear el LCP
if (import.meta.env.VITE_SENTRY_DSN) {
  const initSentry = () =>
    import("@sentry/react").then(({ init, browserTracingIntegration }) => {
      init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [browserTracingIntegration()],
        tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_RATE) || 0,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
        environment: import.meta.env.MODE,
      });
    });
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initSentry, { timeout: 3000 });
  } else {
    setTimeout(initSentry, 2000);
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
