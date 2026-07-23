import Skeleton from "../ui/Skeleton";

export default function VAKSkeleton() {
  return (
    <div className="p-6 space-y-6" aria-label="Loading VAK Diagnosis">
      <Skeleton height="36px" width="280px" rounded="lg" />
      <div className="space-y-4 p-6 border rounded-xl">
        <Skeleton height="24px" width="80%" rounded="md" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height="48px" rounded="lg" />
          ))}
        </div>
      </div>
      <Skeleton height="8px" rounded="full" />
    </div>
  );
}
