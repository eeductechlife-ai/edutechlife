// Botón del OVA explicativo, con el color de tema de cada OVA.
export function makeBtn(T) {
  return function Btn({
    onClick,
    children,
    primary = false,
    disabled = false,
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:hover:translate-y-0"
        style={
          primary
            ? { background: T.accent, color: "#fff" }
            : {
                border: `2px solid ${T.accent}`,
                color: T.dark ? "#fff" : T.accent,
                background: "transparent",
              }
        }
      >
        {children}
      </button>
    );
  };
}
