import { useState, useRef, useEffect } from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';
import { useTranslation } from '../../../i18n/I18nProvider';

const formatTime = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const VideoViewer = ({ resource, youtubeDuration, durationLoading, onVideoEnded }) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const endedRef = useRef(onVideoEnded);
  endedRef.current = onVideoEnded;

  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showSpeed, setShowSpeed] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [ccActive, setCcActive] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const hideTimer = useRef(null);
  const progressTimer = useRef(null);

  const videoId = resource?.url?.match(/(?:embed\/|watch\?v=)([a-zA-Z0-9_-]+)/)?.[1];

  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    // Suprimir errores de postMessage cross-origin de YouTube (bug conocido del iframe API)
    const suppressPostMsgError = (e) => {
      if (e.data && typeof e.data === 'string' && e.data.includes('www-widgetapi')) {
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener('message', suppressPostMsgError, true);

    const init = () => {
      if (playerRef.current) try { playerRef.current.destroy(); } catch {}
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '100%', width: '100%',
        videoId,
        playerVars: {
          autoplay: 1, controls: 0, rel: 0, modestbranding: 1, disablekb: 1,
          enablejsapi: 1, origin: window.location.origin, cc_load_policy: 0,
        },
        events: {
          onReady: (e) => {
            e.target.playVideo();
            setDuration(e.target.getDuration());
            setVolume(e.target.getVolume());
          },
          onStateChange: (e) => {
            setPlaying(e.data === window.YT.PlayerState.PLAYING);
            setBuffering(e.data === window.YT.PlayerState.BUFFERING);
            if (e.data === window.YT.PlayerState.ENDED) { setHasEnded(true); endedRef.current?.(); }
            if (e.data === window.YT.PlayerState.PLAYING) {
              try { setDuration(playerRef.current.getDuration()); } catch {}
              clearInterval(progressTimer.current);
              progressTimer.current = setInterval(() => {
                try {
                  if (playerRef.current && playerRef.current.getCurrentTime) {
                    setCurrentTime(playerRef.current.getCurrentTime());
                  }
                } catch {}
              }, 1000);
            } else {
              clearInterval(progressTimer.current);
            }
          },
        },
      });
    };
    if (window.YT && window.YT.Player && window.YT.loaded) { init(); return; }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    const ci = setInterval(() => {
      if (window.YT && window.YT.Player && window.YT.loaded) { clearInterval(ci); init(); }
    }, 200);
    return () => { clearInterval(ci); if (progressTimer.current) clearInterval(progressTimer.current); if (playerRef.current) try { playerRef.current.destroy(); } catch {} window.removeEventListener('message', suppressPostMsgError, true); };
  }, [videoId]);

  useEffect(() => {
    return () => { if (progressTimer.current) clearInterval(progressTimer.current); };
  }, [progressTimer]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (playing) playerRef.current.pauseVideo();
      else playerRef.current.playVideo();
    } catch {}
  };

  const changeRate = (r) => {
    if (!playerRef.current) return;
    try { playerRef.current.setPlaybackRate(r); setRate(r); } catch {}
    setShowSpeed(false);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (muted) { playerRef.current.unMute(); setMuted(false); }
      else { playerRef.current.mute(); setMuted(true); }
    } catch {}
  };

  const changeVolume = (v) => {
    if (!playerRef.current) return;
    try { playerRef.current.setVolume(v); setVolume(v); if (v > 0) setMuted(false); } catch {}
  };

  const seek = () => {
    // Bloqueado: no se permite adelantar ni retroceder el video
    return;
  };

  const goFullscreen = () => {
    try {
      const iframe = playerRef.current?.getIframe?.();
      if (iframe) {
        if (document.fullscreenElement) document.exitFullscreen();
        else iframe.requestFullscreen?.();
        return;
      }
    } catch {}
    try {
      const el = containerRef.current?.querySelector('iframe') || containerRef.current;
      if (el && document.fullscreenElement) document.exitFullscreen();
      else if (el) el.requestFullscreen?.();
    } catch {}
  };

  const toggleCaptions = () => {
    if (!playerRef.current) return;
    try {
      if (ccActive) {
        playerRef.current.unloadModule('captions');
        setCcActive(false);
      } else {
        playerRef.current.loadModule('captions');
        setTimeout(() => {
          try {
            const tracks = playerRef.current?.getOption('captions', 'tracklist') || [];
            const es = tracks.find(t => t.languageCode === 'es');
            if (es) playerRef.current?.setOption('captions', 'track', es);
            else if (tracks.length > 0) playerRef.current?.setOption('captions', 'track', tracks[0]);
          } catch {}
        }, 300);
        setCcActive(true);
      }
    } catch {}
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case ' ': case 'k': e.preventDefault(); togglePlay(); break;
        case 'm': e.preventDefault(); toggleMute(); break;
        case 'f': e.preventDefault(); goFullscreen(); break;
        case 'c': e.preventDefault(); toggleCaptions(); break;
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [playing, muted, duration, currentTime, ccActive]);

  if (!videoId) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-[#0A1729] to-[#004B63] rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <Icon name="fa-video-slash" className="text-3xl text-white/50" />
          </div>
          <p className="text-white/70 text-sm">{t('ialab.viewer_modal.video_unavailable')}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full bg-black rounded-2xl overflow-hidden group select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <div ref={containerRef} className="w-full h-full" />

      {buffering && playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      <div className="absolute inset-0 cursor-pointer" onClick={togglePlay} />

      {!playing && !buffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Icon name="fa-play" className="text-white text-2xl ml-1" />
          </div>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8 pb-3 px-4">
          <div className="group/progress relative mb-2 cursor-default">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00BCD4] to-[#4DA8C4] rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <div className="absolute -top-1.5 left-0 w-3 h-3 bg-[#00BCD4] rounded-full shadow-lg" style={{ left: `calc(${progress}% - 6px)` }} />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center text-white hover:text-[#00BCD4] transition-colors" aria-label={playing ? t('ialab.viewer_modal.pause') : t('ialab.viewer_modal.play')}>
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              ) : (
                <Icon name="fa-play" className="text-sm" />
              )}
            </button>

            <div className="flex items-center gap-1.5 group/vol">
              <button onClick={toggleMute} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors" aria-label={muted ? t('ialab.viewer_modal.unmute') : t('ialab.viewer_modal.mute')}>
                <Icon name={muted || volume === 0 ? 'fa-volume-mute' : 'fa-volume-up'} className="text-[10px]" />
              </button>
              <div className="w-0 group-hover/vol:w-16 overflow-hidden transition-all duration-200">
                <input type="range" min={0} max={100} value={muted ? 0 : volume} onChange={(e) => changeVolume(Number(e.target.value))}
                  className="w-16 h-1 accent-[#00BCD4] cursor-pointer" aria-label={t('ialab.viewer_modal.volume')} />
              </div>
            </div>

            <span className="text-xs text-white/70 font-mono whitespace-nowrap">
              {formatTime(currentTime)} / {durationLoading ? '...' : formatTime(duration) || (youtubeDuration || resource.duration || '0:00')}
            </span>

            <div className="flex-1" />

            <div className="relative">
              <button onClick={() => setShowSpeed(!showSpeed)} className="px-2 h-7 text-[11px] font-bold text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors" aria-label={t('ialab.viewer_modal.speed_label')}>
                {rate}x
              </button>
              {showSpeed && (
                <div className="absolute bottom-full right-0 mb-2 bg-[#0A1729] border border-white/10 rounded-xl p-1.5 shadow-2xl min-w-[100px]">
                  <p className="text-[9px] text-white/40 uppercase tracking-wider px-2 pb-1">{t('ialab.viewer_modal.speed')}</p>
                  {SPEEDS.map(s => (
                    <button key={s} onClick={() => changeRate(s)}
                      className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${rate === s ? 'bg-[#00BCD4]/20 text-[#00BCD4] font-bold' : 'text-white/70 hover:bg-white/10'}`}>
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleCaptions} className="w-7 h-7 flex items-center justify-center transition-colors" aria-label={t('ialab.viewer_modal.cc')} title={t('ialab.viewer_modal.cc')}>
              <Icon name="fa-closed-captioning" className={`text-[10px] ${ccActive ? 'text-[#00BCD4]' : 'text-white/70 hover:text-white'}`} />
            </button>

            <button onClick={goFullscreen} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors" aria-label={t('ialab.viewer_modal.fullscreen')}>
              <Icon name="fa-expand" className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>

      {!hasEnded && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-50/95 border border-amber-200 rounded-lg text-xs font-medium text-amber-700 shadow-sm z-10 backdrop-blur-sm">
          {t('ialab.viewer_modal.warning_no_skip')}
        </div>
      )}
    </div>
  );
};

export default VideoViewer;
