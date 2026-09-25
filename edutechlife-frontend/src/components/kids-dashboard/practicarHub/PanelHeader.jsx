import { X, ArrowLeft } from "lucide-react";

// Inline on wide screens (title + X). Full screen on phones: a bar that
// stays on top while scrolling, with a big "Volver" a kid can always find.
export default function PanelHeader({
  title,
  subtitle,
  onClose,
  fullScreen,
  darkMode,
}) {
  const text = darkMode ? "text-white" : "text-[#1E293B]";
  const sub = darkMode ? "text-[#94A3B8]" : "text-[#64748B]";

  if (fullScreen)
    return (
      <header
        className={`sticky top-0 z-10 -mx-4 -mt-4 mb-1 px-2 py-2 flex items-center gap-1 border-b backdrop-blur-xl ${darkMode ? "bg-[#1E293B]/95 border-[#334155]" : "bg-white/95 border-[#E2E8F0]"}`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`h-11 pl-2 pr-3 !flex items-center gap-1 rounded-xl text-sm font-bold shrink-0 ${text} hover:bg-black/5`}
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          Volver
        </button>
        <div className="min-w-0 flex-1 pr-2">
          <h3 className={`font-black text-sm leading-tight truncate ${text}`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`text-[11px] leading-tight truncate ${sub}`}>
              {subtitle}
            </p>
          )}
        </div>
      </header>
    );

  return (
    <header className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className={`font-bold text-base ${text}`}>{title}</h3>
        {subtitle && <p className={`text-xs mt-0.5 ${sub}`}>{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className={`w-11 h-11 -mr-2 -mt-2 flex items-center justify-center rounded-xl shrink-0 ${sub} hover:bg-black/5`}
      >
        <X className="w-5 h-5" />
      </button>
    </header>
  );
}
