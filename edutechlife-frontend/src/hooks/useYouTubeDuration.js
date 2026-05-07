import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook para obtener la duración real de un video de YouTube.
 * Se sincroniza automáticamente cuando el video se carga.
 * 
 * @param {string} videoUrl - URL del video de YouTube (embed o watch)
 * @returns {object} { duration, loading, error, formatDuration }
 */
export function useYouTubeDuration(videoUrl) {
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  const extractVideoId = useCallback((url) => {
    if (!url) return null;
    
    const patterns = [
      /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /youtu\.be\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }, []);

  const formatDuration = useCallback((seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const remainingM = m % 60;
      return `${h}:${String(remainingM).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      setLoading(false);
      return;
    }

    // Cargar la API de YouTube IFrame
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const waitForYT = () => {
      if (window.YT && window.YT.Player) {
        return true;
      }
      return false;
    };

    const checkPlayerReady = setInterval(() => {
      if (waitForYT()) {
        clearInterval(checkPlayerReady);
        
        // Crear un player invisible para obtener la duración
        const containerId = 'yt-duration-checker-' + videoId;
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          container.style.position = 'absolute';
          container.style.left = '-9999px';
          container.style.width = '1px';
          container.style.height = '1px';
          container.style.opacity = '0';
          container.style.pointerEvents = 'none';
          document.body.appendChild(container);
        }

        try {
          if (playerRef.current) {
            playerRef.current.destroy();
          }

          playerRef.current = new window.YT.Player(containerId, {
            height: '1',
            width: '1',
            videoId: videoId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1
            },
            events: {
              onReady: (event) => {
                const durationSeconds = event.target.getDuration();
                if (durationSeconds && durationSeconds > 0) {
                  setDuration(durationSeconds);
                  setLoading(false);
                  setError(null);
                } else {
                  setError('No se pudo obtener la duración');
                  setLoading(false);
                }
              },
              onError: () => {
                setError('Error al cargar el video');
                setLoading(false);
              }
            }
          });
        } catch (err) {
          setError('Error: ' + err.message);
          setLoading(false);
        }
      }
    }, 200);

    return () => {
      clearInterval(checkPlayerReady);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
      }
    };
  }, [videoUrl, extractVideoId]);

  return {
    duration: duration ? formatDuration(duration) : null,
    durationSeconds: duration,
    loading,
    error,
    formatDuration
  };
}

export default useYouTubeDuration;
