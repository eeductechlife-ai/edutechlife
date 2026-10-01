import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BADGE = {
  expanded: { box: "w-6 h-6", icon: "w-3.5 h-3.5" },
  collapsed: { box: "w-[18px] h-[18px]", icon: "w-3 h-3" },
};

/**
 * Aviso de que el círculo de progreso abre/cierra el sidebar: un halo que
 * pulsa unas cuantas veces y un "tirador" con chevrón en la esquina del
 * círculo que indica la dirección (‹ ocultar, › mostrar). Una vez que el
 * estudiante lo usa (`learned`) las animaciones se detienen y queda el
 * chevrón estático.
 */
const SidebarToggleCue = ({
  size = "expanded",
  direction = "left",
  learned = false,
  className = "",
}) => {
  const badge = BADGE[size] || BADGE.expanded;
  const Chevron = direction === "right" ? ChevronRight : ChevronLeft;
  const animated = !learned;
  return (
    <span
      aria-hidden="true"
      data-testid="sidebar-toggle-cue"
      className={`pointer-events-none absolute inset-0 rounded-full ${className}`}
    >
      {animated && (
        <span className="absolute inset-0 rounded-full border-2 border-[var(--theme-primary)]/60 animate-ping [animation-iteration-count:4] motion-reduce:animate-none" />
      )}
      <span
        data-testid="sidebar-toggle-handle"
        className={`absolute -bottom-1 -right-1 ${badge.box} rounded-full flex items-center justify-center bg-[var(--theme-primary)] text-white shadow-md ring-2 ring-white dark:ring-slate-800 ${animated ? "animate-toggle-nudge motion-reduce:animate-none" : ""}`}
        style={{ "--nudge": direction === "right" ? 1 : -1 }}
      >
        <Chevron className={badge.icon} strokeWidth={3} />
      </span>
    </span>
  );
};

SidebarToggleCue.propTypes = {
  size: PropTypes.oneOf(["expanded", "collapsed"]),
  direction: PropTypes.oneOf(["left", "right"]),
  learned: PropTypes.bool,
  className: PropTypes.string,
};

export default SidebarToggleCue;
