import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nProvider';
import { generateVAKPDF } from './VAKPDFGenerator';

export default function VAKPDFPreview({ studentData, score, onBack, onRestart }) {
  const { t } = useTranslation();

  const handleDownload = () => {
    generateVAKPDF(studentData, score);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-[#004B63] mb-6">{t('vak.ui.pdf_preview')}</h2>
        <div className="space-y-4 mb-8">
          <p className="text-gray-600">{t('vak.ui.pdf_description')}</p>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>• {t('vak.ui.student')}: {studentData.name}</li>
            <li>• {t('vak.ui.age')}: {studentData.age} {t('vak.ui.years')}</li>
            <li>• {t('vak.ui.date')}: {new Date().toLocaleDateString('es-CO')}</li>
          </ul>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-[#4DA8C4] text-white rounded-xl hover:bg-[#3d96b0] transition-all"
          >
            <Download size={18} /> {t('vak.ui.download_pdf')}
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
          >
            <ArrowLeft size={18} /> {t('vak.ui.back_results')}
          </button>
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
          >
            <RotateCcw size={18} /> {t('vak.ui.retake')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
