import { useMemo, lazy, Suspense } from "react";
import { useIALabStore } from "../../store/ialabStore";
// Los tokens de tema (--theme-primary/--theme-emphasis) se definen en este CSS
// bajo selectores [data-theme]. El curso lo importa desde IALab.jsx, pero el
// dashboard (ruta /ialab) se monta fuera de ese chunk: sin este import las
// variables quedan sin definir y el contenido "se ve en blanco".
import "./themes/themes.css";

const WelcomeTour = lazy(() => import("./WelcomeTour"));
const DashboardCompleted = lazy(() => import("./dashboard/DashboardCompleted"));
const DashboardInProgress = lazy(
  () => import("./dashboard/DashboardInProgress"),
);

// Placeholder spinner for dashboard loading
function DashboardFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-96 max-w-full bg-gray-100 rounded"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MODULES = [1, 2, 3, 4, 5];

function DueForReview() {
  const contentReviews = useIALabStore((s) => s.contentReviews || {});
  const dueItems = Object.entries(contentReviews)
    .filter(([, review]) => new Date(review.nextReview) <= new Date())
    .slice(0, 5);

  if (dueItems.length === 0) return null;

  return (
    <section className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-6">
      <h3 className="text-sm font-bold text-amber-800 mb-3">
        Due for Review ({dueItems.length})
      </h3>
      <div className="space-y-2">
        {dueItems.map(([id]) => (
          <button
            key={id}
            className="w-full text-left text-sm text-amber-700 hover:text-amber-900 transition-colors"
          >
            Review content #{id}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function IALabDashboard() {
  const moduleProgress = useIALabStore((s) => s.moduleProgress);
  const completedExams = useIALabStore((s) => s.completedExams);
  const courseCompleted = useIALabStore((s) => s.courseCompleted);

  const stats = useMemo(() => {
    const completed = MODULES.filter((id) => {
      const mod = moduleProgress[id];
      return (
        mod?.exam &&
        mod?.challenge &&
        mod?.resourcesCompleted &&
        (mod?.currentScore || 0) >= 80
      );
    }).length;
    return { completed };
  }, [moduleProgress, completedExams]);

  return (
    <>
      {/* El dashboard vive fuera del ThemeProvider inmersivo del curso (solo
          envuelve los módulos). Sin un ancestro [data-theme], los tokens CSS
          var(--theme-emphasis/primary) quedan indefinidos: el degradado y los
          botones se vuelven transparentes y el texto blanco "desaparece".
          Aplicamos el tema Edutechlife por defecto a todo el dashboard y, por
          defensa, fijamos los tokens clave inline para que el contraste no
          dependa de la carga del CSS ni de un ancestro .dark. */}
      <div
        data-theme="default"
        style={{
          "--theme-primary": "#259eb5",
          "--theme-primary-hover": "#1e8194",
          "--theme-emphasis": "#004b63",
          "--theme-emphasis-hover": "#0a3550",
          "--theme-on-emphasis": "#ffffff",
        }}
      >
        <Suspense fallback={null}>
          <WelcomeTour />
        </Suspense>
        <Suspense fallback={<DashboardFallback />}>
          <DueForReview />
          {courseCompleted || stats.completed === 5 ? (
            <DashboardCompleted />
          ) : (
            <DashboardInProgress />
          )}
        </Suspense>
      </div>
    </>
  );
}
