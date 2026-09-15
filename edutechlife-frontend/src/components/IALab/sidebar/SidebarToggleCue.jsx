import PropTypes from "prop-types";

const SIZES = {
  expanded: "w-3 h-3",
  collapsed: "w-2.5 h-2.5",
};

const SidebarToggleCue = ({ size = "expanded", className = "" }) => {
  const dot = SIZES[size] || SIZES.expanded;
  return (
    <span
      aria-hidden="true"
      data-testid="sidebar-toggle-cue"
      className={`pointer-events-none absolute inset-0 rounded-full ${className}`}
    >
      <span className="absolute inset-0 rounded-full animate-pulse-slow motion-reduce:animate-none bg-[radial-gradient(circle,rgba(0,188,212,0.30),transparent_72%)]" />
      <span
        className={`absolute -top-0.5 -right-0.5 ${dot} rounded-full bg-[var(--theme-primary)]`}
      >
        <span className="absolute inset-0 rounded-full bg-[var(--theme-primary)] animate-ping motion-reduce:animate-none" />
      </span>
    </span>
  );
};

SidebarToggleCue.propTypes = {
  size: PropTypes.oneOf(["expanded", "collapsed"]),
  className: PropTypes.string,
};

export default SidebarToggleCue;
