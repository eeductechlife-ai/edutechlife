import React, { memo } from 'react';
import SubjectGrid from '@/components/SubjectGrid';
import GlassCard from '@/components/GlassCard';
import { useTranslation } from '@/i18n/I18nProvider';

const SubjectsView = memo(({
  subjects,
  onSelectSubject,
  onNavigate
}) => {
  const { t } = useTranslation();
  return (
  <GlassCard animate>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-[#004B63] font-montserrat">{t('smartboard.your_subjects')}</h3>
      <span className="text-sm text-[#64748B]">{subjects.filter(s => !s.locked).length} {t('smartboard.active')}</span>
    </div>
    <SubjectGrid
      subjects={subjects}
      onSelectSubject={onSelectSubject}
    />
  </GlassCard>
  );
});

SubjectsView.displayName = 'SubjectsView';

export default SubjectsView;
