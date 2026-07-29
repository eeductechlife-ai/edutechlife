import Skeleton from "../ui/Skeleton";

const VakSkeleton = () => (
  <div className="max-w-3xl mx-auto p-4">
    <div className="flex items-center justify-between mb-6">
      <Skeleton width="64px" height="12px" rounded="full" />
      <Skeleton width="48px" height="24px" rounded="full" />
    </div>
    <div className="mb-8">
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
    <div className="mb-10">
      <Skeleton className="h-8 w-3/4 mb-8" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/50"
          >
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default VakSkeleton;
