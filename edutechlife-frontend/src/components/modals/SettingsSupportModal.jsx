import React, { useState } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTheme } from '../../context/ThemeContext';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useFocusTrap from '../../hooks/useFocusTrap';

const faqItems = [
  { question: '¿Cómo accedo a las tutorías en vivo?', answer: 'Las tutorías en vivo se realizan todos los domingos de 4:00 a 6:00 PM (hora Bogotá). Encuentra el enlace directo en la sección "Tutorías Virtuales" del dashboard.' },
  { question: '¿Cómo descargo mi certificado?', answer: 'Completa todos los módulos del curso con una calificación mínima del 80%. El certificado estará disponible automáticamente en tu perfil.' },
  { question: '¿Puedo cambiar mi plan de suscripción?', answer: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento desde la sección de Facturación. Los cambios se aplican en el próximo ciclo de facturación.' },
  { question: '¿Cómo contacto con soporte técnico?', answer: 'Puedes escribirnos a soporte@edutechlife.com o usar el botón "Contactar Soporte" al final de esta sección. Respondemos en menos de 24 horas.' },
  { question: '¿Mi progreso se guarda automáticamente?', answer: 'Sí, tu progreso se guarda automáticamente en la nube cada vez que completas una actividad. Puedes continuar desde cualquier dispositivo.' },
];

const TABS = [
  { key: 'settings', icon: 'fa-cog', label: 'Configuración' },
  { key: 'support', icon: 'fa-headset', label: 'Soporte' },
];

const SettingsSupportModal = ({ isOpen, onClose }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [tab, setTab] = useState('settings');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [notifStudyReminders, setNotifStudyReminders] = useState(() => localStorage.getItem('ialab_notif_study') !== 'false');
  const [notifExamReminders, setNotifExamReminders] = useState(() => localStorage.getItem('ialab_notif_exam') !== 'false');
  const [notifCommunity, setNotifCommunity] = useState(() => localStorage.getItem('ialab_notif_community') !== 'false');
  const [autoMarkViewed, setAutoMarkViewed] = useState(() => localStorage.getItem('ialab_auto_mark') !== 'false');
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem('ialab_compact_mode') === 'true');

  useBodyScrollLock(isOpen);
  const focusTrapRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  const savePref = (key, value, setter) => {
    setter(value);
    localStorage.setItem(key, String(value));
  };

  const settingsSections = [
    {
      icon: 'fa-palette', title: 'Apariencia',
      items: [
        { icon: 'fa-moon', label: 'Modo oscuro', desc: 'Cambia entre tema claro y oscuro', value: isDarkMode, onChange: toggleDarkMode },
        { icon: 'fa-compress', label: 'Modo compacto', desc: 'Reduce el espaciado en las vistas', value: compactMode, onChange: (v) => savePref('ialab_compact_mode', v, setCompactMode) },
      ],
    },
    {
      icon: 'fa-bell', title: 'Notificaciones',
      items: [
        { icon: 'fa-clock', label: 'Recordatorios de estudio', desc: 'Recibe recordatorios para mantener tu racha', value: notifStudyReminders, onChange: (v) => savePref('ialab_notif_study', v, setNotifStudyReminders) },
        { icon: 'fa-file-alt', label: 'Recordatorios de exámenes', desc: 'Notificaciones cuando tengas exámenes pendientes', value: notifExamReminders, onChange: (v) => savePref('ialab_notif_exam', v, setNotifExamReminders) },
        { icon: 'fa-comments', label: 'Actividad en comunidad', desc: 'Notificaciones de respuestas y mensajes en el foro', value: notifCommunity, onChange: (v) => savePref('ialab_notif_community', v, setNotifCommunity) },
      ],
    },
    {
      icon: 'fa-check-circle', title: 'Reproducción y Contenido',
      items: [
        { icon: 'fa-check-double', label: 'Auto-marcar como visto', desc: 'Marca automáticamente los recursos como completados al abrirlos', value: autoMarkViewed, onChange: (v) => savePref('ialab_auto_mark', v, setAutoMarkViewed) },
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
              <h3 className="text-slate-800 font-bold text-base">Configuración y Soporte</h3>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-all" aria-label="Cerrar">
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
                <p className="text-[10px] text-slate-400 text-center">Las preferencias se guardan localmente en tu navegador.</p>
              </div>
            </>
          )}

          {tab === 'support' && (
            <>
              {/* FAQ */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Icon name="fa-question-circle" className="text-petroleum" />
                  Preguntas Frecuentes
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
                    <h4 className="text-xs font-bold text-slate-800">Tour Interactivo</h4>
                    <p className="text-[10px] text-slate-500">Descubre todas las funciones de IALab</p>
                  </div>
                </div>
                <button
                  onClick={() => { localStorage.removeItem('ialab_tour_completed'); onClose(); setTimeout(() => window.location.reload(), 300); }}
                  className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-petroleum to-corporate text-white text-xs font-bold rounded-lg hover:shadow-md hover:shadow-petroleum/20 transition-all duration-200 active:scale-[0.98]"
                >
                  <Icon name="fa-play" className="text-xs mr-1.5" />
                  Volver a ver tour
                </button>
              </div>

              {/* Contacto */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Icon name="fa-envelope" className="text-petroleum" />
                  Contactar Soporte
                </h4>
                <a href="mailto:soporte@edutechlife.com"
                  className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-petroleum rounded-lg shadow-sm hover:shadow hover:border-l-corporate hover:bg-slate-50 transition-all duration-300"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="fa-envelope" className="text-petroleum text-xs" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Email</span>
                    <span className="text-[10px] text-slate-500">soporte@edutechlife.com</span>
                  </div>
                </a>
                <div className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-corporate rounded-lg shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="fa-clock" className="text-petroleum text-xs" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Horario de Atención</span>
                    <span className="text-[10px] text-slate-500">Lun-Vie 8:00 AM - 6:00 PM (Bogotá)</span>
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
