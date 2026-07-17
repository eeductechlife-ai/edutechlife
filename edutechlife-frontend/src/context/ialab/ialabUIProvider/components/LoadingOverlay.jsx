export function LoadingOverlay({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" role="status">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-petroleum rounded-full animate-spin mb-4" />
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  );
}
