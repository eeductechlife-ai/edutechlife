import React from 'react';

const SectionHeader = React.memo(({ title, iconColor = 'from-petroleum to-corporate' }) => (
  <div className="flex items-center gap-2 mb-4 px-0.5">
    <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${iconColor}`} />
    <h2 className="text-[10px] font-bold text-petroleum uppercase tracking-[0.15em]">{title}</h2>
    <div className="flex-1 h-px bg-gradient-to-r from-petroleum/20 to-transparent" />
  </div>
));

export default SectionHeader;
