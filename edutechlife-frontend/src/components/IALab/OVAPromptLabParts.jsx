import { useState } from "react";
import { useTranslation } from "../../i18n/I18nProvider";
import PromptSandbox from "./PromptSandbox";
import {
  BrainCircuit,
  CheckCircle2,
  MousePointer2,
  User,
  Layers,
  Target,
  MessageSquare,
} from "lucide-react";

export const Logo = () => (
  <div className="flex items-center gap-2 select-none group cursor-pointer">
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-emphasis)] to-[var(--theme-primary)] rounded-xl rotate-3 shadow-md group-hover:rotate-0 transition-transform"></div>
      <BrainCircuit className="w-5 h-5 text-white relative z-10" />
    </div>
    <div className="text-xl tracking-tighter flex items-center lowercase">
      <span className="font-[900] text-[var(--theme-emphasis)]">edutech</span>
      <span className="font-[400] text-[var(--theme-primary)]">life</span>
    </div>
  </div>
);

// M1: Anatomía del prompt (interactivo, click en cada parte)

export const PromptAnatomy = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const parts = [
    {
      k: "rol",
      label: t("ova.promptlab.part_rol"),
      icon: <User className="w-5 h-5" />,
      color: "bg-[var(--theme-emphasis)]",
      desc: t("ova.promptlab.part_rol_desc"),
      example: t("ova.promptlab.part_rol_example"),
    },
    {
      k: "ctx",
      label: t("ova.promptlab.part_ctx"),
      icon: <Layers className="w-5 h-5" />,
      color: "bg-[var(--theme-primary)]",
      desc: t("ova.promptlab.part_ctx_desc"),
      example: t("ova.promptlab.part_ctx_example"),
    },
    {
      k: "tarea",
      label: t("ova.promptlab.part_tarea"),
      icon: <Target className="w-5 h-5" />,
      color: "bg-[#4361EE]",
      desc: t("ova.promptlab.part_tarea_desc"),
      example: t("ova.promptlab.part_tarea_example"),
    },
    {
      k: "fmt",
      label: t("ova.promptlab.part_fmt"),
      icon: <MessageSquare className="w-5 h-5" />,
      color: "bg-[#F72585]",
      desc: t("ova.promptlab.part_fmt_desc"),
      example: t("ova.promptlab.part_fmt_example"),
    },
  ];

  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">
        {t("ova.promptlab.anatomy_intro")}
      </p>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {parts.map((p) => (
          <button
            key={p.k}
            onClick={() => setSelected(selected?.k === p.k ? null : p)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-sm transition-all ${p.color} ${
              selected?.k === p.k
                ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-[var(--theme-primary)] scale-110"
                : "opacity-80 hover:opacity-100"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {parts.map((p) => (
          <button
            key={p.k}
            onClick={() => setSelected(selected?.k === p.k ? null : p)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selected?.k === p.k
                ? "border-[var(--theme-primary)] bg-blue-50 dark:bg-slate-700 shadow-md"
                : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 ${p.color} text-white rounded-lg`}>
                {p.icon}
              </div>
              <div>
                <h5 className="font-[900] text-[var(--theme-emphasis)] text-xs uppercase leading-none mb-1">
                  {p.label}
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="p-4 bg-[var(--theme-emphasis)] text-[var(--theme-on-emphasis)] rounded-xl">
          <span className="text-[var(--theme-primary)] font-black uppercase text-xs mb-1 block">
            {t("ova.promptlab.anatomy_example_label")}: {selected.label}
          </span>
          <p className="text-sm text-white italic">{selected.example}</p>
        </div>
      )}
    </div>
  );
};

// M2: Técnicas de prompting (cards seleccionables)

export const PromptTechniques = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);
  const techniques = [
    {
      k: "zeroshot",
      label: t("ova.promptlab.tech_zeroshot"),
      color: "bg-[var(--theme-emphasis)]",
      desc: t("ova.promptlab.tech_zeroshot_desc"),
      example: t("ova.promptlab.tech_zeroshot_example"),
    },
    {
      k: "fewshot",
      label: t("ova.promptlab.tech_fewshot"),
      color: "bg-[var(--theme-primary)]",
      desc: t("ova.promptlab.tech_fewshot_desc"),
      example: t("ova.promptlab.tech_fewshot_example"),
    },
    {
      k: "cot",
      label: t("ova.promptlab.tech_cot"),
      color: "bg-[#4361EE]",
      desc: t("ova.promptlab.tech_cot_desc"),
      example: t("ova.promptlab.tech_cot_example"),
    },
    {
      k: "role",
      label: t("ova.promptlab.tech_role"),
      color: "bg-[#F72585]",
      desc: t("ova.promptlab.tech_role_desc"),
      example: t("ova.promptlab.tech_role_example"),
    },
  ];

  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-300 font-bold">
        {t("ova.promptlab.tech_intro")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {techniques.map((tech) => (
          <button
            key={tech.k}
            onClick={() => setActive(active === tech.k ? null : tech.k)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              active === tech.k
                ? "border-[var(--theme-primary)] bg-blue-50 dark:bg-slate-700 shadow-md"
                : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
            }`}
          >
            <div
              className={`inline-block px-2.5 py-1 mb-2 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${tech.color}`}
            >
              {tech.label}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {tech.desc}
            </p>
          </button>
        ))}
      </div>
      {active && (
        <div className="p-4 bg-[var(--theme-emphasis)] text-[var(--theme-on-emphasis)] rounded-xl">
          <span className="text-[var(--theme-primary)] font-black uppercase text-xs mb-1 block">
            {t("ova.promptlab.tech_example_label")}
          </span>
          <p className="text-sm text-white font-mono italic">
            {techniques.find((tech) => tech.k === active)?.example}
          </p>
        </div>
      )}
      {!active && (
        <div className="text-center py-4 opacity-30 space-y-1">
          <MousePointer2 className="w-6 h-6 mx-auto animate-bounce" />
          <p className="text-[10px] font-black uppercase tracking-widest">
            {t("ova.promptlab.tech_hint")}
          </p>
        </div>
      )}
    </div>
  );
};

// M3: Laboratorio real (PromptSandbox integrado)

export const Conclusion = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto text-center animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] max-w-md">
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl border-4 border-white dark:border-slate-700">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-black text-[var(--theme-emphasis)] dark:text-white mb-2 uppercase tracking-tighter">
        {t("ova.promptlab.conclusion_title")}
      </h2>
      <p className="text-base text-slate-600 dark:text-slate-300 font-bold mb-4 leading-relaxed">
        {t("ova.promptlab.conclusion_desc")}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
        {t("ova.promptlab.conclusion_hint")}
      </p>
    </div>
  );
};
