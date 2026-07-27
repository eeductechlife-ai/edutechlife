import { useState, useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/index.jsx";
import { StudentProvider } from "./context/StudentContext";
import { useAuth as useClerkAuth } from "@clerk/react";
import { initSupabaseClient } from "./lib/supabase";
import CustomCursor from "./components/CustomCursor";
import GlobalErrorBoundary from "./components/common/GlobalErrorBoundary";

const LoadingScreen = lazy(() => import("./components/LoadingScreen"));
const NicoModern = lazy(() => import("./components/Nico/NicoModern"));

const App = () => {
  const location = useLocation();
  const isIALabRoute = location.pathname.includes("/ialab");
  const isSmartBoardRoute = location.pathname.includes("/smartboard");
  const isVAKRoute = location.pathname.includes("/vak");
  const { isLoaded: clerkLoaded, getToken } = useClerkAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!clerkLoaded) return;
    getToken({ template: "supabase" }).then((token) => {
      if (token) initSupabaseClient(token);
    });
  }, [clerkLoaded, getToken]);

  useEffect(() => {
    const prefetch = setTimeout(() => {
      import("./components/pages/IALabProLandingPage.jsx");
      import("./components/pages/SmartBoardLandingPage.jsx");
      import("./components/pages/SmartBoardInfoPage.jsx");
    }, 2000);
    return () => clearTimeout(prefetch);
  }, []);

  return (
    <GlobalErrorBoundary>
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
    </GlobalErrorBoundary>
  );
};

export default App;
