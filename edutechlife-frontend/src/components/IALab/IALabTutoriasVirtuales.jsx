import React from 'react';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';

const IALabTutoriasVirtuales = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative z-10 bg-white rounded-2xl border border-slate-100 shadow-[0px_4px_16px_rgba(17,17,26,0.05)] p-5 md:p-8 overflow-hidden"
    >
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#004B63]/6 to-[#00BCD4]/4 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#004B63]/4 to-[#00BCD4]/2 rounded-full blur-2xl pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#004B63] via-[#0A3550] to-[#00BCD4] rounded-t-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#004B63] to-[#0A3550] flex items-center justify-center flex-shrink-0">
            <Video className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-[#004B63]">
              Tutorías Virtuales en Vivo
            </h3>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed mt-2">
              ¿Tienes alguna dificultad durante el curso? Te acompañamos en tu proceso.
              Únete a nuestras tutorías virtuales todos los domingos a las 4:00 PM
              para resolver tus dudas en directo.
            </p>
          </div>
        </div>

        <motion.a
          href="#"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-[#004B63] via-[#003A4D] to-[#06B6D4] text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all duration-300"
        >
          <Video className="w-4 h-4" />
          Unirse a la Sala
        </motion.a>
      </div>
    </motion.div>
  );
};

export default IALabTutoriasVirtuales;
