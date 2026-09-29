import React from "react";
import { Bot, Volume2, VolumeX, RotateCcw, X } from "lucide-react";
import { COLORS } from "./nicoColors";
import { useTranslation } from "../../i18n/I18nProvider";

/**
 * En móvil/tablet el botón se oculta mientras una sección marcada con
 * `data-hide-floating-chat` (p. ej. el Hero, con sus botones de acción)
 * está en pantalla, para no taparlos.
 */
function useHideOverMarkedSections() {
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    if (
      typeof IntersectionObserver === "undefined" ||
      typeof window.matchMedia !== "function"
    )
      return undefined;
    const small = window.matchMedia("(max-width: 1023px)");
    const visible = new Set();
    const update = () => setHidden(small.matches && visible.size > 0);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.isIntersecting ? visible.add(e.target) : visible.delete(e.target),
        );
        update();
      },
      { threshold: 0.35 },
    );
    const observeAll = () =>
      document
        .querySelectorAll("[data-hide-floating-chat]")
        .forEach((el) => io.observe(el));
    observeAll();
    // Las secciones pueden montarse después (lazy): se vuelven a buscar, como máximo una vez por frame.
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        observeAll();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    small.addEventListener?.("change", update);
    return () => {
      io.disconnect();
      mo.disconnect();
      small.removeEventListener?.("change", update);
    };
  }, []);
  return hidden;
}

export function ChatButton({ onClick }) {
  const { t } = useTranslation();
  const hidden = useHideOverMarkedSections();
  return (
    <button
      onClick={onClick}
      aria-label={t("nico.open_chat_aria")}
      className={`fixed bottom-4 right-4 z-50 w-14 h-14 sm:bottom-6 sm:right-6 sm:w-16 sm:h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-gentle-pulse safe-area-bottom flex items-center justify-center ${
        hidden ? "invisible translate-y-4 opacity-0" : "visible opacity-100"
      }`}
      style={{
        backgroundColor: COLORS.PETROLEUM,
        background: `linear-gradient(135deg, ${COLORS.PETROLEUM} 0%, ${COLORS.CORPORATE} 100%)`,
      }}
    >
      <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white" aria-hidden="true" />
      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-ping" />
    </button>
  );
}

export function ChatHeader({
  audioEnabled,
  onToggleAudio,
  onNewConversation,
  onClose,
}) {
  const { t } = useTranslation();
  const audioLabel = t(audioEnabled ? "nico.audio_off" : "nico.audio_on");
  return (
    <div
      className="p-4 flex items-center justify-between"
      style={{ backgroundColor: COLORS.NAVY }}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.CORPORATE }}
          >
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping"
            style={{ backgroundColor: COLORS.MINT }}
          />
        </div>
        <div>
          <h3 className="font-bold text-white">Nico</h3>
          <p className="text-xs" style={{ color: COLORS.SOFT_BLUE }}>
            {t("nico.support_subtitle")}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleAudio}
          className={`p-2 rounded-lg transition-all duration-300 ${
            audioEnabled
              ? "scale-105 ring-2 ring-opacity-50"
              : "hover:opacity-80"
          }`}
          style={{
            backgroundColor: audioEnabled ? COLORS.MINT : COLORS.PETROLEUM,
            border: audioEnabled ? `2px solid ${COLORS.CORPORATE}` : "none",
          }}
          title={audioLabel}
          aria-label={audioLabel}
        >
          {audioEnabled ? (
            <Volume2 className="w-4 h-4 text-white" />
          ) : (
            <VolumeX className="w-4 h-4 text-white" />
          )}
        </button>

        <button
          onClick={onNewConversation}
          className="p-2 rounded-lg hover:opacity-80 transition"
          style={{ backgroundColor: COLORS.CORPORATE }}
          title={t("nico.new_conversation")}
          aria-label={t("nico.new_conversation_aria")}
        >
          <RotateCcw className="w-4 h-4 text-white" />
        </button>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:opacity-80 transition"
          style={{ backgroundColor: COLORS.PETROLEUM }}
          title={t("nico.close")}
          aria-label={t("nico.close_chat_aria")}
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
