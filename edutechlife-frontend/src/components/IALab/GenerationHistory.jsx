import { memo } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { FORUM_TYPOGRAPHY, FORUM_EFFECTS, cn } from '../forum/forumDesignSystem';

const GenerationHistory = memo(({ history, clearHistory, loadFromHistory, t }) => {
  if (!history.length) return null;

  return (
    <div className="mt-8 pt-6 border-t border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h4 className={cn(FORUM_TYPOGRAPHY.BODY.LG, FORUM_TYPOGRAPHY.SEMIBOLD, FORUM_TYPOGRAPHY.TEXT_PRIMARY)}>
          {t('ialab.synthesizer.recent_history')}
        </h4>
        <button
          onClick={clearHistory}
          className="text-sm text-slate-500 hover:text-red-500 transition-colors duration-300"
          aria-label={t('ialab.synthesizer.clear_aria')}
        >
          <Icon name="fa-trash" className="mr-1" /> {t('ialab.synthesizer.clear')}
        </button>
      </div>

      <div className="space-y-3">
        {history.slice(0, 5).map((item, index) => {
          if (!item || !item.originalPrompt || !item.techniqueApplied || !item.analysis) return null;

          return (
            <button
              key={index}
              onClick={() => loadFromHistory(index)}
              className={cn(
                "w-full text-left p-4 rounded-xl",
                "bg-white border border-slate-100",
                "hover:bg-corporate/5 hover:border-corporate/30",
                FORUM_EFFECTS.TRANSITION_ALL,
                "focus:outline-none focus:ring-2 focus:ring-corporate/50"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className={cn(FORUM_TYPOGRAPHY.BODY.SM, "text-petroleum-darker truncate")}>
                    {item.originalPrompt}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-petroleum/10 text-petroleum rounded-full">
                      {item.techniqueApplied.name}
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      item.analysis.score >= 70 ? "bg-green-100 text-green-800" :
                      item.analysis.score >= 50 ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    )}>
                      {item.analysis.score}/100
                    </span>
                  </div>
                </div>
                <Icon name="fa-chevron-right" className="text-slate-600 ml-2 flex-shrink-0" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

GenerationHistory.displayName = 'GenerationHistory';

export default GenerationHistory;
