import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../i18n/I18nProvider";
import { OVAIntro } from "./shared";
import VoiceReader from "./VoiceReader";
import PromptSandbox from "./PromptSandbox";
import { useIALabStore } from "../../store/ialabStore";
import {
  ChevronLeft,
  ArrowRightCircle,
  Star,
  CheckCircle2,
  Menu,
  Sparkles,
  User,
  FlaskConical,
  Trophy,
} from "lucide-react";
import { stopSpeech } from "../../utils/speech";
import {
  Logo,
  PromptAnatomy,
  PromptTechniques,
  Conclusion,
} from "./OVAPromptLabParts";

const SAMPLE_SETS = {
  es: [
    {
      label: "Pedir directo",
      system: "",
      user: "Explícame en una frase qué es una factura electrónica.",
    },
    {
      label: "Dar un ejemplo",
      system: "Clasificas comentarios en positivo, negativo o neutro.",
      user: 'Ejemplo 1: "Me encantó" → positivo\nEjemplo 2: "No sirve" → negativo\nEjemplo 3: "Es normal" → neutro\nClasifica: "El envío llegó a tiempo pero la caja venía rota"',
    },
    {
      label: "Paso a paso",
      system: "Eres un tutor paciente. Explicas paso a paso.",
      user: "Pensemos paso a paso: si compro 3 cuadernos de $4.500 cada uno y pago con $20.000, ¿cuánto me devuelven?",
    },
    {
      label: "Asignar un rol",
      system:
        "Eres una editora cuidadosa. Revisas textos con rigor pero con amabilidad.",
      user: 'Dame 3 sugerencias para mejorar este texto: "La IA es muy buena y ayuda mucho a las personas."',
    },
  ],
  en: [
    {
      label: "Ask directly",
      system: "",
      user: "Explain in one sentence what an electronic invoice is.",
    },
    {
      label: "Give an example",
      system: "You classify comments as positive, negative or neutral.",
      user: 'Example 1: "I loved it" → positive\nExample 2: "It is useless" → negative\nExample 3: "It is okay" → neutral\nClassify: "The delivery arrived on time but the box was broken"',
    },
    {
      label: "Step by step",
      system: "You are a patient tutor. You explain step by step.",
      user: "Let's think step by step: if I buy 3 notebooks at $4.50 each and pay with $20, how much change do I get?",
    },
    {
      label: "Assign a role",
      system:
        "You are a careful editor. You review texts rigorously but kindly.",
      user: 'Give me 3 suggestions to improve this text: "AI is very good and helps people a lot."',
    },
  ],
  pt: [
    {
      label: "Pedir direto",
      system: "",
      user: "Explique em uma frase o que é uma nota fiscal eletrônica.",
    },
    {
      label: "Dar um exemplo",
      system: "Você classifica comentários em positivo, negativo ou neutro.",
      user: 'Exemplo 1: "Adorei" → positivo\nExemplo 2: "Não serve" → negativo\nExemplo 3: "É normal" → neutro\nClassifique: "A entrega chegou no prazo, mas a caixa veio quebrada"',
    },
    {
      label: "Passo a passo",
      system: "Você é um tutor paciente. Explica passo a passo.",
      user: "Vamos pensar passo a passo: se eu comprar 3 cadernos de R$ 4,50 cada e pagar com R$ 20,00, quanto recebo de troco?",
    },
    {
      label: "Atribuir um papel",
      system:
        "Você é uma editora cuidadosa. Revisa textos com rigor, mas com gentileza.",
      user: 'Dê 3 sugestões para melhorar este texto: "A IA é muito boa e ajuda muito as pessoas."',
    },
  ],
};

const CHALLENGE_SETS = {
  es: {
    label: "Reto",
    system: "Respondes solo con lo que se pide, sin explicaciones ni adornos.",
    user: "Dame 3 países latinoamericanos con su capital, uno por línea, con el formato País — Capital. Nada más.",
  },
  en: {
    label: "Challenge",
    system:
      "You answer only with what is asked, with no explanations or extras.",
    user: "Give me 3 Latin American countries with their capital, one per line, in the format Country — Capital. Nothing else.",
  },
  pt: {
    label: "Desafio",
    system:
      "Você responde apenas o que é pedido, sem explicações nem enfeites.",
    user: "Me dê 3 países latino-americanos com a capital, um por linha, no formato País — Capital. Nada mais.",
  },
};

const LabScreen = ({ onCompleted }) => {
  const { t, locale } = useTranslation();
  const SAMPLES = SAMPLE_SETS[locale] || SAMPLE_SETS.es;
  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <PromptSandbox
        title={t("ova.promptlab.lab_title")}
        samplePrompts={SAMPLES}
        itemId="ova-prompt-lab-sandbox"
        onComplete={onCompleted}
      />
    </div>
  );
};
LabScreen.propTypes = { onCompleted: PropTypes.func };

// M4: Reto (usuario debe conseguir un output específico)

const ChallengeScreen = ({ onSuccess }) => {
  const { t, locale } = useTranslation();
  const [claimed, setClaimed] = useState(false);

  return (
    <div className="animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-300 dark:border-amber-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-[var(--theme-emphasis)] dark:text-white font-[900] text-lg tracking-tight lowercase">
            {t("ova.promptlab.challenge_title")}
          </h4>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          {t("ova.promptlab.challenge_goal")}
        </p>
      </div>

      <PromptSandbox
        title={t("ova.promptlab.challenge_zone")}
        samplePrompts={[CHALLENGE_SETS[locale] || CHALLENGE_SETS.es]}
        itemId="ova-prompt-lab-challenge"
        onComplete={() => setClaimed(true)}
      />

      {claimed && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700 text-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            {t("ova.promptlab.challenge_success")}
          </p>
          <button
            type="button"
            onClick={onSuccess}
            className="mt-3 px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
          >
            {t("ova.promptlab.challenge_mark")}
          </button>
        </div>
      )}
    </div>
  );
};
ChallengeScreen.propTypes = { onSuccess: PropTypes.func };

// M5: Conclusión

const SCREEN_ICONS = {
  m1: <User className="w-4 h-4" />,
  m2: <Sparkles className="w-4 h-4" />,
  m3: <FlaskConical className="w-4 h-4" />,
  m4: <Trophy className="w-4 h-4" />,
  m5: <CheckCircle2 className="w-4 h-4" />,
};

function OVAPromptLab({ onComplete, onClose }) {
  const { t } = useTranslation();
  const [screen, setScreen] = useState("welcome");
  const [completed, setCompleted] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const autoCompletedRef = useRef(false);
  const nav = ["welcome", "m1", "m2", "m3", "m4", "m5"];
  const curIdx = nav.indexOf(screen);
  const addXp = useIALabStore((s) => s.addXp);

  useEffect(() => {
    if (
      screen === "m5" &&
      completed.includes("m3") &&
      completed.includes("m4") &&
      !autoCompletedRef.current
    ) {
      autoCompletedRef.current = true;
      if (addXp) addXp(25); // recompensa por completar el OVA
      onComplete?.();
    }
  }, [screen, completed, onComplete, addXp]);

  const markCompleted = (id) => {
    setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const nextScreen = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (screen === "welcome") {
      setScreen("m1");
      return;
    }
    markCompleted(screen);
    const next = curIdx + 1;
    if (next < nav.length) setScreen(nav[next]);
  };

  const goToScreen = (id) => {
    setScreen(id);
    setIsMenuOpen(false);
  };

  const isLastScreen = screen === "m5";

  const renderContent = () => {
    switch (screen) {
      case "welcome":
        return (
          <OVAIntro
            icon="fa-flask"
            badge={t("ova.promptlab.badge")}
            title={t("ova.promptlab.welcome_title")}
            description={t("ova.promptlab.welcome_desc")}
            audioText={t("ova.promptlab.welcome_audio")}
            onStart={nextScreen}
            startLabel={t("ova.promptlab.start")}
            objectives={[
              t("ova.promptlab.learning_obj_1"),
              t("ova.promptlab.learning_obj_2"),
              t("ova.promptlab.learning_obj_3"),
              t("ova.promptlab.learning_obj_4"),
            ]}
          />
        );
      case "m1":
        return (
          <>
            <PromptAnatomy />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.promptlab.voice_m1")} />
            </div>
          </>
        );
      case "m2":
        return (
          <>
            <PromptTechniques />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.promptlab.voice_m2")} />
            </div>
          </>
        );
      case "m3":
        return (
          <>
            <LabScreen onCompleted={() => markCompleted("m3")} />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.promptlab.voice_m3")} />
            </div>
          </>
        );
      case "m4":
        return (
          <>
            <ChallengeScreen onSuccess={() => markCompleted("m4")} />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.promptlab.voice_m4")} />
            </div>
          </>
        );
      case "m5":
        return (
          <>
            <Conclusion />
            <div className="flex justify-center mt-6">
              <VoiceReader text={t("ova.promptlab.voice_m5")} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-100 dark:selection:bg-blue-900">
      <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border-b z-50 px-4 py-3 flex justify-between items-center shadow-sm">
        <Logo />
        <div className="flex items-center gap-4">
          {screen !== "welcome" && (
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-[var(--theme-primary)]/20">
              <Star
                className="text-[var(--theme-primary)] fill-current"
                size={14}
              />
              <span className="font-bold text-[var(--theme-emphasis)] text-xs">
                {nav.filter((id) => completed.includes(id)).length}/
                {nav.length - 1}
              </span>
            </div>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menú de navegación"
            className="min-w-[44px] min-h-[44px] p-2.5 bg-[#F1F5F9] dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all border border-slate-100 dark:border-slate-700"
          >
            <Menu className="w-5 h-5 text-[var(--theme-emphasis)]" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-3 py-4">
        <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 md:p-6 relative overflow-hidden border border-slate-50 dark:border-slate-700">
          {screen.startsWith("m") && (
            <div className="mb-4 border-b border-slate-50 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-1.5 text-[var(--theme-primary)] font-[900] text-[10px] tracking-[0.3em] uppercase">
                <Sparkles className="w-3 h-3" />{" "}
                {t("ova.promptlab.section_label")}
              </div>
              <h1 className="text-lg md:text-xl font-[900] text-[var(--theme-emphasis)] dark:text-white tracking-tighter leading-tight">
                {t(`ova.promptlab.screen_${screen}`)}
              </h1>
            </div>
          )}
          <div className="relative z-10 min-h-[180px] flex flex-col justify-center">
            {renderContent()}
          </div>
        </div>
      </main>

      {screen !== "welcome" && (
        <div className="flex justify-center border-t border-slate-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90">
          <div className="w-full max-w-4xl flex justify-between items-center gap-3 px-4 py-3">
            <button
              onClick={() => {
                if (curIdx > 1) setScreen(nav[curIdx - 1]);
                stopSpeech();
              }}
              aria-label={t("ova.promptlab.nav_prev")}
              className="p-3 min-w-[44px] min-h-[44px] bg-[#F1F5F9] dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[var(--theme-emphasis)] dark:hover:text-[var(--theme-primary)] rounded-xl disabled:opacity-10 transition-all border border-slate-50 dark:border-slate-700"
              disabled={curIdx <= 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div
              className="flex gap-1.5"
              role="group"
              aria-label={t("ova.promptlab.menu_title")}
            >
              {nav.slice(1).map((_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    i + 1 === curIdx
                      ? "w-8 bg-[var(--theme-emphasis)]"
                      : completed.includes(nav[i + 1])
                        ? "w-2 bg-[var(--theme-primary)]"
                        : "w-2 bg-slate-200 dark:bg-slate-600"
                  }`}
                />
              ))}
            </div>
            <button
              disabled={
                (screen === "m3" || screen === "m4") &&
                !completed.includes(screen)
              }
              onClick={
                isLastScreen
                  ? () => {
                      onClose?.();
                    }
                  : nextScreen
              }
              className={`px-6 min-h-[44px] rounded-xl font-[900] text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[0.15em] disabled:opacity-40 disabled:cursor-not-allowed ${
                isLastScreen
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-gradient-to-r from-[var(--theme-emphasis)] to-[var(--theme-primary)] text-white"
              }`}
            >
              {isLastScreen
                ? t("ova.promptlab.nav_finish")
                : t("ova.promptlab.nav_next")}{" "}
              <ArrowRightCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {screen !== "welcome" && (
        <div className="border-t border-slate-100 dark:border-slate-700 py-3 text-center text-slate-500 dark:text-slate-300 text-xs">
          <p>{t("ova.promptlab.footer")}</p>
        </div>
      )}

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-slate-950/60 backdrop-blur-md"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("ova.promptlab.menu_title")}
            className="absolute right-0 h-full w-[300px] bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col gap-4 animate-[slideInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-slate-50 dark:border-slate-700 pb-4">
              <h3 className="font-[900] text-slate-300 dark:text-slate-500 text-xs tracking-[0.3em] uppercase">
                {t("ova.promptlab.menu_title")}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-[var(--theme-emphasis)]">
                <Star className="w-3 h-3 text-[var(--theme-primary)] fill-current" />
                {completed.filter((id) => id.startsWith("m")).length}/
                {nav.filter((id) => id.startsWith("m")).length}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {nav.map((id, idx) => {
                const stepNum = idx;
                const isCompleted = completed.includes(id);
                const isCurrent = screen === id;
                return (
                  <button
                    key={id}
                    onClick={() => goToScreen(id)}
                    className={`p-3 rounded-xl text-left text-xs font-[900] transition-all group w-full ${
                      isCurrent
                        ? "bg-[var(--theme-emphasis)] text-[var(--theme-on-emphasis)] shadow-lg"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${
                          isCompleted
                            ? "bg-[var(--theme-primary)] text-white"
                            : isCurrent
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-400"
                        }`}
                      >
                        {stepNum}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`uppercase tracking-wider ${isCurrent ? "text-white" : isCompleted ? "text-[var(--theme-emphasis)] dark:text-[var(--theme-primary)]" : "text-slate-500 dark:text-slate-400"}`}
                        >
                          {id === "welcome"
                            ? t("ova.promptlab.menu_welcome")
                            : t(`ova.promptlab.screen_${id}`)}
                        </div>
                        <div className="mt-1.5 w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${isCompleted ? "w-full bg-[var(--theme-primary)]" : isCurrent ? "w-1/3 bg-[var(--theme-emphasis)]" : "w-0"}`}
                          />
                        </div>
                      </div>
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

OVAPromptLab.propTypes = {
  onComplete: PropTypes.func,
  onClose: PropTypes.func,
};

export default OVAPromptLab;
