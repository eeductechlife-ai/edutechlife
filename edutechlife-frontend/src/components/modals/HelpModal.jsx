import React, { useState } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';

const faqItems = [
  {
    question: '¿Cómo accedo a las tutorías en vivo?',
    answer: 'Las tutorías en vivo se realizan todos los domingos de 4:00 a 6:00 PM (hora Bogotá). Encuentra el enlace directo en la sección "Tutorías Virtuales" del dashboard.',
  },
  {
    question: '¿Cómo descargo mi certificado?',
    answer: 'Completa todos los módulos del curso con una calificación mínima del 80%. El certificado estará disponible automáticamente en tu perfil.',
  },
  {
    question: '¿Puedo cambiar mi plan de suscripción?',
    answer: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento desde la sección de Facturación. Los cambios se aplican en el próximo ciclo de facturación.',
  },
  {
    question: '¿Cómo contacto con soporte técnico?',
    answer: 'Puedes escribirnos a soporte@edutechlife.com o usar el botón "Contactar Soporte" al final de esta sección. Respondemos en menos de 24 horas.',
  },
  {
    question: '¿Mi progreso se guarda automáticamente?',
    answer: 'Sí, tu progreso se guarda automáticamente en la nube cada vez que completas una actividad. Puedes continuar desde cualquier dispositivo.',
  },
];

const HelpModal = ({ isOpen, onClose }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200/60 shadow-lg max-h-[85vh] overflow-hidden relative z-10 animate-in fade-in-0 zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-slate-400 bg-white hover:bg-slate-100 hover:text-slate-800 rounded-full transition-all duration-200"
          aria-label="Cerrar"
        >
          <Icon name="fa-times" className="text-lg" />
        </button>

        <div className="border-b border-slate-200/60 bg-gradient-to-r from-[#004B63]/10 to-[#00BCD4]/10 pt-10 pb-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
              <Icon name="fa-headset" className="text-[#004B63] text-sm" />
            </div>
            <h3 className="text-slate-800 font-bold text-base">Centro de Ayuda</h3>
          </div>
        </div>

        <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          {/* Búsqueda rápida */}
          <div className="mb-5 relative">
            <Icon name="fa-search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Buscar en la ayuda..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50 focus:border-[#00BCD4]"
            />
          </div>

          {/* FAQ */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Icon name="fa-question-circle" className="text-[#004B63]" />
              Preguntas Frecuentes
            </h4>
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200/60 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-semibold text-slate-800 pr-2">{item.question}</span>
                    <Icon
                      name={expandedFaq === index ? 'fa-chevron-up' : 'fa-chevron-down'}
                      className="text-slate-400 text-xs flex-shrink-0"
                    />
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

          {/* Contacto */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Icon name="fa-envelope" className="text-[#004B63]" />
              Contactar Soporte
            </h4>

            <a
              href="mailto:soporte@edutechlife.com"
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                <Icon name="fa-envelope" className="text-[#004B63] text-xs" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Email</span>
                <span className="text-[10px] text-slate-500">soporte@edutechlife.com</span>
              </div>
            </a>

            <div className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#00BCD4] rounded-lg shadow-sm">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                <Icon name="fa-clock" className="text-[#004B63] text-xs" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Horario de Atención</span>
                <span className="text-[10px] text-slate-500">Lun-Vie 8:00 AM - 6:00 PM (Bogotá)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
