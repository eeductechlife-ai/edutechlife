/**
 * useValerioSyncedStream
 * Synchronizes streaming text output with concurrent text-to-speech
 * Eliminates the wait between text generation and audio playback
 */

import { useState, useCallback, useRef } from 'react';

export function useValerioSyncedStream() {
  const [textChunks, setTextChunks] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  const textBufferRef = useRef('');
  const audioQueueRef = useRef([]);
  const abortControllerRef = useRef(null);

  /**
   * Stream text from API and convert chunks to speech in parallel
   */
  const streamWithAudio = useCallback(
    async (
      fetchFn, // Function that returns fetch response
      ttsService, // Function(text) => Promise<audioBlob>
      options = {}
    ) => {
      const { minChunkLength = 50, maxChunkWait = 2000 } = options;

      setIsStreaming(true);
      setTextChunks([]);
      setAudioUrl(null);
      setError(null);
      textBufferRef.current = '';
      audioQueueRef.current = [];

      try {
        abortControllerRef.current = new AbortController();
        const response = await fetchFn();

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let lastTtsTime = Date.now();

        const processChunk = async () => {
          const { done, value } = await reader.read();

          if (done) {
            // Process remaining buffer
            if (textBufferRef.current.length > 0) {
              await enqueueTTS(textBufferRef.current, ttsService);
              textBufferRef.current = '';
            }
            setIsStreaming(false);
            return;
          }

          const text = decoder.decode(value, { stream: true });
          textBufferRef.current += text;

          // Update UI with new text
          setTextChunks(prev => [...prev, text]);

          // Trigger TTS if buffer exceeds threshold OR timeout elapsed
          const now = Date.now();
          if (
            textBufferRef.current.length >= minChunkLength ||
            now - lastTtsTime >= maxChunkWait
          ) {
            if (textBufferRef.current.length > 0) {
              await enqueueTTS(textBufferRef.current, ttsService);
              lastTtsTime = now;
              textBufferRef.current = '';
            }
          }

          await processChunk();
        };

        await processChunk();

        // Wait for all audio to be generated
        if (audioQueueRef.current.length > 0) {
          await concatenateAndPlayAudio(audioQueueRef.current);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('[useValerioSyncedStream] Error:', err);
          setError(err.message);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  /**
   * Cancel ongoing stream
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setTextChunks([]);
    setAudioUrl(null);
    setError(null);
    textBufferRef.current = '';
    audioQueueRef.current = [];
  }, []);

  return {
    textChunks,
    isStreaming,
    audioUrl,
    error,
    streamWithAudio,
    cancel,
    reset,
  };
}

/**
 * Enqueue text chunk for TTS conversion
 */
async function enqueueTTS(text, ttsService) {
  try {
    const audioBlob = await ttsService(text);
    if (audioBlob) {
      audioQueueRef.current.push(audioBlob);
    }
  } catch (err) {
    console.warn('[useValerioSyncedStream] TTS failed for chunk:', err.message);
  }
}

/**
 * Concatenate audio blobs and create playable URL
 */
async function concatenateAndPlayAudio(audioBlobs) {
  try {
    if (audioBlobs.length === 0) return;

    if (audioBlobs.length === 1) {
      const url = URL.createObjectURL(audioBlobs[0]);
      setAudioUrl(url);
      return;
    }

    // Concatenate multiple audio blobs
    const concatenated = new Blob(audioBlobs, { type: 'audio/mpeg' });
    const url = URL.createObjectURL(concatenated);
    setAudioUrl(url);
  } catch (err) {
    console.warn('[useValerioSyncedStream] Audio concatenation failed:', err.message);
  }
}

/**
 * Integration helper: Convert streaming response to text + audio
 */
export async function streamValerioResponse(fetchFn, ttsService) {
  const hook = useValerioSyncedStream();

  await hook.streamWithAudio(fetchFn, ttsService, {
    minChunkLength: 50,
    maxChunkWait: 1000,
  });

  return hook;
}
