// Esqueleto de carga mostrado durante la transición entre preguntas del test VAK.
// Componente puramente presentacional: no depende de estado del padre.
const VakSkeleton = () => (
  <div className="max-w-3xl mx-auto p-4">
    <div className="flex items-center justify-between mb-6">
      <div className="h-3 w-16 bg-gray-200 rounded-full animate-pulse" />
      <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse" />
    </div>
    <div className="mb-8">
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full w-0 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
    <div className="mb-10">
      <div className="h-8 w-3/4 bg-gray-200 rounded-lg animate-pulse mb-8" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 rounded-2xl bg-gray-100 animate-pulse"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default VakSkeleton;
