import { useMemo } from 'react';
import { useIALabStore } from '../../store/ialabStore';
import DashboardNoProgress from './dashboard/DashboardNoProgress';
import DashboardCompleted from './dashboard/DashboardCompleted';
import DashboardInProgress from './dashboard/DashboardInProgress';

const MODULES = [1, 2, 3, 4, 5];

export default function IALabDashboard() {
  const moduleProgress = useIALabStore(s => s.moduleProgress);
  const completedExams = useIALabStore(s => s.completedExams);
  const courseCompleted = useIALabStore(s => s.courseCompleted);

  const stats = useMemo(() => {
    const completed = MODULES.filter(id => {
      const mod = moduleProgress[id];
      return mod?.exam && mod?.challenge && mod?.resourcesCompleted && (mod?.currentScore || 0) >= 80;
    }).length;
    return { completed };
  }, [moduleProgress, completedExams]);

  const hasNoProgress = useMemo(
    () => !moduleProgress[1] || (!moduleProgress[1]?.resourcesCompleted && !moduleProgress[1]?.exam && !moduleProgress[1]?.challenge),
    [moduleProgress]
  );

  if (hasNoProgress) return <DashboardNoProgress />;
  if (courseCompleted || stats.completed === 5) return <DashboardCompleted />;
  return <DashboardInProgress />;
}
