import { useMemo, lazy, Suspense } from "react";
import { useIALabStore } from "../../store/ialabStore";
import DashboardCompleted from "./dashboard/DashboardCompleted";
import DashboardInProgress from "./dashboard/DashboardInProgress";

const WelcomeTour = lazy(() => import("./WelcomeTour"));

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
      <Suspense fallback={null}>
        <WelcomeTour />
      </Suspense>
      <DueForReview />
      {courseCompleted || stats.completed === 5 ? (
        <DashboardCompleted />
      ) : (
        <DashboardInProgress />
      )}
    </>
  );
}
