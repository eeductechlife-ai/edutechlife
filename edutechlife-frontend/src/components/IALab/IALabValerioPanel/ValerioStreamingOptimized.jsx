/**
 * ValerioStreamingOptimized
 * Handles synchronized text streaming + TTS playback
 * Text displays live while audio plays in parallel (not sequential)
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { cleanTextForTTS } from "../../../utils/textCleaner";
import { speakTextConversational } from "../../../utils/speech";

/**
 * Hook for parallel streaming: text + audio simultaneously
 * Usage:
 *   const { chunks, isStreaming, audioQueue } = useSyncedStreaming();
 *   // Then pipe chunks to UI and let audio play in parallel
 */
export const useSyncedStreaming = () => {
  const [chunks, setChunks] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const textBufferRef = useRef("");
  const audioQueueRef = useRef([]);
  const ttsPlayingRef = useRef(false);

  const addChunk = useCallback((text) => {
    setChunks((prev) => [...prev, text]);
    textBufferRef.current += text;
  }, []);

  const enqueueSentenceForTTS = useCallback((sentence) => {
    if (sentence.trim().length >= 5) {
      audioQueueRef.current.push(sentence);
      // Process queue if not already playing
      if (!ttsPlayingRef.current) {
        processAudioQueue();
      }
    }
  }, []);

  const processAudioQueue = useCallback(() => {
    if (audioQueueRef.current.length === 0 || ttsPlayingRef.current) return;

    ttsPlayingRef.current = true;
    const sentence = audioQueueRef.current.shift();

    speakTextConversational(cleanTextForTTS(sentence), "valerio", {}, () => {
      ttsPlayingRef.current = false;
      if (audioQueueRef.current.length > 0) {
        processAudioQueue();
      }
    });
  }, []);

  const extractAndQueueSentences = useCallback(
    (newChunk) => {
      textBufferRef.current += newChunk;

      // Extract complete sentences from buffer
      while (true) {
        const match = textBufferRef.current.match(/[.!?…](?:\s|$|[\n\r])/);
        if (!match) break;

        const endIdx = match.index + 1;
        const sentence = textBufferRef.current.slice(0, endIdx).trim();
        textBufferRef.current = textBufferRef.current.slice(
          endIdx + match[0].length,
        );

        // Queue sentence for TTS (in parallel with text rendering)
        enqueueSentenceForTTS(sentence);
      }
    },
    [enqueueSentenceForTTS],
  );

  const finalize = useCallback(() => {
    // Send remaining text as final sentence
    const remaining = textBufferRef.current.trim();
    if (remaining.length > 3) {
      enqueueSentenceForTTS(remaining);
      textBufferRef.current = "";
    }
  }, [enqueueSentenceForTTS]);

  const reset = useCallback(() => {
    setChunks([]);
    textBufferRef.current = "";
    audioQueueRef.current = [];
    ttsPlayingRef.current = false;
  }, []);

  return {
    chunks,
    isStreaming,
    addChunk,
    extractAndQueueSentences,
    finalize,
    reset,
    audioQueue: audioQueueRef.current,
    isAudioPlaying: ttsPlayingRef.current,
  };
};

/**
 * Component: StreamingMessage with parallel TTS
 * Displays text in real-time while audio plays simultaneously
 */
export const StreamingMessageOptimized = ({
  textChunks,
  isStreaming,
  isAudioPlaying,
  showCursor = true,
}) => {
  const fullText = textChunks.join("");

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] rounded-2xl p-4 break-words overflow-wrap-anywhere bg-white border border-slate-200 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center text-white text-xs font-bold">
              V
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium opacity-80 mb-2 flex items-center gap-2">
              MAX
              {isAudioPlaying && (
                <span className="inline-flex gap-0.5">
                  <span className="w-1.5 h-1.5 bg-petroleum rounded-full animate-pulse"></span>
                  <span
                    className="w-1.5 h-1.5 bg-petroleum rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-petroleum rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </span>
              )}
            </div>
            <div className="prose prose-sm max-w-none text-petroleum-darker">
              {fullText.split("\n").map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">
                  {line}
                  {i === fullText.split("\n").length - 1 &&
                    isStreaming &&
                    showCursor && (
                      <span className="inline-block w-1.5 h-4 bg-corporate ml-0.5 animate-pulse align-text-bottom" />
                    )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Integration Helper
 * Drop-in replacement for current streaming logic in index.jsx
 */
export const useStreamingWithAudio = () => {
  const streaming = useSyncedStreaming();

  const handleStreamChunk = useCallback(
    (chunk) => {
      streaming.addChunk(chunk);
      streaming.extractAndQueueSentences(chunk);
    },
    [streaming],
  );

  const handleStreamComplete = useCallback(() => {
    streaming.finalize();
  }, [streaming]);

  return {
    streaming,
    handleStreamChunk,
    handleStreamComplete,
  };
};
