import { Icon } from '../../../../utils/iconMapping';
import AutoSaveIndicator from '../../challenges/shared/AutoSaveIndicator';
import { useTranslation } from '../../../../i18n/I18nProvider';

export function LoadingState({ loadingType }) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-petroleum/20 to-corporate/20 flex items-center justify-center mb-6">
        <div className="w-10 h-10 border-3 border-corporate border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h3 className="text-xl font-bold text-slate-700 mb-2">
        {loadingType === 'loading' ? t('ialab.evaluation.modal.ai_designing') : t('ialab.evaluation.modal.evaluating')}
      </h3>
      <p className="text-slate-500 text-center max-w-md">
        {t('ialab.evaluation.modal.loading_desc')}
      </p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
        <Icon name="fa-exclamation-triangle" className="text-red-400 text-3xl" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-slate-700 mb-2">{t('ialab.evaluation.modal.load_error_title')}</h3>
      <p className="text-slate-500 text-center max-w-md mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
      >
        <Icon name="fa-redo" className="mr-2" aria-hidden="true" />
        {t('ialab.evaluation.modal.retry')}
      </button>
    </div>
  );
}

export function StepContent({
  steps, step, totalSteps, exercises, responses, titleKeys, descKeys,
  setResponse, formError, handlePrevStep, handleNextStep, handleSubmitEvaluation,
  securityWarning, generateExercises, locale, fallbackMode, isSavingGrade, loading,
  handleSecurityEvent, t,
}) {
  if (!exercises) return null;

  const StepComponent = steps[step - 1];
  const exerciseKeys = Object.keys(exercises);
  const currentExercise = step <= exerciseKeys.length ? exercises[exerciseKeys[step - 1]] : exercises;
  const responseKey = `ej${step}`;

  const ej1Parsed = (() => {
    try { return JSON.parse(responses.ej1 || '{}'); }
    catch { return {}; }
  })();
  const selectedCase = ej1Parsed.selectedCase || '';
  const researchTopic = ej1Parsed.topic || currentExercise?.temaInvestigacion || currentExercise?.documentos?.[0]?.tema || '';
  const selectedDocCount = (() => {
    try { return JSON.parse(responses.ej1 || '{}').documents?.length || 0; }
    catch { return 0; }
  })();

  const selectedDocs = (() => {
    try {
      const ej1 = JSON.parse(responses.ej1 || '{}');
      const docs = ej1.documents || [];
      return docs.map(d => {
        const docObj = currentExercise?.documentos?.[d.index];
        return docObj ? { index: d.index, title: docObj.titulo, tipo: docObj.tipo } : null;
      }).filter(Boolean);
    } catch { return []; }
  })();

  const step1Biases = (() => {
    try {
      const ej1 = JSON.parse(responses.ej1 || '{}');
      const rawBiases = ej1.biases || [];
      const tiposSesgo = exercises?.tiposSesgo || [];
      return rawBiases.map(b => ({
        index: b.index,
        label: typeof tiposSesgo[b.index] === 'string' ? tiposSesgo[b.index] : (tiposSesgo[b.index]?.nombre || `Bias #${b.index}`),
        pipeline: b.pipeline,
      }));
    } catch { return []; }
  })();

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      {fallbackMode && (
        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Icon name="fa-wifi-slash" className="text-amber-600 text-sm" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-amber-800">{t('ialab.evaluation.modal.offline_title')}</p>
            <p className="text-[10px] text-amber-600">{t('ialab.evaluation.modal.offline_desc')}</p>
          </div>
          <button
            onClick={() => generateExercises(locale)}
            className="text-[10px] font-semibold text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
          >
            <Icon name="fa-redo" className="mr-1" aria-hidden="true" />
            {t('ialab.evaluation.modal.retry')}
          </button>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center">
            <Icon name="fa-clipboard-check" className="text-white text-xl" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {t(titleKeys[step - 1] || 'ialab.evaluation.modal.step1_title')}
              </h2>
              <AutoSaveIndicator response={responses[responseKey] || ''} />
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              {t(descKeys[step - 1] || '')}
            </p>
          </div>
        </div>
      </div>

      <div
        className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6 mb-8"
        onCopy={handleSecurityEvent}
        onPaste={handleSecurityEvent}
        onCut={handleSecurityEvent}
        onContextMenu={handleSecurityEvent}
        role="region"
        aria-label={t(titleKeys[step - 1] || 'ialab.evaluation.modal.step1_title')}
        aria-describedby={formError ? 'evaluation-form-error' : undefined}
      >
        {StepComponent && (
          <StepComponent
            exercise={currentExercise}
            response={responses[responseKey] || ''}
            onResponseChange={(response) => setResponse(responseKey, response)}
            t={t}
            selectedCase={selectedCase}
            topic={researchTopic}
            docCount={selectedDocCount}
            selectedDocs={selectedDocs}
            exercises={exercises}
            biases={step1Biases}
            stepId={step}
          />
        )}
      </div>

      {formError && (
        <div id="evaluation-form-error" role="alert" aria-live="assertive" className="mb-4 px-4 py-3 bg-red-500/90 text-white rounded-xl text-sm font-medium flex items-center gap-2">
          <Icon name="fa-exclamation-circle" aria-hidden="true" />
          {formError}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevStep}
          disabled={step === 1 || loading}
          className="px-6 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="fa-arrow-left" className="mr-2" aria-hidden="true" />
          {t('ialab.evaluation.modal.previous')}
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            {t('ialab.evaluation.modal.step_of', { step, total: totalSteps })}
          </span>

          {step < totalSteps ? (
            <button
              onClick={handleNextStep}
              disabled={!responses[responseKey] || loading}
              className="px-6 py-3 bg-gradient-to-r from-petroleum to-corporate text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('ialab.evaluation.modal.next')}
              <Icon name="fa-arrow-right" className="ml-2" aria-hidden="true" />
            </button>
          ) : (
            <button
              onClick={handleSubmitEvaluation}
              disabled={!responses[responseKey] || loading || isSavingGrade}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSavingGrade ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('ialab.evaluation.modal.saving_grade')}
                </>
              ) : (
                <>
                  <Icon name="fa-paper-plane" aria-hidden="true" />
                  {t('ialab.evaluation.modal.submit_evaluation')}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
