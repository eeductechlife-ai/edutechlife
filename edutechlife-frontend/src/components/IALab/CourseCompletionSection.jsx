import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';

const COURSE_NAME = 'Introducción a la I.A Generativa';
const TOTAL_MODULES = 5;

const CourseCompletionSection = ({ courseCompleted, courseProgress, completedModulesCount, onViewCertificate, onGenerateCertificate, isGenerating }) => {
  const requirements = [
    { label: 'Módulos completados', done: completedModulesCount >= TOTAL_MODULES, current: `${completedModulesCount}/${TOTAL_MODULES}` },
    { label: 'Progreso mínimo 80%', done: courseProgress >= 80, current: `${Math.round(courseProgress)}%` },
    { label: 'Exámenes aprobados', done: courseCompleted, current: courseCompleted ? 'Sí' : 'Pendiente' }
  ];

  if (courseCompleted) {
    return (
      <div className="px-1 w-full">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#004B63] via-[#0A3550] to-[#00BCD4] p-5 shadow-lg">
          {/* Decoración */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-6 translate-x-6" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
          
          {/* Icono de celebración animado */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className="flex justify-center mb-4"
          >
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="fa-trophy" className="text-[#FFD166] text-2xl" />
            </div>
          </motion.div>

          {/* Mensaje de felicitación */}
          <div className="text-center relative z-10">
            <h3 className="text-sm font-bold text-white mb-1.5 tracking-wide">
              ¡Felicitaciones!
            </h3>
            <p className="text-xs text-white/85 leading-relaxed mb-4">
              Has terminado el curso de <span className="font-semibold text-white">{COURSE_NAME}</span>
            </p>

            {/* Checklist de logros */}
            <div className="space-y-1.5 mb-4 text-left">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                  <Icon name="fa-check-circle" className="text-[#FFD166] text-xs flex-shrink-0" />
                  <span className="text-[10px] text-white/90 flex-1">{req.label}</span>
                  <span className="text-[10px] font-semibold text-white">{req.current}</span>
                </div>
              ))}
            </div>

            {/* Botón Ver Certificado */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(255,209,102,0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onViewCertificate}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white rounded-xl text-[#004B63] font-bold text-xs shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Icon name="fa-award" className="text-sm" />
              Ver mi Certificado
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  /* Sin completar: mostrar progreso motivacional */
  return (
    <div className="px-1 w-full">
      <div className="rounded-xl border border-[#004B63]/10 bg-gradient-to-r from-[#004B63]/5 to-[#00BCD4]/5 p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
            <Icon name="fa-graduation-cap" className="text-[#004B63] text-sm" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Certificación</p>
            <p className="text-xs font-bold text-slate-700 leading-tight">{COURSE_NAME}</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-slate-600">Avance hacia certificación</span>
            <span className="text-[10px] text-slate-500">{Math.round(courseProgress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#004B63] to-[#00BCD4] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(courseProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Requisitos pendientes */}
        <div className="space-y-1.5">
          {requirements.map((req, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${req.done ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                <Icon
                  name={req.done ? 'fa-check' : 'fa-circle'}
                  className={`text-[8px] ${req.done ? 'text-emerald-600' : 'text-slate-300'}`}
                />
              </div>
              <span className="text-[10px] text-slate-600 flex-1">{req.label}</span>
              <span className={`text-[10px] font-medium ${req.done ? 'text-emerald-600' : 'text-slate-400'}`}>
                {req.current}
              </span>
            </div>
          ))}
        </div>

        {/* Mensaje motivacional */}
        {completedModulesCount > 0 && (
          <div className="mt-3 flex items-start gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200/50">
            <Icon name="fa-trophy" className="text-amber-500 text-xs flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-700 leading-relaxed">
              ¡Sigue avanzando! Llevas <span className="font-semibold">{completedModulesCount}/{TOTAL_MODULES}</span> módulos. Completa los restantes para obtener tu certificado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCompletionSection;
