import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const ZOOMS = [1, 1.5, 2, 3];

// Study view for a mind map / infographic. Rendered in a portal because the
// hub's animated ancestors use transforms, which would trap `position: fixed`.
export default function FullscreenViewer({ title, onClose, children }) {
  const rootRef = useRef(null);
  const closeRef = useRef(null);
  const [zoomIdx, setZoomIdx] = useState(0);
  const zoom = ZOOMS[zoomIdx];

  useEffect(() => {
    const root = rootRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    // Real fullscreen hides the browser chrome; the overlay alone still works
    // where the API is missing or refused (iOS Safari, embedded views).
    root?.requestFullscreen?.().catch(() => {});

    // Capture phase + stop: the material sheet behind also closes on Escape,
    // which would throw away the kid's generated map.
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        e.preventDefault();
        onClose();
      } else if (e.key === "+" || e.key === "=")
        setZoomIdx((i) => Math.min(ZOOMS.length - 1, i + 1));
      else if (e.key === "-") setZoomIdx((i) => Math.max(0, i - 1));
      else if (e.key === "0") setZoomIdx(0);
    };
    // Leaving browser fullscreen (Esc handled by the browser) closes the viewer too.
    const onFsChange = () => {
      if (!document.fullscreenElement) onClose();
    };
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("fullscreenchange", onFsChange);
      document.body.style.overflow = prevOverflow;
      if (document.fullscreenElement)
        document.exitFullscreen?.().catch(() => {});
    };
  }, [onClose]);

  const btn =
    "w-11 h-11 grid place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} en pantalla completa`}
      className="!fixed inset-0 !z-[1000] !flex flex-col bg-[#0B1220]"
    >
      <div className="flex items-center gap-2 px-3 py-2 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] border-b border-white/10">
        <p className="!m-0 flex-1 min-w-0 text-sm font-black text-white truncate">
          {title}
        </p>
        <button
          type="button"
          className={btn}
          onClick={() => setZoomIdx((i) => Math.max(0, i - 1))}
          disabled={zoomIdx === 0}
          aria-label="Alejar"
        >
          <ZoomOut className="w-5 h-5" aria-hidden="true" />
        </button>
        <span className="w-12 text-center text-xs font-black text-white/80 tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          className={btn}
          onClick={() => setZoomIdx((i) => Math.min(ZOOMS.length - 1, i + 1))}
          disabled={zoomIdx === ZOOMS.length - 1}
          aria-label="Acercar"
        >
          <ZoomIn className="w-5 h-5" aria-hidden="true" />
        </button>
        {zoomIdx > 0 && (
          <button
            type="button"
            className={btn}
            onClick={() => setZoomIdx(0)}
            aria-label="Ajustar a la pantalla"
          >
            <Maximize2 className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
        <button
          ref={closeRef}
          type="button"
          className={`${btn} ml-1 bg-white/20`}
          onClick={onClose}
          aria-label="Cerrar pantalla completa"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-auto overscroll-contain p-3 sm:p-6 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
        <div
          className="mx-auto rounded-2xl overflow-hidden bg-white shadow-2xl transition-[width] duration-200"
          style={{ width: `min(${zoom * 100}%, ${zoom * 1400}px)` }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
