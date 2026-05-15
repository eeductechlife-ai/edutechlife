import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';

const ScreenshotProtectionOverlay = ({ isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md flex items-center justify-center select-none"
          style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
          role="alert"
          aria-label="Protección anti-captura activada"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <span
              className="absolute top-1/2 left-1/2 text-[clamp(3rem,15vw,8rem)] font-bold text-white/5 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap select-none"
              style={{ transform: 'translate(-50%, -50%) rotate(-15deg)' }}
            >
              EDUTECHLIFE
            </span>
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="absolute text-white/5 font-bold text-[clamp(1.5rem,8vw,4rem)] whitespace-nowrap select-none"
                style={{
                  top: `${10 + i * 20}%`,
                  left: `${(i * 25) % 100}%`,
                  transform: `rotate(${i % 2 === 0 ? -15 : 15}deg)`,
                }}
              >
                PROTECCIÓN ACTIVA
              </span>
            ))}
          </div>

          <div className="relative flex flex-col items-center text-center px-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center shadow-lg shadow-corporate/30 mb-6"
            >
              <Icon name="fa-shield-halved" className="text-white text-3xl" />
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-white mb-2 font-montserrat"
            >
              Protección anti-captura activada
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-white/60 max-w-sm leading-relaxed"
            >
              La pantalla ha sido bloqueada temporalmente mientras cambias de ventana. 
              Vuelve al examen para continuar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center gap-2 text-white/40 text-xs"
            >
              <div className="w-2 h-2 rounded-full bg-corporate animate-pulse" />
              <span>Esperando tu regreso...</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScreenshotProtectionOverlay;
