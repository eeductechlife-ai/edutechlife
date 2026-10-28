import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Zap,
  Info,
  MousePointer2,
  BrainCircuit,
  Sparkles,
  Rocket,
  Target,
  FileText,
  Cpu,
  Globe,
  AlertTriangle,
  Lightbulb,
  Search,
  Clock,
} from "lucide-react";

export const Logo = () => (
  <div className="flex items-center gap-2 select-none group cursor-pointer">
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-emphasis)] to-[var(--theme-primary)] rounded-xl rotate-3 shadow-md group-hover:rotate-0 transition-transform"></div>
      <BrainCircuit className="w-5 h-5 text-white relative z-10" />
    </div>
    <div
      className="text-xl tracking-tighter flex items-center lowercase"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <span className="font-[900] text-[var(--theme-emphasis)]">edutech</span>
      <span className="font-[400] text-[var(--theme-primary)]">life</span>
    </div>
  </div>
);

export const Button = ({
  children,
  onClick,
  className = "",
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-2 px-8 py-4 rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all disabled:opacity-30 ${className}`}
  >
    {children}
  </button>
);

export const ModuleHistory = ({ texts }) => {
  const [active, setActive] = useState(0);
  const sections = [
    {
      t: texts.history_title_1,
      c: texts.history_desc_1,
      icon: <Cpu className="w-5 h-5" />,
      era: "1950",
    },
    {
      t: texts.history_title_2,
      c: texts.history_desc_2,
      icon: <Layers className="w-5 h-5" />,
      era: "2010",
    },
    {
      t: texts.history_title_3,
      c: texts.history_desc_3,
      icon: <Sparkles className="w-5 h-5" />,
      era: "2017",
    },
    {
      t: texts.history_title_4,
      c: texts.history_desc_4,
      icon: <Rocket className="w-5 h-5" />,
      era: "2022",
    },
  ];
  return (
    <div className="animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="relative flex flex-col md:flex-row gap-6 md:gap-0">
        <div className="hidden md:flex flex-col items-center gap-2 pt-2 relative">
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-[var(--theme-emphasis)] via-[var(--theme-primary)] to-[var(--theme-emphasis)] -translate-x-1/2 rounded-full" />
          {sections.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="relative flex items-center gap-4 w-full group cursor-pointer z-10"
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${active === i ? "bg-[var(--theme-emphasis)] border-[var(--theme-primary)] shadow-lg shadow-[var(--theme-primary)]/30 scale-125" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-[var(--theme-primary)]"}`}
              >
                {active === i && (
                  <div className="w-2 h-2 bg-white rounded-full animate-ping absolute" />
                )}
                <div
                  className={`w-2 h-2 rounded-full ${active === i ? "bg-white" : "bg-slate-300 dark:bg-slate-600"}`}
                />
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${active === i ? "text-[var(--theme-emphasis)]" : "text-slate-400 dark:text-slate-500 group-hover:text-[var(--theme-emphasis)]"}`}
              >
                {s.era}
              </span>
            </button>
          ))}
        </div>
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-md relative overflow-hidden min-h-[160px]"
            >
              <div className="absolute -right-4 -bottom-4 opacity-5 text-[var(--theme-primary)] scale-150">
                {sections[active].icon}
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white rounded-lg shadow-md">
                  {sections[active].icon}
                </div>
                <h4 className="text-[var(--theme-emphasis)] font-[900] text-lg leading-none uppercase tracking-tighter">
                  {sections[active].t}
                </h4>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium">
                {sections[active].c}
              </p>
              <div className="mt-3 flex gap-1.5">
                {sections.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-[var(--theme-emphasis)]" : "w-2 bg-slate-200 dark:bg-slate-600"}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex md:hidden justify-center gap-2 mt-4">
            {sections.map((s, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${active === i ? "bg-[var(--theme-emphasis)] text-[var(--theme-on-emphasis)] shadow-md" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"}`}
              >
                {s.era}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

ModuleHistory.propTypes = {
  texts: PropTypes.object.isRequired,
};

export const PromptConcept = ({ texts }) => (
  <div className="space-y-4 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
    <div className="p-5 bg-[#F0F9FF] rounded-[2rem] border-2 border-white dark:border-slate-700 shadow-md relative overflow-hidden">
      <h4 className="text-[var(--theme-emphasis)] font-[900] text-xl mb-3 tracking-tighter leading-none lowercase">
        {texts.prompt_title}
      </h4>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-bold text-sm max-w-2xl">
        {texts.prompt_desc}
      </p>
    </div>
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-[1.5rem] flex items-center gap-3 shadow-sm">
      <div className="p-3 bg-[var(--theme-primary)]/10 rounded-xl text-[var(--theme-primary)] shadow-inner">
        <Lightbulb size={24} />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-300 font-bold italic leading-relaxed">
        {texts.prompt_tip}
      </p>
    </div>
  </div>
);

PromptConcept.propTypes = {
  texts: PropTypes.object.isRequired,
};

export const ModuleAnatomy = ({ texts }) => {
  const [sel, setSel] = useState(null);
  const elements = [
    {
      k: texts.anatomy_rol,
      d: texts.anatomy_rol_desc,
      c: "bg-[var(--theme-emphasis)]",
    },
    {
      k: texts.anatomy_contexto,
      d: texts.anatomy_contexto_desc,
      c: "bg-[var(--theme-primary)]",
    },
    {
      k: texts.anatomia_tarea,
      d: texts.anatomia_tarea_desc,
      c: "bg-[#4361EE]",
    },
    {
      k: texts.anatomia_formato,
      d: texts.anatomia_formato_desc,
      c: "bg-[#4CC9F0]",
    },
    {
      k: texts.anatomia_restriccion,
      d: texts.anatomia_restriccion_desc,
      c: "bg-[#F72585]",
    },
    {
      k: texts.anatomia_ejemplos,
      d: texts.anatomia_ejemplos_desc,
      c: "bg-[#FF9F1C]",
    },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center animate-[zoomIn_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
      <div className="grid grid-cols-3 gap-2">
        {elements.map((el) => (
          <button
            key={el.k}
            onClick={() => setSel(el)}
            className={`p-4 rounded-[1.8rem] border-2 transition-all flex flex-col items-center gap-2 group ${sel?.k === el.k ? "border-[var(--theme-primary)] bg-blue-50 shadow-md" : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"}`}
          >
            <div
              className={`w-10 h-10 ${el.c} text-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
            >
              <span className="text-lg font-black">{el.k[0]}</span>
            </div>
            <span className="text-xs font-black text-[var(--theme-emphasis)] uppercase tracking-tighter leading-none">
              {el.k}
            </span>
          </button>
        ))}
      </div>
      <div className="bg-[var(--theme-emphasis)] text-[var(--theme-on-emphasis)] p-5 rounded-[1.8rem] shadow-lg relative min-h-[180px] flex flex-col justify-center border-b-2 border-[var(--theme-primary)]">
        {sel ? (
          <div className="animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <h5 className="text-[var(--theme-primary)] font-[900] text-xs uppercase tracking-[0.3em] mb-3">
              {texts.anatomy_element_label} {sel.k}
            </h5>
            <p className="text-base text-white leading-relaxed font-medium">
              {sel.d}
            </p>
          </div>
        ) : (
          <div className="text-center opacity-30 space-y-3">
            <MousePointer2 className="w-8 h-8 mx-auto animate-bounce" />
            <p className="text-xs font-black uppercase tracking-widest leading-none">
              {texts.anatomy_placeholder}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

ModuleAnatomy.propTypes = {
  texts: PropTypes.object.isRequired,
};

export const TechniquesSection = ({ texts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] slide-in-from-bottom">
    {[
      {
        t: texts.technique_1_title,
        d: texts.technique_1_desc,
        i: <BrainCircuit className="w-5 h-5" />,
      },
      {
        t: texts.technique_2_title,
        d: texts.technique_2_desc,
        i: <Layers className="w-5 h-5" />,
      },
      {
        t: texts.technique_3_title,
        d: texts.technique_3_desc,
        i: <Zap className="w-5 h-5" />,
      },
      {
        t: texts.technique_4_title,
        d: texts.technique_4_desc,
        i: <Globe className="w-5 h-5" />,
      },
      {
        t: texts.technique_5_title,
        d: texts.technique_5_desc,
        i: <Target className="w-5 h-5" />,
      },
      {
        t: texts.technique_6_title,
        d: texts.technique_6_desc,
        i: <Sparkles className="w-5 h-5" />,
      },
    ].map((s, i) => (
      <div
        key={i}
        className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.2rem] shadow-sm hover:shadow-lg transition-all group"
      >
        <div className="p-3 bg-slate-50 dark:bg-slate-700 text-[var(--theme-emphasis)] rounded-[1rem] shadow-inner group-hover:bg-[var(--theme-emphasis)] group-hover:text-[var(--theme-on-emphasis)] transition-all">
          {s.i}
        </div>
        <div>
          <h5 className="font-[900] text-[var(--theme-emphasis)] text-xs uppercase mb-1 tracking-tighter leading-none">
            {s.t}
          </h5>
          <p className="text-xs text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
            {s.d}
          </p>
        </div>
      </div>
    ))}
  </div>
);

TechniquesSection.propTypes = {
  texts: PropTypes.object.isRequired,
};

export const ErrorSection = ({ texts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-[fadeIn_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
    {[
      { t: texts.error_1_title, d: texts.error_1_desc, i: <AlertTriangle /> },
      { t: texts.error_2_title, d: texts.error_2_desc, i: <FileText /> },
      { t: texts.error_3_title, d: texts.error_3_desc, i: <Search /> },
      { t: texts.error_4_title, d: texts.error_4_desc, i: <Zap /> },
      { t: texts.error_5_title, d: texts.error_5_desc, i: <Info /> },
      { t: texts.error_6_title, d: texts.error_6_desc, i: <Clock /> },
    ].map((e, i) => (
      <div
        key={i}
        className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] shadow-sm hover:shadow-md transition-all group"
      >
        <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          {e.i}
        </div>
        <h5 className="font-[900] text-[var(--theme-emphasis)] text-xs uppercase tracking-widest leading-none mb-1">
          {e.t}
        </h5>
        <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed font-medium">
          {e.d}
        </p>
      </div>
    ))}
  </div>
);

ErrorSection.propTypes = {
  texts: PropTypes.object.isRequired,
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export function getEticaMaxText(screen, texts) {
  switch (screen) {
    case "welcome":
      return texts.welcome_voice;
    case "m1":
      return texts.history_desc_1;
    case "m2":
      return texts.prompt_voice;
    case "m3":
      return texts.anatomy_rol_desc;
    case "m4":
      return texts.technique_1_desc;
    case "m5":
      return texts.error_1_desc;
    case "m6":
      return texts.quiz_1_q;
    case "certificate":
      return texts.certificate_desc;
    default:
      return "";
  }
}
