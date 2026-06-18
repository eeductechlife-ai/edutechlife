import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Download, RotateCcw, FileText } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nProvider';

const STYLE_META = {
  visual: { label: 'Visual', color: '#4DA8C4', bg: 'bg-[#4DA8C4]/10', icon: '\u{1F441}' },
  auditivo: { label: 'Auditivo', color: '#004B63', bg: 'bg-[#004B63]/10', icon: '\u{1F442}' },
  kinestesico: { label: 'Kinesico', color: '#66CCCC', bg: 'bg-[#66CCCC]/10', icon: '\u{1F590}' },
};

export default function VAKResultReport({ studentData, score, onViewPDF, onRestart, valeria }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (valeria?.valentinaMode && valeria?.announceResults && score) {
      setTimeout(() => valeria.announceResults(), 500);
    }
  }, []);

  if (!score) {
    return <div className="text-center py-12 text-gray-500">{t('vak.ui.no_results')}</div>;
  }

  const radarData = Object.entries(STYLE_META).map(([key, meta]) => ({
    subject: meta.label,
    A: score.intervals[key]?.score || 0,
    fullMark: 100,
  }));

  const sortedStyles = Object.entries(score.intervals)
    .sort(([, a], [, b]) => b.score - a.score);

  const meanAlpha = score.meanAlpha;
  const alphaLabel = meanAlpha >= 0.9 ? t('vak.ui.alpha_excellent')
    : meanAlpha >= 0.8 ? t('vak.ui.alpha_good')
    : meanAlpha >= 0.7 ? t('vak.ui.alpha_acceptable')
    : t('vak.ui.alpha_poor');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#004B63] mb-2">{t('vak.ui.your_results')}</h1>
        <p className="text-gray-500">{studentData.name}, {studentData.age} {t('vak.ui.years')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {sortedStyles.map(([style, data]) => {
          const meta = STYLE_META[style];
          return (
            <div key={style} className={`${meta.bg} rounded-2xl p-6 border-t-4 border-[#004B63]`}>
              <div className="text-3xl mb-2">{meta.icon}</div>
              <h3 className="font-bold text-gray-800">{meta.label}</h3>
              <div className="text-3xl font-bold text-[#004B63] mt-2">{data.score}</div>
              <div className="text-sm text-gray-500">
                {t('vak.ui.ic_95')}: {data.ci95.lower}–{data.ci95.upper}
              </div>
              <div className="text-sm text-gray-500">
                {t('vak.ui.percentile')}: {data.percentile}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
        <div className="w-full max-w-[300px] mx-auto aspect-square">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <Radar name={t('vak.ui.score')} dataKey="A" stroke="#4DA8C4" fill="#4DA8C4" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {meanAlpha !== null && (
        <div className="bg-white rounded-2xl p-4 mb-8 border border-gray-100 shadow-sm text-center">
          <span className="text-sm text-gray-500">{t('vak.ui.reliability')}: </span>
          <span className="font-semibold text-[#004B63]">α = {meanAlpha.toFixed(2)}</span>
          <span className="text-sm text-gray-500 ml-2">({alphaLabel})</span>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={onViewPDF}
          className="flex items-center gap-2 px-6 py-3 bg-[#004B63] text-white rounded-xl hover:bg-[#003d52] transition-all"
        >
          <FileText size={18} /> {t('vak.ui.view_pdf')}
        </button>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
        >
          <RotateCcw size={18} /> {t('vak.ui.retake')}
        </button>
      </div>
    </motion.div>
  );
}
