export function SkeletonModuleCard() {
  return (
    <div
      className="rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 p-5 overflow-hidden relative"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-slate-700/40 animate-shimmer pointer-events-none" />
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-200/70 dark:bg-slate-800/70 rounded w-full" />
          <div className="h-3 bg-slate-200/70 dark:bg-slate-800/70 rounded w-5/6" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-2 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-5 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div
      className="rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 p-5 overflow-hidden relative"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-slate-700/40 animate-shimmer pointer-events-none" />
      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 mb-3" />
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16 mb-2" />
      <div className="h-3 bg-slate-200/70 dark:bg-slate-800/70 rounded w-24" />
    </div>
  );
}

export function SkeletonListRow() {
  return (
    <div
      className="rounded-xl bg-white/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 p-4 flex items-center gap-3 overflow-hidden relative"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-slate-700/40 animate-shimmer pointer-events-none" />
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        <div className="h-3 bg-slate-200/70 dark:bg-slate-800/70 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function PremiumSkeleton({ variant = "card", count = 1, className = "" }) {
  const Component = {
    card: SkeletonModuleCard,
    stat: SkeletonStatCard,
    row: SkeletonListRow,
  }[variant] || SkeletonModuleCard;

  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Cargando contenido">
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
