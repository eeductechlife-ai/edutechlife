import { memo } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../../utils/iconMapping.jsx';

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" role="status">
      <div className="w-24 h-24 mb-4 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
        <Icon name={icon || 'fa-inbox'} className="text-slate-400 dark:text-gray-500 text-3xl" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-200">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 max-w-sm">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="min-h-[44px] mt-4 px-4 py-2 bg-[var(--theme-emphasis)] text-white rounded-xl text-sm font-medium hover:bg-[var(--theme-emphasis)]-dark transition-colors">
          {action.label}
        </button>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
};

export default memo(EmptyState);
