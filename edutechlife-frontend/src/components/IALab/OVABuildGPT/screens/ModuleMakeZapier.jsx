import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';;
import { useTranslation } from '../../../../i18n/I18nProvider';
import { Mail, Bot, Database, CheckCircle, Workflow, Zap, Settings } from 'lucide-react';
import { Button, Card } from '../shared';


ModuleMakeZapier.propTypes = {
  onNext: PropTypes.any,
  addXp: PropTypes.any,
};

export default function ModuleMakeZapier({ onNext, addXp }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState('make');
  useEffect(() => { addXp(50); }, [tab]);

  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.6s_ease-out_forwards]">
      <h2 className="text-3xl font-bold text-petroleum mb-2">{t('ova.buildgpt.api_title')}</h2>
      <p className="text-gray-600 dark:text-slate-300 mb-6">{t('ova.buildgpt.api_desc')}</p>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('make')} className={`flex-1 py-3 font-bold rounded-xl transition-all ${tab === 'make' ? 'bg-petroleum text-white shadow-lg' : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border dark:border-slate-600 hover:border-petroleum'}`}>
          <Workflow className="inline mr-2" size={20}/> {t('ova.buildgpt.api_rest')}
        </button>
        <button onClick={() => setTab('zapier')} className={`flex-1 py-3 font-bold rounded-xl transition-all ${tab === 'zapier' ? 'bg-corporate text-white shadow-lg' : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border dark:border-slate-600 hover:border-corporate'}`}>
          <Zap className="inline mr-2" size={20}/> {t('ova.buildgpt.api_webhooks')}
        </button>
      </div>
      <Card className="min-h-[300px]">
        {tab === 'make' ? (
          <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-petroleum mb-2">{t('ova.buildgpt.api_connect_title')}</h3>
                <p className="text-gray-600 dark:text-slate-300">{t('ova.buildgpt.api_connect_desc')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 bg-slate-50 dark:bg-slate-700/30 p-8 rounded-xl border border-slate-200 dark:border-slate-600 overflow-x-auto">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg z-10"><Mail/></div>
                <span className="text-xs font-bold mt-2 text-slate-600 dark:text-slate-300">{t('ova.buildgpt.api_question')}</span>
              </div>
              <div className="w-12 h-1 bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-corporate rounded-full flex items-center justify-center text-white shadow-lg z-10"><Bot/></div>
                <span className="text-xs font-bold mt-2 text-slate-600 dark:text-slate-300">{t('ova.buildgpt.api_process')}</span>
              </div>
              <div className="w-12 h-1 bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg z-10"><Database/></div>
                <span className="text-xs font-bold mt-2 text-slate-600 dark:text-slate-300">{t('ova.buildgpt.api_external')}</span>
              </div>
              <div className="w-12 h-1 bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-petroleum rounded-full flex items-center justify-center text-white shadow-lg z-10"><CheckCircle/></div>
                <span className="text-xs font-bold mt-2 text-slate-600 dark:text-slate-300">{t('ova.buildgpt.api_response')}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-corporate mb-2">{t('ova.buildgpt.api_webhook_title')}</h3>
                <p className="text-gray-600 dark:text-slate-300">{t('ova.buildgpt.api_webhook_desc')}</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600">
              <table className="w-full text-left bg-white dark:bg-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-700/30 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-4 border-b">{t('ova.buildgpt.api_feature')}</th>
                    <th className="p-4 border-b font-bold text-petroleum">{t('ova.buildgpt.api_rest')}</th>
                    <th className="p-4 border-b font-bold text-corporate">{t('ova.buildgpt.api_webhooks')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border-b text-slate-700 dark:text-slate-300">{t('ova.buildgpt.api_direction')}</td>
                    <td className="p-4 border-b text-slate-600 dark:text-slate-300">{t('ova.buildgpt.api_gpt_calls')}</td>
                    <td className="p-4 border-b text-slate-600 dark:text-slate-300">{t('ova.buildgpt.api_app_notifies')}</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b text-slate-700 dark:text-slate-300">{t('ova.buildgpt.api_ideal')}</td>
                    <td className="p-4 border-b text-slate-600 dark:text-slate-300">{t('ova.buildgpt.api_query_data')}</td>
                    <td className="p-4 border-b text-slate-600 dark:text-slate-300">{t('ova.buildgpt.api_receive_notif')}</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{t('ova.buildgpt.api_example')}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{t('ova.buildgpt.api_search_db')}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{t('ova.buildgpt.api_new_form')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
      <div className="flex justify-center mt-8">
        <Button onClick={onNext} icon={Settings} className="text-lg">{t('ova.buildgpt.api_practice_btn')}</Button>
      </div>
    </div>
  );
}
