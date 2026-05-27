import React from 'react';
import { Icon } from '../../utils/iconMapping.jsx';

const ResourceBadge = React.memo(({ completed, total, icon }) => (
  <span className={`inline-flex items-center gap-[3px] text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
    completed >= total ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
    completed > 0 ? 'bg-amber-50 text-amber-600 border-amber-200' :
    'bg-slate-50 text-slate-400 border-slate-100'
  }`}>
    <Icon name={icon} className="text-[7px]" /> {completed}/{total}
  </span>
));

export default ResourceBadge;
