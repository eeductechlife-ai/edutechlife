import React, { memo } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';

const Breadcrumbs = memo(function Breadcrumbs({ segments, className = '', separator = '/', size = 'text-xs' }) {
  if (!segments || segments.length === 0) return null;
  const visibleSegments = segments.slice(0, -1);
  const lastSegment = segments[segments.length - 1];

  return (
    <nav aria-label="Breadcrumb" className={`mb-2 ${className}`}>
      <ol className={`flex items-center gap-1.5 ${size} text-slate-500 dark:text-slate-400`}>
        {visibleSegments.map((seg, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <li className="text-slate-300 dark:text-slate-600" aria-hidden="true">{separator}</li>
            )}
            <li>
              {seg.onClick ? (
                <button
                  onClick={seg.onClick}
                  className="font-medium text-slate-500 hover:text-petroleum dark:text-slate-400 dark:hover:text-corporate transition-colors cursor-pointer truncate max-w-[120px] inline-block align-bottom"
                >
                  {seg.icon && <Icon name={seg.icon} className="text-[9px] mr-1 inline" />}
                  {seg.label}
                </button>
              ) : seg.href ? (
                <a
                  href={seg.href}
                  className="font-medium text-slate-500 hover:text-petroleum dark:text-slate-400 dark:hover:text-corporate transition-colors truncate max-w-[120px] inline-block align-bottom"
                >
                  {seg.icon && <Icon name={seg.icon} className="text-[9px] mr-1 inline" />}
                  {seg.label}
                </a>
              ) : (
                <span className="text-slate-500 dark:text-slate-400 truncate max-w-[120px] inline-block align-bottom">
                  {seg.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
        {visibleSegments.length > 0 && (
          <li className="text-slate-300 dark:text-slate-600" aria-hidden="true">{separator}</li>
        )}
        <li>
          <span className="font-semibold text-petroleum dark:text-corporate truncate max-w-[120px] sm:max-w-[200px] inline-block align-bottom">
            {lastSegment.icon && <Icon name={lastSegment.icon} className="text-[9px] mr-1 inline" />}
            {lastSegment.label}
          </span>
        </li>
      </ol>
    </nav>
  );
});

export default Breadcrumbs;

