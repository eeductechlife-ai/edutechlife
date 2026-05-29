import React, { useRef, useEffect, forwardRef } from 'react';

const AutoGrowTextarea = forwardRef(({ value, onChange, placeholder, className = '', maxLength = 2000, ...props }, ref) => {
  const innerRef = useRef(null);
  const textareaRef = ref || innerRef;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 320)}px`;
    }
  }, [value, textareaRef]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        if (e.target.value.length <= maxLength) onChange(e.target.value);
      }}
      placeholder={placeholder}
      className={`w-full bg-white border-2 border-slate-200 rounded-xl p-5 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-corporate focus:ring-2 focus:ring-corporate/20 resize-none text-sm leading-relaxed min-h-[120px] max-h-[320px] ${className}`}
      {...props}
    />
  );
});

AutoGrowTextarea.displayName = 'AutoGrowTextarea';

export default AutoGrowTextarea;
