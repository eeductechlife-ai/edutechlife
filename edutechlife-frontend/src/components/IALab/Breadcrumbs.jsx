import { memo, Fragment } from 'react';
import { Icon } from '../../utils/iconMapping.jsx';
import { useTranslation } from '../../i18n/I18nProvider';

/**
 * Breadcrumbs — Barra de navegación con migas de pan.
 * Renderiza segmentos de ruta clickeables con íconos opcionales
 * y un separador configurable. El último segmento se muestra resaltado.
 *
 * @param {Object}   props
 * @param {Array}    props.segments   - Arreglo de { label, icon?, onClick?, href? }
 * @param {string}   [props.className=''] - Clases CSS adicionales
 * @param {string}   [props.separator='/'] - Caracter separador
 * @param {string}   [props.size='text-xs'] - Clase de tamaño de texto Tailwind
 */
const Breadcrumbs = memo(function Breadcrumbs({ segments, className = '', separator = '/', size = 'text-xs' }) {
  const { t } = useTranslation();
  if (!segments || segments.length === 0) return null;
  const visibleSegments = segments.slice(0, -1);
  const lastSegment = segments[segments.length - 1];

  return (
    <nav aria-label={t('ialab.breadcrumb.aria_label')} className={`mb-2 ${className}`}>
      <ol className={`flex items-center gap-1.5 ${size}`}>
        {visibleSegments.map((seg, i) => (
          <Fragment key={i}>
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
          </Fragment>
        ))}
        {visibleSegments.length > 0 && (
          <li className="text-slate-300 dark:text-slate-600" aria-hidden="true">{separator}</li>
        )}
        <li aria-current="page">
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

