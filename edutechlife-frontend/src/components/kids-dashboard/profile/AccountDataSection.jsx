import { memo, useState } from "react";
import { Download, KeyRound, Trash2, Loader2 } from "lucide-react";
import useFocusTrap from "../../../hooks/useFocusTrap";
import {
  useAccountData,
  isDeleteConfirmed,
  DELETE_CONFIRM_WORD,
} from "../../../hooks/useAccountData";

function Status({ state, dm }) {
  if (state.status !== "done" && state.status !== "error") return null;
  const error = state.status === "error";
  return (
    <p
      role={error ? "alert" : "status"}
      className="!m-0 mt-1.5 px-1 text-xs font-semibold leading-snug"
      style={{
        color: error
          ? dm
            ? "#FCA5A5"
            : "#B91C1C"
          : dm
            ? "#86EFAC"
            : "#166534",
      }}
    >
      {state.message}
    </p>
  );
}

function DeleteDialog({ dm, state, onConfirm, onClose }) {
  const trapRef = useFocusTrap(true);
  const [typed, setTyped] = useState("");
  const working = state.status === "working";
  const ready = isDeleteConfirmed(typed) && !working;
  const card = dm ? "#1A2744" : "#FFFFFF";
  const text = dm ? "#F1F5F9" : "#1E293B";
  const muted = dm ? "#CBD5E1" : "#475569";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={working ? undefined : onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !working) onClose();
      }}
    >
      <div
        ref={trapRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-data-title"
        aria-describedby="delete-data-desc"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-2xl p-5 shadow-2xl"
        style={{ background: card }}
      >
        <h3
          id="delete-data-title"
          className="!m-0 text-base font-black"
          style={{ color: text }}
        >
          ¿Borrar todos mis datos?
        </h3>
        <p
          id="delete-data-desc"
          className="!m-0 mt-2 text-sm leading-snug"
          style={{ color: muted }}
        >
          Se borran para siempre tu perfil, tus puntos, tu ADN de Aprendizaje,
          tus notas, tu plan y tus chats con Dani. No se puede deshacer y
          después se cierra tu sesión.
        </p>
        <label
          htmlFor="delete-data-confirm"
          className="block mt-4 mb-1 text-sm font-bold"
          style={{ color: text }}
        >
          Escribe {DELETE_CONFIRM_WORD} para confirmar
        </label>
        <input
          id="delete-data-confirm"
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          disabled={working}
          className="w-full px-3 py-2.5 rounded-xl border-2 text-base font-bold tracking-wider outline-none"
          style={{
            background: dm ? "#0F172A" : "#F8FAFC",
            borderColor: isDeleteConfirmed(typed) ? "#B91C1C" : "#CBD5E1",
            color: text,
          }}
        />
        <Status state={state} dm={dm} />
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={working}
            className="flex-1 min-h-[44px] rounded-xl text-sm font-bold"
            style={{
              background: dm ? "rgba(255,255,255,0.08)" : "#F1F5F9",
              color: text,
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(typed)}
            disabled={!ready}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-black text-white disabled:opacity-40"
            style={{ background: "#B91C1C" }}
          >
            {working ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            )}
            Borrar todo
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * «Mis datos»: descargar, borrar y cambiar la contraseña. La cuenta solo tenía
 * editar perfil, modo oscuro, conectar con padres y cerrar sesión.
 */
const AccountDataSection = memo(function AccountDataSection({ dm, navigate }) {
  const {
    download,
    removal,
    password,
    downloadData,
    deleteData,
    sendPasswordEmail,
  } = useAccountData({ navigate });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const rowStyle = {
    background: dm ? "rgba(255,255,255,0.06)" : "rgba(0,75,99,0.06)",
    border: `1px solid ${dm ? "#243152" : "#E2E8F0"}`,
    color: dm ? "#F1F5F9" : "#0F172A",
  };
  const rowClass =
    "w-full min-h-[44px] flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left disabled:opacity-60";

  return (
    <section aria-labelledby="my-data-title" className="space-y-2 pt-1">
      <h3
        id="my-data-title"
        className="!m-0 px-1 text-xs font-black uppercase tracking-wide"
        style={{ color: dm ? "#CBD5E1" : "#475569" }}
      >
        Mis datos
      </h3>

      <div>
        <button
          type="button"
          onClick={downloadData}
          disabled={download.status === "working"}
          className={rowClass}
          style={rowStyle}
        >
          {download.status === "working" ? (
            <Loader2
              className="w-4 h-4 flex-shrink-0 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Download className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          )}
          {download.status === "working"
            ? "Preparando tus datos…"
            : "Descargar mis datos"}
        </button>
        <Status state={download} dm={dm} />
      </div>

      <div>
        <button
          type="button"
          onClick={sendPasswordEmail}
          disabled={password.status === "working"}
          className={rowClass}
          style={rowStyle}
        >
          {password.status === "working" ? (
            <Loader2
              className="w-4 h-4 flex-shrink-0 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <KeyRound className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          )}
          Cambiar mi contraseña
        </button>
        <Status state={password} dm={dm} />
      </div>

      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className={rowClass}
        style={{
          background: dm ? "rgba(239,68,68,0.12)" : "#FEF2F2",
          border: `1px solid ${dm ? "#7F1D1D" : "#FECACA"}`,
          color: dm ? "#FCA5A5" : "#B91C1C",
        }}
      >
        <Trash2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        Borrar mis datos
      </button>

      {confirmOpen && (
        <DeleteDialog
          dm={dm}
          state={removal}
          onConfirm={deleteData}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </section>
  );
});

export default AccountDataSection;
