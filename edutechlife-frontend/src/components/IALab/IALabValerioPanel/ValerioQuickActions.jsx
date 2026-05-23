import React from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';

const ValerioQuickActions = ({ quickActions, onAction, disabled }) => {
  return (
    <div className="p-4 border-b border-slate-100">
      <h3 className="text-sm font-medium text-slate-600 mb-3">Acciones rápidas</h3>
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action)}
            disabled={disabled}
            className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm text-slate-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate"
          >
            <Icon name={action.icon} className="text-corporate" />
            <span className="text-left">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ValerioQuickActions;
