import { memo, useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";

// "⭐ Mis materiales guardados": collapsed list; tapping one reopens it.
const SavedMaterialsList = memo(
  ({ saved, onOpen, onRemove, typeMeta, titleOf, dm }) => {
    const [open, setOpen] = useState(false);
    if (!saved.length) return null;
    const text = dm ? "text-white" : "text-[#1E293B]";
    const sub = dm ? "text-[#94A3B8]" : "text-[#64748B]";

    return (
      <div
        className={`rounded-2xl border ${dm ? "border-[#334155]" : "border-[#E2E8F0]"}`}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold ${text}`}
        >
          <span>⭐ Mis materiales guardados ({saved.length})</span>
          <ChevronDown
            className={`w-4 h-4 opacity-50 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        {open && (
          <ul className="px-2 pb-2 space-y-1">
            {saved.map((m) => (
              <li key={m.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onOpen(m);
                    setOpen(false);
                  }}
                  className={`flex-1 min-w-0 text-left px-3 py-2.5 rounded-xl hover:bg-black/5 ${text}`}
                >
                  <span className="block text-sm font-semibold truncate">
                    {typeMeta(m.type)?.emoji} {titleOf(m)}
                  </span>
                  <span className={`block text-[11px] ${sub}`}>
                    {m.subjectLabel} ·{" "}
                    {new Date(m.savedAt).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(m.id)}
                  aria-label={`Borrar ${titleOf(m)}`}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);

SavedMaterialsList.displayName = "SavedMaterialsList";
export default SavedMaterialsList;
