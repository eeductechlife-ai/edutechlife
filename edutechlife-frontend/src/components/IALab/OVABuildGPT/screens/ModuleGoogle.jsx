import { useState } from 'react'
import PropTypes from 'prop-types';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { Mail, FileText, Database, Lightbulb, Check, ArrowRight } from 'lucide-react';
import { Button, Card } from '../shared';


ModuleGoogle.propTypes = {
  onNext: PropTypes.func,
  addXp: PropTypes.func,
};

export default function ModuleGoogle({ onNext, addXp }) {
  const { t } = useTranslation();
  const [emailText, setEmailText] = useState("Hola estudiantes,\nles escribo para desirles que el examen es el lunes. estudien.\n\nSaludos.");
  const [improved, setImproved] = useState(false);

  const improveText = () => {
    setImproved(true);
    addXp(100);
    setEmailText("Estimados estudiantes,\n\nEspero que se encuentren muy bien. Les escribo para recordarles que nuestra próxima evaluación se llevará a cabo este lunes. Les recomiendo revisar los apuntes del Módulo 2.\n\n¡Mucho éxito en su preparación!\n\nAtentamente,\nEl Docente.");
  };

  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
      <h2 className="text-3xl font-bold text-petroleum mb-2">{t('ova.buildgpt.google_title')}</h2>
      <p className="text-gray-600 dark:text-slate-300 mb-6">{t('ova.buildgpt.google_desc')}</p>
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Mail className="text-red-500" />
            <FileText className="text-blue-500" />
            <Database className="text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden">
          <div className="bg-slate-100 dark:bg-slate-700/50 px-4 py-2 border-b dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 flex gap-2">
            <span>Para: alumnos@instituto.edu</span>
          </div>
          <div className="p-4">
            <textarea className="w-full h-32 p-2 border-none resize-none focus:ring-0 text-slate-700 dark:text-slate-300 bg-transparent" value={emailText} readOnly />
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/30 p-3 border-t dark:border-slate-700 flex justify-between items-center">
            <span className="text-xs text-slate-600 dark:text-slate-400">{t('ova.buildgpt.google_draft')}</span>
            {!improved ? (
              <Button onClick={improveText} variant="secondary" className="!py-1.5 !px-4 text-sm" icon={Lightbulb}>
                {t('ova.buildgpt.google_improve')}
              </Button>
            ) : (
              <span className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-1"><Check size={16}/> {t('ova.buildgpt.google_optimized')}</span>
            )}
          </div>
        </div>
      </Card>
      {improved && (
        <div className="flex justify-end animate-[fadeIn_0.6s_ease-out_forwards]">
          <Button onClick={onNext}>{t('ova.buildgpt.google_next')} <ArrowRight size={16}/></Button>
        </div>
      )}
    </div>
  );
}
