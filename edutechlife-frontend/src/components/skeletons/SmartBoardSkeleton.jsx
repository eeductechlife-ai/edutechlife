import Skeleton from "../ui/Skeleton";

export default function SmartBoardSkeleton() {
  return (
    <div className="p-6 space-y-6" aria-label="Loading SmartBoard">
      <Skeleton height="200px" rounded="2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton height="120px" rounded="xl" />
            <Skeleton height="16px" width="70%" rounded="md" />
          </div>
        ))}
      </div>
      <Skeleton height="160px" rounded="xl" />
    </div>
  );
}
