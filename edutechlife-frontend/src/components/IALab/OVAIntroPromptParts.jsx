import { useState } from "react";
import { useTranslation } from "../../i18n/I18nProvider";
import {
  BrainCircuit,
  Award,
  Sparkles,
  CheckCircle2,
  MousePointer2,
  Zap,
  Target,
  Globe,
  Layers,
  Hash,
  Sliders,
} from "lucide-react";

export const Logo = () => (
  <div className="flex items-center gap-2 select-none group cursor-pointer">
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-emphasis)] to-[var(--theme-primary)] rounded-xl rotate-3 shadow-md group-hover:rotate-0 transition-transform"></div>
      <BrainCircuit className="w-5 h-5 text-white relative z-10" />
    </div>
    <div className="text-xl tracking-tighter flex items-center lowercase">
      <span className="font-[900] theme-text-emphasis">edutech</span>
      <span className="font-[400] theme-text-primary">life</span>
    </div>
  </div>
);

export const ImportanceQuality = () => {
  const { t } = useTranslation();
  const text = t("ova.introprompt.importance_desc");
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 bg-gradient-to-br from-[var(--theme-primary)]/5 to-white rounded-[2rem] border-2 border-[var(--theme-primary)]/20 dark:border-slate-700 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[var(--theme-primary)]/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 theme-text-primary" />
          </div>
          <h4 className="theme-text-emphasis font-[900] text-xl tracking-tighter lowercase">
            {t("ova.introprompt.importance_title")}
          </h4>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm">
          {text}
        </p>
      </div>
    </div>
  );
};

export const TypesPrompts = () => {
  const { t } = useTranslation();
  const [sel, setSel] = useState(null);
  const types = [
    { k: "abierto", i: <Layers className="w-5 h-5" /> },
    { k: "cerrado", i: <Target className="w-5 h-5" /> },
    { k: "instructivo", i: <Zap className="w-5 h-5" /> },
    { k: "creativo", i: <Sparkles className="w-5 h-5" /> },
    { k: "refinamiento", i: <Globe className="w-5 h-5" /> },
  ];
  const labels = {
    abierto: "Prompt Abierto",
    cerrado: "Prompt Cerrado",
    instructivo: "Prompt Instructivo",
    creativo: "Prompt Creativo",
    refinamiento: "Prompt de Refinamiento",
  };
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {types.map((tp) => (
          <button
            key={tp.k}
            onClick={() => setSel(tp)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${sel?.k === tp.k ? "border-[var(--theme-primary)] bg-blue-50 shadow-md" : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 dark:bg-slate-700 theme-text-emphasis rounded-lg">
                {tp.i}
              </div>
              <div>
                <h5 className="font-[900] theme-text-emphasis text-xs uppercase leading-none mb-1">
                  {labels[tp.k]}
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                  {t(`ova.introprompt.types_desc_${tp.k}`)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {sel && (
        <div className="p-4 bg-[var(--theme-emphasis)] text-[var(--theme-on-emphasis)] rounded-xl">
          <p className="text-xs text-white font-medium">
            <span className="theme-text-primary font-black uppercase text-xs">
              {labels[sel.k]}:
            </span>{" "}
            {t(`ova.introprompt.types_desc_${sel.k}`)}
          </p>
        </div>
      )}
    </div>
  );
};

export const UniversalTemplate = () => {
  const { t } = useTranslation();
  const text = t("ova.introprompt.universal_desc");
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 bg-gradient-to-br from-[var(--theme-primary)]/5 to-white rounded-[2rem] border-2 border-[var(--theme-primary)]/20 dark:border-slate-700 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[var(--theme-primary)]/10 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 theme-text-primary" />
          </div>
          <h4 className="theme-text-emphasis font-[900] text-xl tracking-tighter lowercase">
            {t("ova.introprompt.universal_title")}
          </h4>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1.5 bg-[var(--theme-emphasis)] text-[var(--theme-on-emphasis)] rounded-full text-[10px] font-black uppercase tracking-wider">
            Rol
          </span>
          <span className="text-slate-300 flex items-center text-lg">+</span>
          <span className="px-3 py-1.5 bg-[#4361EE] text-white rounded-full text-[10px] font-black uppercase tracking-wider">
            Tarea
          </span>
          <span className="text-slate-300 flex items-center text-lg">+</span>
          <span className="px-3 py-1.5 bg-[#4CC9F0] text-white rounded-full text-[10px] font-black uppercase tracking-wider">
            Formato
          </span>
          <span className="text-slate-300 flex items-center text-lg">+</span>
          <span className="px-3 py-1.5 bg-[var(--theme-primary)] text-white rounded-full text-[10px] font-black uppercase tracking-wider">
            Contexto
          </span>
          <span className="text-slate-300 flex items-center text-lg">+</span>
          <span className="px-3 py-1.5 bg-[#F72585] text-white rounded-full text-[10px] font-black uppercase tracking-wider">
            Restricciones
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm">
          {text}
        </p>
      </div>
    </div>
  );
};

export const HowAIThinks = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);
  const concepts = [
    {
      k: "tokens",
      icon: <Hash className="w-5 h-5" />,
      color: "bg-[var(--theme-emphasis)]",
    },
    {
      k: "context",
      icon: <Globe className="w-5 h-5" />,
      color: "bg-[var(--theme-primary)]",
    },
    { k: "temp", icon: <Sliders className="w-5 h-5" />, color: "bg-[#4361EE]" },
  ];
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">
        {t("ova.introprompt.howit_desc")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {concepts.map((c) => (
          <button
            key={c.k}
            onClick={() => setActive(active === c.k ? null : c.k)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${active === c.k ? "border-[var(--theme-primary)] bg-blue-50 shadow-md" : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"}`}
          >
            <div
              className={`w-10 h-10 ${c.color} text-white rounded-lg flex items-center justify-center mb-2 shadow-sm`}
            >
              {c.icon}
            </div>
            <h5 className="font-[900] theme-text-emphasis text-xs uppercase tracking-wider">
              {t(`ova.introprompt.howit_${c.k}_title`)}
            </h5>
          </button>
        ))}
      </div>
      {active ? (
        <div className="p-4 bg-[var(--theme-emphasis)] text-[var(--theme-on-emphasis)] rounded-xl">
          <h5 className="theme-text-primary font-[900] text-xs uppercase tracking-[0.2em] mb-2">
            {t(`ova.introprompt.howit_${active}_title`)}
          </h5>
          <p className="text-sm text-white leading-relaxed font-medium">
            {t(`ova.introprompt.howit_${active}_desc`)}
          </p>
          {active === "temp" && (
            <p className="mt-3 text-xs text-white/80 italic font-medium">
              {t("ova.introprompt.howit_temp_example")}
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-6 opacity-30 space-y-2">
          <MousePointer2 className="w-6 h-6 mx-auto animate-bounce" />
          <p className="text-[10px] font-black uppercase tracking-widest">
            {t("ova.introprompt.howit_select")}
          </p>
        </div>
      )}
    </div>
  );
};

export const Conclusion = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto text-center animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] max-w-md">
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl border-4 border-white dark:border-slate-700">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-black theme-text-emphasis mb-2 uppercase tracking-tighter">
        {t("ova.introprompt.cert_title")}
      </h2>
      <p className="text-base text-slate-600 dark:text-slate-300 font-bold mb-8 leading-relaxed">
        {t("ova.introprompt.cert_score_msg")}
      </p>
    </div>
  );
};
