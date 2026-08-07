import { useState, useEffect, lazy, Suspense, useRef } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/index.jsx";
import { StudentProvider } from "./context/StudentContext";
import { useAuthIdentity } from "./hooks/useAuthIdentity";
import { initSupabaseClient } from "./lib/supabase";
import AppErrorBoundary from "./components/common/ErrorBoundary";

const LoadingScreen = lazy(() => import("./components/LoadingScreen"));
const NicoModern = lazy(() => import("./components/Nico/NicoModern"));
const CustomCursor = lazy(() => import("./components/CustomCursor"));

// Only render CustomCursor on desktop (where mouse events matter)
const LazyCustomCursor = () => {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth > 1024);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth > 1024);
    window.addEventListener("resize", checkDesktop, { passive: true });
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  if (!isDesktop) return null;
  return (
    <Suspense fallback={null}>
      <CustomCursor />
    </Suspense>
  );
};

// Lazy-load NicoModern only when user scrolls near footer
const LazyNicoModern = () => {
  const [showNico, setShowNico] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    if (showNico) return; // Already loaded

    // Wait for footer to exist before setting up observer (avoid observing body during route transition)
    let attempts = 0;
    const maxAttempts = 50; // Max 2.5 seconds

    const setupObserver = () => {
      const footer = document.querySelector("footer");

      // If footer not found and we haven't exceeded max attempts, retry
      if (!footer && attempts < maxAttempts) {
        attempts++;
        setTimeout(setupObserver, 50);
        return;
      }

      // Use footer if found, otherwise skip observer (don't observe body during transitions)
      if (!footer) {
        // Footer never appeared — probably on a route that has no footer
        // Don't set up observer at all
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShowNico(true);
            observer.disconnect();
          }
        },
        { rootMargin: "200px" } // Load 200px before entering viewport
      );

      observer.observe(footer);
      observerRef.current = observer;
    };

    setupObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [showNico]);

  if (!showNico) return null;

  return (
    <Suspense fallback={null}>
      <NicoModern />
    </Suspense>
  );
};

const App = () => {
  const location = useLocation();
  const isIALabRoute = location.pathname.includes("/ialab");
  const isSmartBoardRoute = location.pathname.includes("/smartboard");
  const isVAKRoute = location.pathname.includes("/vak");
  const { token: authToken } = useAuthIdentity();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // El cliente Supabase se eleva con el token de la sesion. Antes se pedia un
    // JWT a Clerk, que no tenia sesion, asi que el cliente quedaba anonimo y las
    // politicas RLS bloqueaban la lectura/escritura del progreso.
    if (authToken) initSupabaseClient(authToken);
  }, [authToken]);

  useEffect(() => {
    // Prefetch only when browser is idle (more efficient than setTimeout)
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => {
        // Prefetch key components: Hero for faster landing page, IALab dashboard for app
        Promise.allSettled([
          import("./components/pages/LandingPage.jsx"),
          import("./components/Hero.jsx"),
          import("./components/IALab/IALabDashboard.jsx"),
        ]).catch(() => {
          // Prefetch failures are non-critical; silently continue
        });
      });
      return () => cancelIdleCallback(id);
    } else {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(() => {
        import("./components/pages/LandingPage.jsx").catch(() => {});
        import("./components/Hero.jsx").catch(() => {});
        import("./components/IALab/IALabDashboard.jsx").catch(() => {});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AppErrorBoundary variant="fullscreen">
      <StudentProvider>
        <div
          className="flex flex-col min-h-screen overflow-hidden bg-white text-[#004B63]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <LazyCustomCursor />
          {isLoading && (
            <Suspense fallback={null}>
              <LoadingScreen
                onComplete={() => setIsLoading(false)}
                minDuration={0}
              />
            </Suspense>
          )}
          <AppRoutes />
          {!isIALabRoute && !isSmartBoardRoute && !isVAKRoute && (
            <LazyNicoModern />
          )}
        </div>
      </StudentProvider>
    </AppErrorBoundary>
  );
};

export default App;
