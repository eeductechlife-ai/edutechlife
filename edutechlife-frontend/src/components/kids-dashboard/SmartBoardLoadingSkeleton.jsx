import { motion } from "framer-motion";

const PulsingBlock = ({ className }) => (
  <motion.div
    className={`rounded-2xl bg-current ${className}`}
    initial={{ opacity: 0.3 }}
    animate={{ opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  />
);

const SmartBoardLoadingSkeleton = ({ darkMode }) => {
  const base = darkMode ? "text-[#1E293B]" : "text-[#E2E8F0]";
  return (
    <div className={`relative z-10 flex h-screen ${base}`}>
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-56 flex-col h-full p-4 gap-4">
        <PulsingBlock className="w-32 h-6" />
        <div className="flex gap-2">
          <PulsingBlock className="w-16 h-4" />
          <PulsingBlock className="w-20 h-4" />
        </div>
        <div className="flex-1 space-y-2 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <PulsingBlock key={i} className="w-full h-10" />
          ))}
        </div>
      </div>

      {/* Main skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar skeleton */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PulsingBlock className="w-10 h-10 rounded-2xl" />
            <div className="space-y-1.5">
              <PulsingBlock className="w-16 h-3" />
              <PulsingBlock className="w-36 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PulsingBlock className="w-28 h-9 rounded-full" />
            <PulsingBlock className="w-16 h-9 rounded-2xl" />
            <PulsingBlock className="w-16 h-9 rounded-2xl" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-6 space-y-4 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <PulsingBlock key={i} className="w-full h-40" />
            ))}
          </div>
          <PulsingBlock className="w-full h-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <PulsingBlock key={i} className="w-full h-48" />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile bottom bar skeleton */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 flex justify-around">
        {[1, 2, 3, 4, 5].map((i) => (
          <PulsingBlock key={i} className="w-12 h-12 rounded-xl" />
        ))}
      </div>
    </div>
  );
};

SmartBoardLoadingSkeleton.displayName = "SmartBoardLoadingSkeleton";
export default SmartBoardLoadingSkeleton;
