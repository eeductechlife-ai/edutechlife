/**
 * MAX UI Enhancements
 * Componentes profesionales para mejor UX:
 * - Toast notifications
 * - Loading skeletons
 * - Copy buttons
 * - Typing indicators
 * - Export conversations
 */

import React, { useEffect, useState } from "react";
import { Icon } from "../../../utils/iconMapping.jsx";
import { useTranslation } from "../../../i18n/I18nProvider";

/**
 * Toast Notification Component
 * Notificaciones no-invasivas tipo Slack
 */
export const Toast = ({
  message,
  type = "info", // 'info' | 'success' | 'error' | 'warning'
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  }[type];

  const iconName = {
    success: "fa-check",
    error: "fa-x",
    warning: "fa-exclamation",
    info: "fa-info",
  }[type];

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300`}
      role="alert"
    >
      <Icon name={iconName} className="text-sm" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

/**
 * Toast Container - Maneja múltiples toasts
 */
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  // Exponemos el método para agregar toasts globalmente
  React.useImperativeHandle(React.createRef(), () => ({
    show: (message, type = "info", duration = 3000) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      return id;
    },
  }));

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
};

/**
 * Loading Skeleton
 * Placeholder profesional mientras carga contenido
 */
export const MessageSkeleton = () => (
  <div className="flex justify-start mb-4 animate-pulse">
    <div className="max-w-[80%] rounded-2xl p-4 bg-slate-200 w-[200px] h-[60px]" />
  </div>
);

export const ConversationSkeleton = () => (
  <div className="space-y-4">
    <MessageSkeleton />
    <div className="flex justify-end mb-4 animate-pulse">
      <div className="max-w-[80%] rounded-2xl p-4 bg-[var(--theme-emphasis)]/20 w-[180px] h-[40px]" />
    </div>
    <MessageSkeleton />
  </div>
);

/**
 * Copy to Clipboard Button
 * Botón elegante para copiar respuestas
 */
export const CopyButton = ({ text, label }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-xs px-2 py-1 rounded transition-all ${
        copied
          ? "bg-green-500 text-white"
          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
      }`}
      title={t("ialab.valerio.copy.title")}
    >
      <Icon name={copied ? "fa-check" : "fa-copy"} className="text-xs mr-1" />
      {copied
        ? t("ialab.valerio.copy.copied")
        : (label ?? t("ialab.valerio.copy.label"))}
    </button>
  );
};

/**
 * Typing Indicator
 * Muestra cuando MAX está escribiendo
 */
export const TypingIndicator = ({ label }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-1 text-xs text-slate-500">
      <span>{label ?? t("ialab.valerio.typing.label")}</span>
      <span className="flex gap-1">
        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
        <span
          className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </span>
    </div>
  );
};

/**
 * Message Actions Bar
 * Acciones por mensaje (copiar, reaccionar, etc)
 */
export const MessageActionsBar = ({ messageContent, onReact, onExport }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <CopyButton text={messageContent} />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs px-2 py-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 transition-colors"
        title={t("ialab.valerio.message_actions.more")}
      >
        <Icon name="fa-ellipsis" className="text-xs" />
      </button>

      {isOpen && (
        <div className="absolute bg-white border border-slate-200 rounded shadow-lg p-2 text-xs space-y-1">
          <button
            onClick={() => {
              onReact?.();
              setIsOpen(false);
            }}
            className="block w-full text-left px-2 py-1 hover:bg-slate-100"
          >
            <Icon name="fa-thumbs-up" className="text-xs mr-1" />
            {t("ialab.valerio.message_actions.useful")}
          </button>
          <button
            onClick={() => {
              onExport?.();
              setIsOpen(false);
            }}
            className="block w-full text-left px-2 py-1 hover:bg-slate-100"
          >
            <Icon name="fa-download" className="text-xs mr-1" />
            {t("ialab.valerio.message_actions.download")}
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Export Conversation Helper
 * Exporta conversaciones a varios formatos
 */
export const exportConversation = (
  conversation,
  format = "txt",
  t = (key, params) => key,
) => {
  let content = "";
  const timestamp = new Date().toLocaleString("es-CO");

  if (format === "txt") {
    content = `${t("ialab.valerio.export.header", { timestamp })}\n\n`;
    conversation.forEach((msg) => {
      const sender =
        msg.type === "user" ? t("ialab.valerio.export.you") : "MAX";
      content += `[${sender}]\n${msg.content}\n\n`;
    });
  } else if (format === "json") {
    content = JSON.stringify({ timestamp, conversation }, null, 2);
  } else if (format === "html") {
    content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${t("ialab.valerio.export.html_title")}</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 20px; }
    .message { margin: 10px 0; padding: 10px; border-radius: 8px; }
    .user { background: #f0f0f0; text-align: right; }
    .valerio { background: #e8f4f8; }
    .timestamp { color: #666; font-size: 0.8em; }
  </style>
</head>
<body>
  <h1>${t("ialab.valerio.export.html_title")}</h1>
  <p class="timestamp">${timestamp}</p>
  ${conversation
    .map(
      (msg) => `
  <div class="message ${msg.type}">
    <strong>${msg.type === "user" ? t("ialab.valerio.export.you") : "MAX"}:</strong><br>
    ${msg.content.replace(/\n/g, "<br>")}
  </div>
  `,
    )
    .join("")}
</body>
</html>`;
  }

  return content;
};

/**
 * Hook para manejar toasts globalmente
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const show = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  };

  return { toasts, show };
};

export default {
  Toast,
  ToastContainer,
  MessageSkeleton,
  ConversationSkeleton,
  CopyButton,
  TypingIndicator,
  MessageActionsBar,
  exportConversation,
  useToast,
};
