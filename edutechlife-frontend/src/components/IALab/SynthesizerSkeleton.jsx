import React from 'react';

const SynthesizerSkeleton = React.memo(() => (
  <div className="animate-pulse space-y-8">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl" />
      <div className="space-y-2">
        <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-48" />
        <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32" />
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl" />
      <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl" />
    </div>
    <div className="space-y-3">
      <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-40" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
));
SynthesizerSkeleton.displayName = 'SynthesizerSkeleton';

export default SynthesizerSkeleton;
