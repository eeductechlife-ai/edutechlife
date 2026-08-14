const SkeletonBar = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-[#E2E8F0] via-[#CBD5E1] to-[#E2E8F0] rounded-lg ${className}`}
  />
);

const SectionFallback = ({ tab }) => {
  if (tab === "inicio") {
    return (
      <div className="space-y-6 p-4">
        <SkeletonBar className="h-72 md:h-80 w-full" />
        <SkeletonBar className="h-52 w-full" />
        <SkeletonBar className="h-40 w-full" />
      </div>
    );
  }
  if (tab === "calendario") {
    return (
      <div className="space-y-4 p-4">
        <SkeletonBar className="h-8 w-48" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonBar key={i} className="h-12" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <SkeletonBar key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }
  if (tab === "progreso") {
    return (
      <div className="space-y-4 p-4">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBar key={i} className="h-24 flex-1" />
          ))}
        </div>
        <SkeletonBar className="h-8 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonBar className="h-48" />
          <SkeletonBar className="h-48" />
        </div>
      </div>
    );
  }
  if (tab === "actividades") {
    return (
      <div className="space-y-4 p-4">
        <SkeletonBar className="h-12 w-64" />
        <SkeletonBar className="h-40 w-full" />
        <SkeletonBar className="h-40 w-full" />
      </div>
    );
  }
  if (
    tab === "examenes" ||
    tab === "flashcards" ||
    tab === "libros" ||
    tab === "oral"
  ) {
    return (
      <div className="space-y-4 p-4">
        <SkeletonBar className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonBar className="h-32" />
          <SkeletonBar className="h-32" />
          <SkeletonBar className="h-32" />
          <SkeletonBar className="h-32" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4 p-4">
      <SkeletonBar className="h-8 w-48" />
      <SkeletonBar className="h-32 w-full" />
      <SkeletonBar className="h-32 w-3/4" />
    </div>
  );
};

export { SkeletonBar, SectionFallback };
