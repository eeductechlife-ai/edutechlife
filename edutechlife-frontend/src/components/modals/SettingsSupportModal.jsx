import React, { useState } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTheme } from '../../context/ThemeContext';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useFocusTrap from '../../hooks/useFocusTrap';
import { useTranslation } from '../../i18n/I18nProvider';

const SettingsSupportModal = ({ isOpen, onClose }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [tab, setTab] = useState('settings');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [notifStudyReminders, setNotifStudyReminders] = useState(() => localStorage.getItem('ialab_notif_study') !== 'false');
  const [notifExamReminders, setNotifExamReminders] = useState(() => localStorage.getItem('ialab_notif_exam') !== 'false');
  const [notifCommunity, setNotifCommunity] = useState(() => localStorage.getItem('ialab_notif_community') !== 'false');
  const [autoMarkViewed, setAutoMarkViewed] = useState(() => localStorage.getItem('ialab_auto_mark') !== 'false');
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem('ialab_compact_mode') === 'true');

  const { t } = useTranslation();
  useBodyScrollLock(isOpen);
  const focusTrapRef = useFocusTrap(isOpen);
  const TABS = [
    { key: 'settings', icon: 'fa-cog', label: t('modals.settings.tab_settings') },
    { key: 'support', icon: 'fa-headset', label: t('modals.settings.tab_support') },
  ];
  const faqItems = [
    { question: t('modals.settings.faq_q1'), answer: t('modals.settings.faq_a1') },
    { question: t('modals.settings.faq_q2'), answer: t('modals.settings.faq_a2') },
    { question: t('modals.settings.faq_q3'), answer: t('modals.settings.faq_a3') },
    { question: t('modals.settings.faq_q4'), answer: t('modals.settings.faq_a4') },
    { question: t('modals.settings.faq_q5'), answer: t('modals.settings.faq_a5') },
  ];

  if (!isOpen) return null;

  const savePref = (key, value, setter) => {
    setter(value);
    localStorage.setItem(key, String(value));
  };

  const settingsSections = [
    {
      icon: 'fa-palette', title: t('modals.settings.appearance_title'),
      items: [
        { icon: 'fa-moon', label: t('modals.settings.dark_mode_label'), desc: t('modals.settings.dark_mode_desc'), value: isDarkMode, onChange: toggleDarkMode },
        { icon: 'fa-compress', label: t('modals.settings.compact_mode_label'), desc: t('modals.settings.compact_mode_desc'), value: compactMode, onChange: (v) => savePref('ialab_compact_mode', v, setCompactMode) },
      ],
    },
    {
      icon: 'fa-bell', title: t('modals.settings.notifications_title'),
      items: [
        { icon: 'fa-clock', label: t('modals.settings.notif_study_label'), desc: t('modals.settings.notif_study_desc'), value: notifStudyReminders, onChange: (v) => savePref('ialab_notif_study', v, setNotifStudyReminders) },
        { icon: 'fa-file-alt', label: t('modals.settings.notif_exam_label'), desc: t('modals.settings.notif_exam_desc'), value: notifExamReminders, onChange: (v) => savePref('ialab_notif_exam', v, setNotifExamReminders) },
        { icon: 'fa-comments', label: t('modals.settings.notif_community_label'), desc: t('modals.settings.notif_community_desc'), value: notifCommunity, onChange: (v) => savePref('ialab_notif_community', v, setNotifCommunity) },
      ],
    },
    {
      icon: 'fa-check-circle', title: t('modals.settings.playback_title'),
      items: [
        { icon: 'fa-check-double', label: t('modals.settings.auto_mark_label'), desc: t('modals.settings.auto_mark_desc'), value: autoMarkViewed, onChange: (v) => savePref('ialab_auto_mark', v, setAutoMarkViewed) },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4" ref={focusTrapRef}>
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="w-full max-w-lg bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[85vh] overflow-hidden relative z-10 modal-scrollable">
        {/* Header */}
        <div className="border-b border-slate-200/60 bg-gradient-to-r from-petroleum/10 to-corporate/10 pt-8 pb-0 px-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                <Icon name="fa-cog" className="text-petroleum text-sm" />
              </div>
              <h3 className="text-slate-800 font-bold text-base">{t('modals.settings.title')}</h3>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-all" aria-label={t('modals.settings.close')}>
              <Icon name="fa-times" className="text-lg" />
            </button>
          </div>
          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all duration-200 flex items-center gap-2 ${
                  tab === t.key
                    ? 'bg-white text-petroleum border-t-2 border-petroleum shadow-sm'
                    : 'text-slate-500 hover:text-petroleum hover:bg-white/50'
                }`}
              >
                <Icon name={t.icon} className="text-xs" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 130px)' }}>
          {tab === 'settings' && (
            <>
              {settingsSections.map((section, si) => (
                <div key={si} className={si < settingsSections.length - 1 ? 'mb-6' : ''}>
                  <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Icon name={section.icon} className="text-petroleum" />
                    {section.title}
                  </h4>
                  <div className="space-y-2">
                    {section.items.map((item, ii) => (
                      <div key={ii} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <Icon name={item.icon} className="text-slate-600 text-xs" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                            <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => item.onChange(!item.value)}
                          className={`relative w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 ml-3 ${item.value ? 'bg-petroleum' : 'bg-slate-300'}`}
                          aria-label={item.label}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${item.value ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 text-center">{t('modals.settings.prefs_local')}</p>
              </div>
            </>
          )}

          {tab === 'support' && (
            <>
              {/* FAQ */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Icon name="fa-question-circle" className="text-petroleum" />
                  {t('modals.settings.faq_title')}
                </h4>
                <div className="space-y-2">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border border-slate-200/60 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-xs font-semibold text-slate-800 pr-2">{item.question}</span>
                        <Icon name={expandedFaq === index ? 'fa-chevron-up' : 'fa-chevron-down'} className="text-slate-400 text-xs flex-shrink-0" />
                      </button>
                      {expandedFaq === index && (
                        <div className="px-3 pb-3">
                          <p className="text-xs text-slate-600 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tour */}
              <div className="mb-6 p-4 bg-gradient-to-br from-petroleum/5 to-corporate/5 rounded-xl border border-petroleum/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
                    <Icon name="fa-compass" className="text-petroleum text-sm" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{t('modals.settings.tour_title')}</h4>
                    <p className="text-[10px] text-slate-500">{t('modals.settings.tour_desc')}</p>
                  </div>
                </div>
                <button
                  onClick={() => { localStorage.removeItem('ialab_tour_completed'); onClose(); setTimeout(() => window.location.reload(), 300); }}
                  className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-petroleum to-corporate text-white text-xs font-bold rounded-lg hover:shadow-md hover:shadow-petroleum/20 transition-all duration-200 active:scale-[0.98]"
                >
                  <Icon name="fa-play" className="text-xs mr-1.5" />
                  {t('modals.settings.tour_button')}
                </button>
              </div>

              {/* Contacto */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Icon name="fa-envelope" className="text-petroleum" />
                  {t('modals.settings.contact_title')}
                </h4>
                <a href="mailto:soporte@edutechlife.com"
                  className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-petroleum rounded-lg shadow-sm hover:shadow hover:border-l-corporate hover:bg-slate-50 transition-all duration-300"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="fa-envelope" className="text-petroleum text-xs" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">{t('modals.settings.contact_email')}</span>
                    <span className="text-[10px] text-slate-500">soporte@edutechlife.com</span>
                  </div>
                </a>
                <div className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-corporate rounded-lg shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="fa-clock" className="text-petroleum text-xs" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">{t('modals.settings.contact_hours_title')}</span>
                    <span className="text-[10px] text-slate-500">{t('modals.settings.contact_hours_value')}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsSupportModal;
