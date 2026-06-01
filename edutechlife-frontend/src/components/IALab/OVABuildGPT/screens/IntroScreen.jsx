import { useEffect } from 'react';
import { useTranslation } from '../../../../i18n/I18nProvider';
import { CheckCircle, Bot, Workflow, ChevronRight } from 'lucide-react';
import { Button, Card } from '../shared';

export default function IntroScreen({ onNext, addXp }) {
  const { t } = useTranslation();
  useEffect(() => { addXp(50); }, []);
  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
      <Card>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-petroleum">{t('ova.buildgpt.intro_title')}</h2>
            </div>
            <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed">
              {t('ova.buildgpt.intro_text')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-cyan-50 dark:bg-slate-700/30 p-5 rounded-xl border border-cyan-100 dark:border-slate-600">
                <Bot className="text-corporate mb-3" size={28} />
                <h3 className="font-bold text-petroleum mb-2">{t('ova.buildgpt.intro_gpt_title')}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-300">{t('ova.buildgpt.intro_gpt_desc')}</p>
              </div>
              <div className="bg-gradient-to-br from-corporate/10 to-petroleum/10 p-5 rounded-xl border border-corporate/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2"><CheckCircle className="text-corporate" size={20}/></div>
                <Workflow className="text-petroleum mb-3" size={28} />
                <h3 className="font-bold text-petroleum mb-2">{t('ova.buildgpt.intro_actions_title')}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-300">{t('ova.buildgpt.intro_actions_desc')}</p>
              </div>
            </div>
            <Button onClick={onNext} icon={ChevronRight} className="mt-4">{t('ova.buildgpt.intro_btn')}</Button>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-corporate to-petroleum rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="IA Educativa" loading="lazy" className="rounded-2xl shadow-2xl relative z-10 object-cover w-full max-h-80 h-auto" />
          </div>
        </div>
      </Card>
    </div>
  );
}
