import PropTypes from "prop-types";

// Encabezado con degradado para los OVA del Módulo 5. Título legible en móvil y en escritorio.
export default function OvaHeader({ title, intro }) {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#072F46] via-[#0B5F73] to-[#199DB9] p-5 text-white shadow-lg sm:rounded-3xl sm:p-6">
      <span
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10"
        aria-hidden="true"
      />
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-100">
        Módulo 5 · Claude
      </p>
      <h2 className="mt-1.5 break-words text-xl font-extrabold leading-tight !text-white sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-cyan-50">{intro}</p>
    </header>
  );
}

OvaHeader.propTypes = {
  title: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
};
