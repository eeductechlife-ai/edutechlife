import { memo } from 'react';
import { Icon } from '../../../utils/iconMapping';

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

/**
 * @param {Object} props
 * @param {string} props.icon
 * @param {string} props.label
 * @param {() => void} props.onClick
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {string} [props.className]
 */
export const TouchableIcon = memo(({ icon, label, onClick, size = 'md', className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`relative touch-manipulation 
        min-w-[44px] min-h-[44px] flex items-center justify-center
        active:scale-95 transition-transform duration-100 ease-out
        before:content-[''] before:absolute before:-inset-2 before:rounded-xl before:z-[-1]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-emphasis)]/50
        ${className}`}
      {...props}
    >
      <Icon name={icon} className={`${sizeMap[size]} pointer-events-none`} aria-hidden="true" />
    </button>
  );
});

TouchableIcon.displayName = 'TouchableIcon';
export default TouchableIcon;
