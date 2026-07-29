export function LoadingOverlay({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" role="status" aria-label="Loading">
      <div className="spinner-premium w-10 h-10 mb-4">
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  );
}
