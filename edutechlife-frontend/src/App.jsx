import { useState, useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/index.jsx";
import { StudentProvider } from "./context/StudentContext";
import { useAuthIdentity } from "./hooks/useAuthIdentity";
import { initSupabaseClient } from "./lib/supabase";
import CustomCursor from "./components/CustomCursor";
import AppErrorBoundary from "./components/common/ErrorBoundary";

const LoadingScreen = lazy(() => import("./components/LoadingScreen"));
const NicoModern = lazy(() => import("./components/Nico/NicoModern"));

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
    const prefetch = setTimeout(() => {
      // LandingPage first — most likely destination after IALab/SmartBoard exit.
      import("./components/pages/LandingPage.jsx");
      import("./components/pages/IALabProLandingPage.jsx");
      import("./components/pages/SmartBoardLandingPage.jsx");
      import("./components/pages/SmartBoardInfoPage.jsx");
    }, 2000);
    return () => clearTimeout(prefetch);
  }, []);

  return (
    <AppErrorBoundary variant="fullscreen">
      <StudentProvider>
        <div
          className="flex flex-col min-h-screen overflow-hidden bg-white text-[#004B63]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <CustomCursor />
          {isLoading && (
            <Suspense fallback={null}>
              <LoadingScreen
                onComplete={() => setIsLoading(false)}
                minDuration={800}
              />
            </Suspense>
          )}
          <AppRoutes />
          {!isIALabRoute && !isSmartBoardRoute && !isVAKRoute && (
            <Suspense fallback={null}>
              <NicoModern />
            </Suspense>
          )}
        </div>
      </StudentProvider>
    </AppErrorBoundary>
  );
};

export default App;
