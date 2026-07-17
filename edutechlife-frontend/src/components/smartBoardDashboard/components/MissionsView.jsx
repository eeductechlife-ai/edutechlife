import React, { memo } from 'react';
import MissionCard from '@/components/MissionCard';
import GlassCard from '@/components/GlassCard';
import { useTranslation } from '@/i18n/I18nProvider';

const MissionsView = memo(({
  missions,
  onMissionStart,
  onMissionComplete,
  onNavigate
}) => {
  const { t } = useTranslation();
  return (
  <GlassCard animate>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-[#004B63] font-montserrat">{t('smartboard.all_missions')}</h3>
      <span className="text-sm text-[#64748B]">{missions.filter(m => m.completed).length}/{missions.length} {t('smartboard.completed')}</span>
    </div>
    <div className="space-y-4">
      {missions.map(mission => (
        <MissionCard
          key={mission.id}
          mission={mission}
          onStart={onMissionStart}
          onComplete={onMissionComplete}
        />
      ))}
    </div>
  </GlassCard>
  );
});

MissionsView.displayName = 'MissionsView';

export default MissionsView;
