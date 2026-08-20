const VOICE_MAP = {
  happy: { pitch: 2, speakingRate: 1.05 },
  excited: { pitch: 3, speakingRate: 1.1 },
  encouraging: { pitch: 1.5, speakingRate: 0.95 },
  thinking: { pitch: -1, speakingRate: 0.85 },
  explaining: { pitch: 0, speakingRate: 0.9 },
  serious: { pitch: -2, speakingRate: 0.85 },
  sad: { pitch: -3, speakingRate: 0.8 },
  supportive: { pitch: 1, speakingRate: 0.9 },
};

export function getVoiceOverrides(mood) {
  return VOICE_MAP[mood] || {};
}

export function primeSpeech() {
  try {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("");
      utterance.volume = 0;
      utterance.text = "";
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.cancel();
    }
  } catch (e) {
    // Silently fail — priming is best-effort
  }
}

export function retrySpeech() {
  primeSpeech();
}

const EMOJI_HARDCODED = /[😊🔥🧠🎉💙📚💭🌟📅💬🎯🤔📖🔬🌍🎨💻🤖⭐💎📰✨]/gu;

export function stripEmoji(text) {
  try {
    // \p{Extended_Pictographic} matches true pictographic emoji only.
    // \p{Emoji} also matches 0-9, # and * (Unicode keycap bases), which
    // would silently strip digits from spoken text like "4.5/5".
    return text.replace(/\p{Extended_Pictographic}/gu, '').trim();
  } catch {
    return text.replace(EMOJI_HARDCODED, '').trim();
  }
}
