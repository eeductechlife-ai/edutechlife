import { useState } from "react";
import { Icon } from "../../utils/iconMapping.jsx";
import { useTranslation } from "../../i18n/I18nProvider";
import { speakTextConversational, stopSpeech } from "../../utils/speech";

export const VoiceReader = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { t: tInner } = useTranslation();
  const speak = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }
    speakTextConversational(text, "max", () => setIsPlaying(false));
    setIsPlaying(true);
  };
  return (
    <button
      onClick={speak}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${isPlaying ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-[#E0F7FA] text-[var(--theme-emphasis)] hover:bg-[#B2EBF2]"}`}
      title={tInner("ialab.interaction_advisor.tool_aria")}
    >
      <Icon name={isPlaying ? "fa-stop" : "fa-volume-up"} className="w-3 h-3" />
      {isPlaying
        ? tInner("ialab.interaction_advisor.stop")
        : tInner("ialab.interaction_advisor.listen")}
    </button>
  );
};
