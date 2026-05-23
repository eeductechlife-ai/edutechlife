import React from 'react';

const SkeletonBlock = React.memo(({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`} />
  );
});
SkeletonBlock.displayName = 'SkeletonBlock';

export function ModuleOverviewSkeleton() {
  return (
    <div className="space-y-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-10 h-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <SkeletonBlock className="h-5 w-48" />
          <SkeletonBlock className="h-3 w-32" />
        </div>
      </div>
      {/* Topics */}
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-3 pl-13">
          <SkeletonBlock className="h-12 w-full" />
          <div className="flex gap-2 pl-14">
            <SkeletonBlock className="h-8 w-16 rounded-full" />
            <SkeletonBlock className="h-8 w-20 rounded-full" />
            <SkeletonBlock className="h-8 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ModuleInfoSkeleton() {
  return (
    <div className="space-y-3 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <SkeletonBlock className="h-5 w-40" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-3/4" />
      <div className="flex gap-2 mt-4">
        <SkeletonBlock className="h-8 w-24 rounded-full" />
        <SkeletonBlock className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function ModuleActionsSkeleton() {
  return (
    <div className="space-y-3 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <SkeletonBlock className="h-5 w-44" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <SkeletonBlock key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function RouteSkeleton() {
  return (
    <div className="space-y-3 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
            <SkeletonBlock className="w-12 h-12 rounded-full" />
            <SkeletonBlock className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ToolsSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonBlock className="h-5 w-36" />
      {[1, 2].map(i => (
        <div key={i} className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="w-10 h-10 rounded-xl" />
            <div className="space-y-2 flex-1">
              <SkeletonBlock className="h-5 w-36" />
              <SkeletonBlock className="h-3 w-56" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonBlock;
