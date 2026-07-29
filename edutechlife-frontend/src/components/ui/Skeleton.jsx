export default function Skeleton({
  width,
  height,
  rounded = "lg",
  className = "",
  shimmer = true,
}) {
  const roundedMap = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <div
      className={`bg-gray-200 dark:bg-slate-700 ${roundedMap[rounded] || roundedMap.lg} ${shimmer ? "skeleton-shimmer" : "animate-pulse"} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
