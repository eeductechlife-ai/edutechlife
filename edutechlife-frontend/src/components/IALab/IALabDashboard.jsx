import { useMemo, useState } from 'react';
import { useIALabStore } from '../../store/ialabStore';
import DashboardCompleted from './dashboard/DashboardCompleted';
import DashboardInProgress from './dashboard/DashboardInProgress';
import DashboardTour from './dashboard/DashboardTour';

const TOUR_KEY = 'ialab_dashboard_tour_completed';
const MODULES = [1, 2, 3, 4, 5];

export default function IALabDashboard() {
  const moduleProgress = useIALabStore(s => s.moduleProgress);
  const completedExams = useIALabStore(s => s.completedExams);
  const courseCompleted = useIALabStore(s => s.courseCompleted);
  const [tourDone, setTourDone] = useState(() => !!localStorage.getItem(TOUR_KEY));

  const hasNoProgress = useMemo(
    () => !moduleProgress[1] || (!moduleProgress[1]?.resourcesCompleted && !moduleProgress[1]?.exam && !moduleProgress[1]?.challenge),
    [moduleProgress]
  );

  if (hasNoProgress && !tourDone) {
    return (
      <div className="relative">
        <div className="opacity-0 pointer-events-none select-none">
          <DashboardInProgress />
        </div>
        <DashboardTour onComplete={() => setTourDone(true)} />
      </div>
    );
  }

  const stats = useMemo(() => {
    const completed = MODULES.filter(id => {
      const mod = moduleProgress[id];
      return mod?.exam && mod?.challenge && mod?.resourcesCompleted && (mod?.currentScore || 0) >= 80;
    }).length;
    return { completed };
  }, [moduleProgress, completedExams]);

  if (courseCompleted || stats.completed === 5) return <DashboardCompleted />;
  return <DashboardInProgress />;
}
