import React from 'react';
import { Icon } from '../../../../utils/iconMapping.jsx';

const CASE_META = {
  marketing: { icon: 'fa-chart-line', label: { es: 'Agencia de Marketing', en: 'Marketing Agency' }, color: 'from-violet-500 to-purple-600' },
  support: { icon: 'fa-headset', label: { es: 'Soporte al Cliente', en: 'Customer Support' }, color: 'from-emerald-500 to-teal-600' },
  dev: { icon: 'fa-code', label: { es: 'Desarrollo de Software', en: 'Software Development' }, color: 'from-sky-500 to-cyan-600' },
};

const CaseContextBanner = ({ selectedCase, stepNumber, locale = 'es' }) => {
  if (!selectedCase) return null;
  const meta = CASE_META[selectedCase];
  if (!meta) return null;
  const label = meta.label[locale] || meta.label.es;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-petroleum/5 to-corporate/5 rounded-xl border border-corporate/20 mb-6">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${meta.color} flex items-center justify-center flex-shrink-0`}>
        <Icon name={meta.icon} className="text-white text-sm" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-corporate uppercase tracking-wider">
          {locale === 'en' ? 'Building for' : 'Construyendo para'}
        </p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
      </div>
      <div className="text-xs text-slate-400">
        {locale === 'en' ? `Step ${stepNumber}` : `Paso ${stepNumber}`}
      </div>
    </div>
  );
};

export default CaseContextBanner;
