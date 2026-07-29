import React, { lazy, Suspense, useState } from 'react';
import { useTranslation } from '../../i18n/I18nProvider';
import { useIALabProgressContext } from '../../context/IALabContext';
import { Icon } from '../../utils/iconMapping.jsx';
import SectionErrorBoundary from './SectionErrorBoundary';

const FlashcardArena = lazy(() => import('./FlashcardArena'));
const QuizPractice = lazy(() => import('./QuizPractice'));

const TABS = [
  { id: 'study', icon: 'fa-book', labelKey: 'ialab.flashcards.tab_study' },
  { id: 'practice', icon: 'fa-pencil', labelKey: 'ialab.flashcards.tab_practice' },
];

export default function CapsulasConocimiento() {
  const { t } = useTranslation();
  const { activeMod } = useIALabProgressContext();
  const [activeTab, setActiveTab] = useState('study');

  return (
    <div>
      <div className="flex items-center gap-1 mb-6 border-b border-slate-200 dark:border-slate-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-petroleum text-petroleum'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            <Icon name={tab.icon} className="text-sm" aria-hidden="true" />
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {activeTab === 'study' && (
        <Suspense fallback={<div className="h-32 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />}>
          <SectionErrorBoundary name="FlashcardArena">
            <FlashcardArena moduleId={activeMod} />
          </SectionErrorBoundary>
        </Suspense>
      )}

      {activeTab === 'practice' && (
        <Suspense fallback={<div className="h-32 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />}>
          <SectionErrorBoundary name="QuizPractice">
            <QuizPractice moduleId={activeMod} />
          </SectionErrorBoundary>
        </Suspense>
      )}
    </div>
  );
}
