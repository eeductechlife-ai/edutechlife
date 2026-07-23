import Skeleton from "../ui/Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6" aria-label="Loading dashboard">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} height="100px" rounded="xl" />
        ))}
      </div>
      <Skeleton height="300px" rounded="xl" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height="60px" rounded="lg" />
        ))}
      </div>
    </div>
  );
}
