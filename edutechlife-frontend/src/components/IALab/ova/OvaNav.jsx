import PropTypes from "prop-types";

// Barra de navegación compartida por los OVA del Módulo 5 (atrás y siguiente).
export default function OvaNav({
  onBack,
  onNext,
  back,
  next,
  disabled = false,
}) {
  return (
    <div className="flex gap-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 dark:border-slate-600 dark:text-slate-200"
        >
          {back}
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className="ml-auto rounded-xl bg-cyan-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-40"
        >
          {next}
        </button>
      )}
    </div>
  );
}

OvaNav.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  back: PropTypes.string,
  next: PropTypes.string,
  disabled: PropTypes.bool,
};
