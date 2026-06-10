import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../i18n/I18nProvider';
import { getModules } from '../../../data/ialab';
import { useIALabStore } from '../../../store/ialabStore';
import { useMemo } from 'react';
import DashboardModuleRow from './DashboardModuleRow';

const MODULES = [1, 2, 3, 4, 5];

const moduleIcons = { 1: 'fa-terminal', 2: 'fa-robot', 3: 'fa-search', 4: 'fa-microphone', 5: 'fa-trophy' };

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DashboardModuleList() {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const moduleProgress = useIALabStore(s => s.moduleProgress);
  const completedExams = useIALabStore(s => s.completedExams);
  const challengeScores = useIALabStore(s => s.challengeScores);

  const modulesData = useMemo(() => getModules(locale), [locale]);

  const moduleTitles = useMemo(() => {
    const m = {};
    modulesData.forEach(x => { m[x.id] = x.title; });
    return m;
  }, [modulesData]);

  const modules = useMemo(() =>
    MODULES.map(id => {
      const mod = moduleProgress[id];
      return {
        id,
        approved: mod?.exam && mod?.challenge && mod?.resourcesCompleted && (mod?.currentScore || 0) >= 80,
        unlocked: id === 1 || mod?.isUnlocked === true,
        score: mod?.currentScore || 0,
        examScore: completedExams[id],
        challengeScore: challengeScores[id],
      };
    }),
    [moduleProgress, completedExams, challengeScores]
  );

  if (shouldReduceMotion) {
    return (
      <div className="space-y-2.5">
        {modules.map(mod => (
          <DashboardModuleRow key={mod.id} id={mod.id} title={moduleTitles[mod.id]}
            icon={moduleIcons[mod.id]} approved={mod.approved} unlocked={mod.unlocked}
            score={mod.score} examScore={mod.examScore} challengeScore={mod.challengeScore}
            onNavigate={() => navigate(`/ialab/${mod.id}`)} />
        ))}
      </div>
    );
  }

  return (
    <motion.div className="space-y-2.5" variants={containerVariants}
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
      {modules.map(mod => (
        <motion.div key={mod.id} variants={itemVariants}>
          <DashboardModuleRow id={mod.id} title={moduleTitles[mod.id]}
            icon={moduleIcons[mod.id]} approved={mod.approved} unlocked={mod.unlocked}
            score={mod.score} examScore={mod.examScore} challengeScore={mod.challengeScore}
            onNavigate={() => navigate(`/ialab/${mod.id}`)} />
        </motion.div>
      ))}
    </motion.div>
  );
}
