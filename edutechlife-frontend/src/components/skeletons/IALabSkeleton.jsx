import Skeleton from "../ui/Skeleton";

export default function IALabSkeleton() {
  return (
    <div className="p-6 space-y-6" aria-label="Loading IALab">
      <Skeleton height="48px" width="300px" rounded="lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3 p-4 border rounded-xl">
            <Skeleton height="24px" width="60%" rounded="md" />
            <Skeleton height="80px" rounded="lg" />
            <Skeleton height="32px" rounded="full" />
          </div>
        ))}
      </div>
      <Skeleton height="16px" rounded="full" />
      <Skeleton height="120px" rounded="xl" />
    </div>
  );
}
