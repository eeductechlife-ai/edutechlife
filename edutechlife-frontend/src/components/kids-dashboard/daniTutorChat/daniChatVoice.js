import {
  speakTextConversational,
  iniciarReconocimiento,
  stopRecognition,
} from "../../../utils/speech";
import { getVoiceOverrides, stripEmoji } from "./DaniVoiceController";

// ----- Sentence queue so all sentences play sequentially without cancelling each other -----
let _sentenceQueue = [];
let _queueRunning = false;

function _drainQueue(context) {
  if (_queueRunning || _sentenceQueue.length === 0) return;
  _queueRunning = true;
  const { text, setIsSpeaking, isSpeakingRef, daniMood, setVoiceBlocked } =
    _sentenceQueue.shift();

  setIsSpeaking(true);
  isSpeakingRef.current = true;

  const voiceOverrides = getVoiceOverrides(daniMood);
  speakTextConversational(
    text,
    "dani",
    voiceOverrides,
    () => {
      _queueRunning = false;
      if (_sentenceQueue.length > 0) {
        _drainQueue();
      } else {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      }
    },
    (err) => {
      _queueRunning = false;
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      if (err && err.includes("bloqueado")) setVoiceBlocked(true);
      // Try next sentence even on error
      if (_sentenceQueue.length > 0) _drainQueue();
    },
  );
}

function _enqueueSentence(sentence, context) {
  _sentenceQueue.push({ text: sentence, ...context });
  _drainQueue();
}

function _clearQueue() {
  _sentenceQueue = [];
  _queueRunning = false;
}
// ----- end queue -----

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

export function toggleVoice({
  isSpeaking,
  stopSpeech,
  setVoiceEnabled,
  setVoiceBlocked,
}) {
  if (isSpeaking) {
    _clearQueue();
    stopSpeech();
  }
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
  let safety = 0;
  while (safety < 100) {
    const match = pendingSentenceRef.current.match(/(?<!\d)[.!?](?:\s|$)/);
    if (!match) break;
    const endIdx = match.index + 1;
    const sentence = pendingSentenceRef.current.slice(0, endIdx).trim();
    pendingSentenceRef.current = pendingSentenceRef.current.slice(
      endIdx + match[0].length,
    );
    const clean = stripEmoji(sentence);
    if (voiceEnabled && clean.length >= 8) {
      _enqueueSentence(clean, {
        setIsSpeaking,
        isSpeakingRef,
        daniMood,
        setVoiceBlocked,
      });
    }
    safety++;
  }
}

export function speakRemainingText(
  remaining,
  { voiceEnabled, isSpeakingRef, daniMood, setIsSpeaking, setVoiceBlocked },
) {
  const clean = stripEmoji(remaining.trim());
  if (clean.length >= 8 && voiceEnabled) {
    _enqueueSentence(clean, {
      setIsSpeaking,
      isSpeakingRef,
      daniMood,
      setVoiceBlocked,
    });
  }
}

export function clearVoiceQueue() {
  _clearQueue();
}
