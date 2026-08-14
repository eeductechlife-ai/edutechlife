import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../../utils/iconMapping.jsx';

const ZoneHeading = ({ icon, label, id }) => (
  <div className="flex items-center gap-2 px-1">
    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-petroleum to-corporate flex items-center justify-center flex-shrink-0 shadow-sm">
      <Icon name={icon} className="text-white text-[9px]" aria-hidden="true" />
    </div>
    <span id={id} className="font-display text-[11px] font-bold tracking-[0.14em] uppercase text-petroleum dark:text-[#4DA8C4] whitespace-nowrap leading-none">
      {label}
    </span>
    <div className="flex-1 h-px bg-gradient-to-r from-petroleum/20 via-corporate/20 to-transparent" />
  </div>
);

ZoneHeading.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string,
  id: PropTypes.string,
};

export default React.memo(ZoneHeading);