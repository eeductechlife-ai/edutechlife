import { AlertCircle, RefreshCw, WifiOff, ServerCrash, Lock, HelpCircle } from "lucide-react";

const ERROR_PRESETS = {
  network: {
    icon: WifiOff,
    title: "Sin conexión a internet",
    message: "Revisa tu conexión y vuelve a intentarlo. Tu progreso está guardado localmente.",
    actionLabel: "Reintentar",
    tone: "amber",
  },
  server: {
    icon: ServerCrash,
    title: "Nuestro servidor está descansando",
    message: "Estamos trabajando en resolverlo. Intenta de nuevo en unos segundos.",
    actionLabel: "Reintentar",
    tone: "red",
  },
  auth: {
    icon: Lock,
    title: "Tu sesión expiró",
    message: "Por seguridad, cerramos tu sesión. Inicia sesión de nuevo para continuar donde lo dejaste.",
    actionLabel: "Iniciar sesión",
    tone: "blue",
  },
  notFound: {
    icon: HelpCircle,
    title: "No encontramos lo que buscas",
    message: "Este contenido no existe o fue movido. Vuelve al panel principal.",
    actionLabel: "Ir al panel",
    tone: "slate",
  },
  generic: {
    icon: AlertCircle,
    title: "Algo no salió como esperábamos",
    message: "Puedes intentarlo de nuevo o contactar a MAX si el problema persiste.",
    actionLabel: "Reintentar",
    tone: "red",
  },
};

const TONE_CLASSES = {
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconText: "text-amber-600 dark:text-amber-400",
    button: "bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    iconBg: "bg-red-100 dark:bg-red-900/40",
    iconText: "text-red-600 dark:text-red-400",
    button: "bg-red-500 hover:bg-red-600 focus-visible:ring-red-400",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconText: "text-blue-600 dark:text-blue-400",
    button: "bg-blue-500 hover:bg-blue-600 focus-visible:ring-blue-400",
  },
  slate: {
    bg: "bg-slate-50 dark:bg-slate-900/40",
    border: "border-slate-200 dark:border-slate-700",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconText: "text-slate-600 dark:text-slate-400",
    button: "bg-slate-600 hover:bg-slate-700 focus-visible:ring-slate-400",
  },
};

export function detectErrorType(error) {
  if (!error) return "generic";
  const message = String(error?.message || error).toLowerCase();
  if (message.includes("network") || message.includes("fetch") || message.includes("offline")) return "network";
  if (message.includes("401") || message.includes("unauthorized") || message.includes("jwt")) return "auth";
  if (message.includes("404") || message.includes("not found")) return "notFound";
  if (message.includes("500") || message.includes("503") || message.includes("server")) return "server";
  return "generic";
}

export default function ErrorState({
  type,
  error,
  title,
  message,
  actionLabel,
  onAction,
  onSecondaryAction,
  secondaryLabel,
  compact = false,
  className = "",
}) {
  const detectedType = type || detectErrorType(error);
  const preset = ERROR_PRESETS[detectedType] || ERROR_PRESETS.generic;
  const tone = TONE_CLASSES[preset.tone];
  const Icon = preset.icon;

  const finalTitle = title || preset.title;
  const finalMessage = message || preset.message;
  const finalAction = actionLabel || preset.actionLabel;

  const paddingClass = compact ? "p-4" : "p-6 sm:p-8";
  const iconSizeClass = compact ? "w-10 h-10" : "w-14 h-14";
  const titleClass = compact ? "text-base" : "text-lg sm:text-xl";

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`rounded-2xl border ${tone.bg} ${tone.border} ${paddingClass} flex flex-col items-center text-center ${className}`}
    >
      <div className={`${iconSizeClass} ${tone.iconBg} rounded-2xl flex items-center justify-center mb-3`}>
        <Icon className={`w-6 h-6 ${tone.iconText}`} aria-hidden="true" />
      </div>
      <h3 className={`font-bold text-slate-900 dark:text-slate-100 mb-1.5 ${titleClass}`}>{finalTitle}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mb-4 leading-relaxed">{finalMessage}</p>

      {import.meta.env.DEV && error?.message && (
        <details className="text-xs text-slate-400 mb-3 max-w-md">
          <summary className="cursor-pointer">Detalles técnicos</summary>
          <pre className="mt-2 text-left overflow-auto bg-slate-100 dark:bg-slate-800 p-2 rounded text-[10px]">
            {error.message}
          </pre>
        </details>
      )}

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className={`${tone.button} text-white font-semibold px-5 py-2.5 rounded-xl text-sm inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            {finalAction}
          </button>
        )}
        {onSecondaryAction && secondaryLabel && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="text-slate-700 dark:text-slate-300 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
