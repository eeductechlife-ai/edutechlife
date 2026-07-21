import { speakTextConversational, iniciarReconocimiento, stopRecognition } from "../../../utils/speech";
import { getVoiceOverrides, stripEmoji } from "./DaniVoiceController";

export function retrySpeech({ setVoiceBlocked, speechPrimed }) {
  setVoiceBlocked(false);
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("");
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
    window.speechSynthesis.cancel();
    speechPrimed.current = true;
  }
}

export function toggleVoice({ isSpeaking, stopSpeech, setVoiceEnabled, setVoiceBlocked }) {
  if (isSpeaking) stopSpeech();
  setVoiceEnabled((prev) => !prev);
  setVoiceBlocked(false);
}

export function handleMicClick({
  isListening,
  setInputText,
  handleSendMessage,
  setIsListening,
}) {
  if (isListening) {
    stopRecognition();
    return;
  }
  iniciarReconocimiento(
    setInputText,
    (finalText) => {
      if (finalText.trim()) {
        handleSendMessage(finalText);
      }
    },
    setIsListening,
  );
}

export function processStreamChunkVoice(
  chunk,
  {
    pendingSentenceRef,
    voiceEnabled,
    isSpeakingRef,
    daniMood,
    setIsSpeaking,
    setVoiceBlocked,
  },
) {
  pendingSentenceRef.current += chunk;
  while (true) {
    const match = pendingSentenceRef.current.match(/[.!?](?:\s|$)/);
    if (!match) break;
    const endIdx = match.index + 1;
    const sentence = pendingSentenceRef.current.slice(0, endIdx).trim();
    pendingSentenceRef.current = pendingSentenceRef.current.slice(
      endIdx + match[0].length,
    );
    if (voiceEnabled && sentence.length >= 8 && !isSpeakingRef.current) {
      speakSentence(sentence, {
        setIsSpeaking,
        isSpeakingRef,
        daniMood,
        setVoiceBlocked,
      });
    }
  }
}

export function speakRemainingText(
  remaining,
  { voiceEnabled, isSpeakingRef, daniMood, setIsSpeaking, setVoiceBlocked },
) {
  if (remaining.length >= 8 && voiceEnabled) {
    speakSentence(remaining, {
      setIsSpeaking,
      isSpeakingRef,
      daniMood,
      setVoiceBlocked,
    });
  }
}

function speakSentence(
  sentence,
  { setIsSpeaking, isSpeakingRef, daniMood, setVoiceBlocked },
) {
  setIsSpeaking(true);
  isSpeakingRef.current = true;
  const cleanSentence = stripEmoji(sentence);
  if (cleanSentence.length > 0) {
    const voiceOverrides = getVoiceOverrides(daniMood);
    speakTextConversational(
      cleanSentence,
      "dani",
      voiceOverrides,
      () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      },
      (err) => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        if (err && err.includes("bloqueado")) setVoiceBlocked(true);
      },
    );
  } else {
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  }
}
