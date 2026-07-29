import { memo } from 'react';
import Skeleton from "../ui/Skeleton";

const SynthesizerSkeleton = memo(() => (
  <div className="space-y-8">
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-5 w-40" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  </div>
));
SynthesizerSkeleton.displayName = 'SynthesizerSkeleton';

export default SynthesizerSkeleton;
