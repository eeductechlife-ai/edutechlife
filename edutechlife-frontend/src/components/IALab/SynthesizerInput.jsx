import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';
import { FORUM_COMPONENTS, FORUM_TYPOGRAPHY, FORUM_EFFECTS, GRADIENTS, cn } from '../forum/forumDesignSystem';

const SynthesizerInput = React.memo(({
  input,
  setInput,
  loading,
  loadMsg,
  isValidInput,
  quickAnalysis,
  onOptimize,
  onKeyDown,
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={t('ialab.synthesizer_input.placeholder')}
        className={cn(
          FORUM_COMPONENTS.TEXTAREA_BASE,
          "mb-4",
          FORUM_TYPOGRAPHY.BODY.MD,
          "min-h-[140px] resize-none"
        )}
        rows={5}
        disabled={loading}
      />

      {quickAnalysis && (
        <div
          className={cn("mb-4 p-4 rounded-xl border", FORUM_EFFECTS.ANIMATION_FADE_IN)}
          style={{
            borderColor: quickAnalysis.color,
            backgroundColor: `${quickAnalysis.color}10`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-xl">{quickAnalysis.emoji}</div>
              <div>
                <p className={cn(FORUM_TYPOGRAPHY.BODY.SM, FORUM_TYPOGRAPHY.MEDIUM)}>
                  {quickAnalysis.level} ({quickAnalysis.score}/100)
                </p>
                <p className={cn(FORUM_TYPOGRAPHY.BODY.XS, "text-slate-600")}>
                  {quickAnalysis.type} • {quickAnalysis.wordCount} palabras
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div className="text-lg">{quickAnalysis.icon}</div>
                <span className={cn(FORUM_TYPOGRAPHY.BODY.XS, FORUM_TYPOGRAPHY.MEDIUM)}>
                  {quickAnalysis.technique}
                </span>
              </div>
            </div>
          </div>

          {quickAnalysis.suggestions?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className={cn(FORUM_TYPOGRAPHY.BODY.XS, FORUM_TYPOGRAPHY.MEDIUM, "text-slate-700 mb-1")}>
                {t('ialab.synthesizer_input.quick_suggestions')}
              </p>
              <ul className="space-y-1">
                {quickAnalysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Icon name="fa-bullet" className="text-slate-600 text-xs mt-0.5" />
                    <span className={cn(FORUM_TYPOGRAPHY.BODY.XS, "text-slate-600")}>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          {t('ialab.synthesizer_input.chars_count', { length: input.length, status: isValidInput(input) ? t('ialab.synthesizer_input.ready_status') : t('ialab.synthesizer_input.min_status', { remaining: 3 - input.length }) })}
        </div>

        <button
          onClick={onOptimize}
          disabled={loading || !isValidInput(input)}
          className={cn(
            GRADIENTS.PRIMARY,
            "px-6 py-3 rounded-xl text-white",
            FORUM_TYPOGRAPHY.MEDIUM,
            FORUM_EFFECTS.TRANSITION_ALL,
            FORUM_EFFECTS.HOVER_SCALE,
            "flex items-center justify-center gap-2",
            "focus:outline-none focus:ring-2 focus:ring-corporate focus:ring-offset-2",
            "disabled:opacity-70 disabled:cursor-not-allowed",
            loading && "opacity-70 cursor-not-allowed"
          )}
          aria-label={loading ? t('ialab.synthesizer_input.loading_aria', { msg: loadMsg }) : t('ialab.synthesizer_input.generate_aria')}
        >
          {loading ? (
            <>
              <div className={cn("w-5 h-5 border-2 border-white border-t-transparent rounded-full", FORUM_EFFECTS.ANIMATION_SPIN)} />
              <span>{loadMsg}</span>
            </>
          ) : (
            <>
              <Icon name="fa-brain" />
              <span>{t('ialab.synthesizer_input.generate_btn')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
});
SynthesizerInput.displayName = 'SynthesizerInput';

export default SynthesizerInput;
