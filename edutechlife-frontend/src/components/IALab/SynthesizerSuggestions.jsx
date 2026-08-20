import { memo } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { FORUM_TYPOGRAPHY, FORUM_EFFECTS, cn } from '../forum/forumDesignSystem';

const SynthesizerSuggestions = memo(({ suggestions, loading, onSuggestionClick, t }) => {
  return (
    <div className="mt-6">
      <h4 className={cn(FORUM_TYPOGRAPHY.BODY.LG, FORUM_TYPOGRAPHY.SEMIBOLD, FORUM_TYPOGRAPHY.TEXT_PRIMARY, "mb-3")}>
        {t('ialab.synthesizer.suggestions')}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className={cn(
              "text-left p-4 rounded-xl border border-slate-200/60",
              "bg-white",
              "hover:bg-slate-50",
              "hover:border-[var(--theme-primary)]/40 hover:shadow-sm",
              FORUM_EFFECTS.TRANSITION_ALL,
              "focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50"
            )}
            disabled={loading}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--theme-primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="fa-lightbulb" className="text-[var(--theme-primary)] text-xs" />
              </div>
              <p className={cn(FORUM_TYPOGRAPHY.BODY.SM, "text-[var(--theme-emphasis)]-darker leading-relaxed")}>
                {suggestion}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

SynthesizerSuggestions.displayName = 'SynthesizerSuggestions';

export default SynthesizerSuggestions;
