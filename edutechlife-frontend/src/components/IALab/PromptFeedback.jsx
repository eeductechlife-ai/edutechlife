import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { FORUM_TYPOGRAPHY, FORUM_EFFECTS, cn } from '../forum/forumDesignSystem';

/**
 * Componente para mostrar feedback educativo sobre la optimización de prompts
 */
const PromptFeedback = ({ feedback, technique, analysis, onCopy }) => {
  if (!feedback || !technique || !analysis) return null;

  const { qualityAssessment, improvementsMade, educationalTips, similarExample, nextSteps } = feedback;

  return (
    <div className="space-y-6">
      {/* Resumen de calidad */}
      <div className={cn(
        "p-6 rounded-xl border",
        FORUM_EFFECTS.ANIMATION_FADE_IN
      )} style={{ 
        borderColor: qualityAssessment.color,
        backgroundColor: `${qualityAssessment.color}10`
      }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{qualityAssessment.emoji}</div>
            <div>
              <h4 className={cn(
                FORUM_TYPOGRAPHY.BODY.LG,
                FORUM_TYPOGRAPHY.SEMIBOLD
              )} style={{ color: qualityAssessment.color }}>
                {qualityAssessment.level}
              </h4>
              <p className={cn(
                FORUM_TYPOGRAPHY.BODY.SM,
                "text-slate-600"
              )}>
                Puntuación: {qualityAssessment.score}/100
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Técnica aplicada</div>
            <div className="flex items-center gap-2">
              <div className="text-lg">{technique.icon}</div>
              <span className={cn(
                FORUM_TYPOGRAPHY.BODY.SM,
                FORUM_TYPOGRAPHY.MEDIUM
              )} style={{ color: technique.color }}>
                {technique.name}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown de métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {Object.entries(qualityAssessment.breakdown).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className={cn(
                "text-lg font-bold",
                value >= 70 ? "text-green-600" : 
                value >= 50 ? "text-yellow-600" : "text-red-600"
              )}>
                {value}/100
              </div>
              <div className="text-xs text-slate-600 capitalize">
                {key === 'clarity' ? 'Claridad' :
                 key === 'specificity' ? 'Especificidad' :
                 key === 'context' ? 'Contexto' : 'Estructura'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Técnica aplicada */}
      <div className={cn(
        "p-6 rounded-xl border-l-4",
        FORUM_EFFECTS.ANIMATION_FADE_IN
      )} style={{ 
        borderLeftColor: technique.color,
        animationDelay: '0.1s'
      }}>
        <div className="flex items-start gap-3 mb-4">
          <div className="text-xl mt-1" style={{ color: technique.color }}>
            {technique.icon}
          </div>
          <div className="flex-1">
            <h4 className={cn(
              FORUM_TYPOGRAPHY.BODY.LG,
              FORUM_TYPOGRAPHY.SEMIBOLD,
              "mb-1"
            )}>
              {technique.name}
            </h4>
            <p className={cn(
              FORUM_TYPOGRAPHY.BODY.SM,
              "text-slate-600"
            )}>
              {technique.description}
            </p>
          </div>
        </div>
        <p className={cn(
          FORUM_TYPOGRAPHY.BODY.SM,
          "text-slate-700"
        )}>
          {technique.explanation}
        </p>
      </div>

      {/* Mejoras aplicadas */}
      {improvementsMade && improvementsMade.length > 0 && (
        <div className={cn(
          "p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50",
          FORUM_EFFECTS.ANIMATION_FADE_IN
        )} style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="fa-check-circle" className="text-green-600" />
            <h4 className={cn(
              FORUM_TYPOGRAPHY.BODY.LG,
              FORUM_TYPOGRAPHY.SEMIBOLD,
              "text-green-800"
            )}>
              Mejoras aplicadas
            </h4>
          </div>
          <ul className="space-y-2">
            {improvementsMade.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <Icon name="fa-check" className="text-green-500 mt-1 flex-shrink-0" />
                <span className={cn(
                  FORUM_TYPOGRAPHY.BODY.SM,
                  "text-green-900"
                )}>
                  {improvement}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Consejos educativos */}
      {educationalTips && educationalTips.length > 0 && (
        <div className={cn(
          "p-6 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50",
          FORUM_EFFECTS.ANIMATION_FADE_IN
        )} style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="fa-lightbulb" className="text-blue-600" />
            <h4 className={cn(
              FORUM_TYPOGRAPHY.BODY.LG,
              FORUM_TYPOGRAPHY.SEMIBOLD,
              "text-blue-800"
            )}>
              Consejos para mejorar
            </h4>
          </div>
          <ul className="space-y-3">
            {educationalTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                </div>
                <p className={cn(
                  FORUM_TYPOGRAPHY.BODY.SM,
                  "text-blue-900"
                )}>
                  {tip}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ejemplo similar */}
      {similarExample && (
        <div className={cn(
          "p-6 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50",
          FORUM_EFFECTS.ANIMATION_FADE_IN
        )} style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="fa-book-open" className="text-purple-600" />
            <h4 className={cn(
              FORUM_TYPOGRAPHY.BODY.LG,
              FORUM_TYPOGRAPHY.SEMIBOLD,
              "text-purple-800"
            )}>
              Ejemplo relacionado
            </h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className={cn(
                FORUM_TYPOGRAPHY.BODY.SM,
                FORUM_TYPOGRAPHY.MEDIUM,
                "text-purple-900 mb-1"
              )}>
                Prompt original:
              </p>
              <div className="p-3 bg-white/50 rounded-lg border border-purple-200">
                <p className={cn(
                  FORUM_TYPOGRAPHY.BODY.SM,
                  "text-slate-700 italic"
                )}>
                  "{similarExample.original}"
                </p>
              </div>
            </div>
            
            <div>
              <p className={cn(
                FORUM_TYPOGRAPHY.BODY.SM,
                FORUM_TYPOGRAPHY.MEDIUM,
                "text-purple-900 mb-1"
              )}>
                Prompt optimizado:
              </p>
              <div className="p-3 bg-white/50 rounded-lg border border-purple-200">
                <p className={cn(
                  FORUM_TYPOGRAPHY.BODY.SM,
                  "text-slate-700"
                )}>
                  {similarExample.optimized}
                </p>
              </div>
            </div>
            
            <div>
              <p className={cn(
                FORUM_TYPOGRAPHY.BODY.SM,
                FORUM_TYPOGRAPHY.MEDIUM,
                "text-purple-900 mb-1"
              )}>
                Mejoras clave:
              </p>
              <div className="flex flex-wrap gap-2">
                {similarExample.improvements.map((imp, index) => (
                  <span key={index} className={cn(
                    "px-2 py-1 text-xs rounded-full",
                    "bg-purple-100 text-purple-800"
                  )}>
                    {imp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Próximos pasos */}
      {nextSteps && (
        <div className={cn(
          "p-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50",
          FORUM_EFFECTS.ANIMATION_FADE_IN
        )} style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="fa-arrow-right" className="text-amber-600" />
            <h4 className={cn(
              FORUM_TYPOGRAPHY.BODY.LG,
              FORUM_TYPOGRAPHY.SEMIBOLD,
              "text-amber-800"
            )}>
              Próximos pasos
            </h4>
          </div>
          <ol className="space-y-3">
            {nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-600 text-xs font-bold">{index + 1}</span>
                </div>
                <p className={cn(
                  FORUM_TYPOGRAPHY.BODY.SM,
                  "text-amber-900"
                )}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Análisis detallado */}
      {analysis && analysis.commonProblems && analysis.commonProblems.length > 0 && (
        <div className={cn(
          "p-6 rounded-xl bg-gradient-to-r from-red-50 to-rose-50",
          FORUM_EFFECTS.ANIMATION_FADE_IN
        )} style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="fa-exclamation-triangle" className="text-red-600" />
            <h4 className={cn(
              FORUM_TYPOGRAPHY.BODY.LG,
              FORUM_TYPOGRAPHY.SEMIBOLD,
              "text-red-800"
            )}>
              Problemas identificados
            </h4>
          </div>
          <div className="space-y-3">
            {analysis.commonProblems.map((problem, index) => (
              <div key={index} className="flex items-start gap-3">
                <Icon name="fa-times-circle" className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className={cn(
                    FORUM_TYPOGRAPHY.BODY.SM,
                    FORUM_TYPOGRAPHY.MEDIUM,
                    "text-red-900 mb-1"
                  )}>
                    {problem.problem}
                  </p>
                  <p className={cn(
                    FORUM_TYPOGRAPHY.BODY.XS,
                    "text-red-700"
                  )}>
                    Sugerencia: {problem.suggestion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptFeedback;