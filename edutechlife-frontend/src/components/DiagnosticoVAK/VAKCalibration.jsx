import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Mail, Phone, Smile, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nProvider';

const MOOD_OPTIONS = [
  { value: 'excited', icon: '\u{1F604}', labelKey: 'vak.ui.mood_excited' },
  { value: 'happy', icon: '\u{1F642}', labelKey: 'vak.ui.mood_happy' },
  { value: 'neutral', icon: '\u{1F610}', labelKey: 'vak.ui.mood_neutral' },
  { value: 'nervous', icon: '\u{1F630}', labelKey: 'vak.ui.mood_nervous' },
  { value: 'tired', icon: '\u{1F634}', labelKey: 'vak.ui.mood_tired' },
];

export default function VAKCalibration({ initialData, onComplete, valeria }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    age: initialData?.age || 12,
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    mood: initialData?.mood || 'neutral',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (valeria?.valentinaMode && valeria?.speakAsValentina) {
      valeria.speakAsValentina(t('vak.ui.valeria_calibration_welcome'));
    }
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t('vak.ui.error_name');
    if (!form.age || form.age < 4 || form.age > 18) e.age = t('vak.ui.error_age');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (valeria?.valentinaMode && valeria?.speakAsValentina) {
      valeria.speakAsValentina(t('vak.ui.valeria_calibration_done', { name: form.name }));
    }
    onComplete(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-bold text-[#004B63] mb-6">{t('vak.ui.calibration_title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <User size={16} /> {t('vak.ui.name')}
          </label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 outline-none transition-all"
            placeholder={t('vak.ui.name_placeholder')}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Calendar size={16} /> {t('vak.ui.age')}
          </label>
          <input
            type="number"
            min={4}
            max={18}
            value={form.age}
            onChange={e => setForm(f => ({ ...f, age: parseInt(e.target.value) || 12 }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 outline-none transition-all"
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Mail size={16} /> {t('vak.ui.email')}
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 outline-none transition-all"
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Phone size={16} /> {t('vak.ui.phone')}
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4DA8C4] focus:ring-2 focus:ring-[#4DA8C4]/20 outline-none transition-all"
            placeholder="+57 300 123 4567"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Smile size={16} /> {t('vak.ui.how_do_you_feel')}
          </label>
          <div className="flex gap-3 justify-center">
            {MOOD_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, mood: opt.value }))}
                className={`p-3 rounded-xl text-2xl transition-all ${
                  form.mood === opt.value
                    ? 'bg-[#4DA8C4]/20 ring-2 ring-[#4DA8C4] scale-110'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                title={t(opt.labelKey)}
              >
                {opt.icon}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#004B63] to-[#4DA8C4] text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {t('vak.ui.start_test')} <ArrowRight size={18} />
        </button>
      </form>
    </motion.div>
  );
}
