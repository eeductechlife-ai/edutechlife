import { memo } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" role="status">
      <div className="w-24 h-24 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
        <Icon name={icon || 'fa-inbox'} className="text-slate-400 text-3xl" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1 max-w-sm">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="mt-4 px-4 py-2 bg-petroleum text-white rounded-xl text-sm font-medium hover:bg-petroleum-dark transition-colors">
          {action.label}
        </button>
      )}
    </div>
  );
}

export default memo(EmptyState);
