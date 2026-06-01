const IALabForumSkeleton = ({ showHeader }) => (
  <div className="animate-pulse space-y-6">
    {showHeader && (
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-3">
          <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-48"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32"></div>
        </div>
        <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-32"></div>
      </div>
    )}
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-full"></div>
            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-5/6"></div>
            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-4/6"></div>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-24"></div>
            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-20"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default IALabForumSkeleton;
