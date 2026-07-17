import { memo } from 'react';
import { motion } from 'framer-motion';

const subjects = [
  { value: 'matematicas', label: 'Matemáticas', icon: '🔢' },
  { value: 'lenguaje', label: 'Lenguaje', icon: '📖' },
  { value: 'ciencias', label: 'Ciencias', icon: '🔬' },
  { value: 'sociales', label: 'Sociales', icon: '🌍' },
  { value: 'ingles', label: 'Inglés', icon: '🇺🇸' },
  { value: 'arte', label: 'Arte', icon: '🎨' },
];

const UploadForm = memo(({ subject, onSubjectChange }) => {
  return (
    <div className="mt-4">
      <label className="text-sm font-semibold text-[#004B63] mb-2 block">Materia:</label>
      <div className="grid grid-cols-3 gap-2">
        {subjects.map((subj) => (
          <motion.button
            key={subj.value}
            onClick={() => onSubjectChange(subj.value)}
            className={`p-3 rounded-xl border-2 transition-all text-sm ${
              subject === subj.value
                ? 'border-[#4DA8C4] bg-[#4DA8C4]/10 text-[#004B63] font-semibold'
                : 'border-[#E2E8F0] text-[#64748B] hover:border-[#4DA8C4]/30'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-1">{subj.icon}</span>
            {subj.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
});

UploadForm.displayName = 'UploadForm';

export default UploadForm;
