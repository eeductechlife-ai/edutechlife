import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { callDeepseek } from "../../utils/api";
import { speakTextConversational, stopSpeech } from "../../utils/speech";
import { useSmartBoardKids } from "../../context/SmartBoardKidsContext";
import { useTranslation } from "../../i18n/I18nProvider";

const dc = (dm, light, dark) => (dm ? dark : light);
const gd = "bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC]";

const ScriptBlock = memo(({ block, i, currentIdx }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: currentIdx === i ? 1 : 0.6, x: 0 }}
      className={`p-3 rounded-xl border transition-all ${currentIdx === i ? "border-[#4DA8C4] bg-[#4DA8C4]/5 shadow-sm" : "border-transparent"}`}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg mt-0.5">
          {block.role === "host" ? "🎙️" : "💡"}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-semibold mb-0.5 ${dc(false, "text-[#4DA8C4]", "text-[#66CCCC]")}`}
          >
            {block.role === "host"
              ? t("kid.podcast.role_host")
              : t("kid.podcast.role_tip")}
          </p>
          <p
            className={`text-sm leading-relaxed ${dc(false, "text-[#475569]", "text-[#CBD5E1]")}`}
          >
            {block.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

const StudyPodcast = memo(() => {
  const { darkMode: dm, addPoints } = useSmartBoardKids();
  const [mode, setMode] = useState("input");
  const [text, setText] = useState("");
  const [script, setScript] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const isPlayingRef = useRef(false);
  const currentIdxRef = useRef(0);

  const generatePodcast = useCallback(
    async (input) => {
      setIsGenerating(true);
      try {
        const prompt = `Eres un productor de podcasts educativos para niños y jóvenes. Crea un guión de podcast educativo (máximo 4 párrafos) basado en el siguiente texto. El guión debe tener alternancia entre un narrador (rol "host") y datos curiosos (rol "tip"). Responde SOLO con JSON: { "title": "título atractivo", "duration": "X min", "script": [{ "role": "host", "text": "..." }, { "role": "tip", "text": "..." }] }

Texto:
${input.substring(0, 3000)}`;

        const result = await callDeepseek([{ role: "user", content: prompt }], {
          temperature: 0.7,
          maxTokens: 1000,
          isJson: true,
        });

        const parsed = typeof result === "string" ? JSON.parse(result) : result;
        setScript({ ...parsed, source: input });
        setMode("player");
        addPoints(20, "Creó un podcast de estudio");
      } catch (e) {
        console.warn("Error generating podcast:", e);
      }
      setIsGenerating(false);
    },
    [addPoints],
  );

  const speakScript = useCallback(
    (startIdx) => {
      if (!script?.script) return;
      let idx = startIdx;
      currentIdxRef.current = idx;
      setCurrentIdx(idx);

      const speakNext = () => {
        if (idx >= script.script.length) {
          setIsPlaying(false);
          isPlayingRef.current = false;
          return;
        }
        currentIdxRef.current = idx;
        setCurrentIdx(idx);
        const block = script.script[idx];
        const textToSpeak = `${block.role === "host" ? "" : "Dato clave: "}${block.text}`;
        setIsPlaying(true);
        isPlayingRef.current = true;
        speakTextConversational(
          textToSpeak,
          "dani",
          () => {
            idx++;
            setTimeout(speakNext, 300);
          },
          () => {
            idx++;
            setTimeout(speakNext, 300);
          },
        );
      };

      speakNext();
    },
    [script],
  );

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      speakScript(currentIdxRef.current);
    }
  }, [isPlaying, speakScript]);

  const handleStop = useCallback(() => {
    stopSpeech();
    setIsPlaying(false);
    isPlayingRef.current = false;
    setCurrentIdx(0);
    currentIdxRef.current = 0;
  }, []);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] flex items-center justify-center text-lg shadow-md">
          🎙️
        </div>
        <div>
          <h3
            className={`text-lg font-bold ${dc(dm, "text-[#004B63]", "text-[#E2F0FF]")}`}
          >
            {t("kid.podcast.title")}
          </h3>
          <p
            className={`text-xs ${dc(dm, "text-[#64748B]", "text-[#94A3B8]")}`}
          >
            {t("kid.podcast.subtitle")}
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div>
              <label
                className={`text-sm font-semibold mb-2 block ${dc(dm, "text-[#004B63]", "text-white")}`}
              >
                {t("kid.podcast.text_label")}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("kid.podcast.textarea_placeholder")}
                rows={5}
                className={`w-full p-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4DA8C4] ${
                  dm
                    ? "bg-[#1E293B] border-[#334155] text-white placeholder-[#64748B]"
                    : "bg-white border-[#E2E8F0] text-[#334155] placeholder-[#94A3B8]"
                }`}
              />
            </div>
            <motion.button
              onClick={() => generatePodcast(text)}
              disabled={!text.trim() || isGenerating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 ${gd} text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />{" "}
                  {t("kid.podcast.generating")}
                </>
              ) : (
                <>
                  <span className="text-lg">🎙️</span>{" "}
                  {t("kid.podcast.generate_btn")}
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {mode === "player" && script && (
          <motion.div
            key="player"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <motion.div
              className={`rounded-2xl border overflow-hidden ${dm ? "bg-[#0F172A]/90 border-[#334155]" : "bg-white/90 border-[#E2E8F0] shadow-sm"}`}
            >
              <div className={`${gd} p-5 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg truncate">
                    {script.title || t("kid.podcast.title_fallback")}
                  </h3>
                  <span className="text-white/70 text-xs">
                    {script.duration || t("kid.podcast.duration_fallback")}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={handlePlay}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isPlaying ? "bg-white/30" : "bg-white/20 hover:bg-white/30"} transition-all`}
                  >
                    {isPlaying ? "⏸️" : "▶️"}
                  </motion.button>
                  <motion.button
                    onClick={handleStop}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm transition-all"
                  >
                    ⏹️
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      stopSpeech();
                      setMode("input");
                      setScript(null);
                      setCurrentIdx(0);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm transition-all"
                  >
                    ✕
                  </motion.button>
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${script.script.length > 0 ? ((currentIdx + 1) / script.script.length) * 100 : 0}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {script.script?.map((block, i) => (
                  <ScriptBlock
                    key={i}
                    block={block}
                    i={i}
                    currentIdx={currentIdx}
                    dm={dm}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

StudyPodcast.displayName = "StudyPodcast";
export { StudyPodcast };
export default StudyPodcast;
