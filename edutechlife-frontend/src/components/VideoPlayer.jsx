import { useState, useEffect, useRef } from 'react';
import { Icon } from '../utils/iconMapping.jsx';

const formatTime = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const VideoPlayer = ({ url, title, autoPlay = false }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const hideTimer = useRef(null);
  const progressTimer = useRef(null);

  const [playing, setPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showSpeed, setShowSpeed] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [ccActive, setCcActive] = useState(false);

  const videoId = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/)?.[1] ||
    url?.match(/youtube\.com\/watch\?.*v=([^&\n?#]+)/)?.[1];

  useEffect(() => {
    if (!videoId || !containerRef.current) return;
    const init = () => {
      if (playerRef.current) try { playerRef.current.destroy(); } catch {}
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '100%', width: '100%', videoId,
        playerVars: { autoplay: autoPlay ? 1 : 0, controls: 0, rel: 0, modestbranding: 1, enablejsapi: 1, origin: window.location.origin },
        events: {
          onReady: (e) => {
            if (autoPlay) try { e.target.playVideo(); } catch {}
            setDuration(e.target.getDuration());
            setVolume(e.target.getVolume());
            progressTimer.current = setInterval(() => {
              try { if (playerRef.current?.getCurrentTime) setCurrentTime(playerRef.current.getCurrentTime()); } catch {}
            }, 500);
          },
          onStateChange: (e) => {
            setPlaying(e.data === window.YT.PlayerState.PLAYING);
            setBuffering(e.data === window.YT.PlayerState.BUFFERING);
            if (e.data === window.YT.PlayerState.PLAYING) try { setDuration(playerRef.current.getDuration()); } catch {}
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
    return () => { clearInterval(ci); if (playerRef.current) try { playerRef.current.destroy(); } catch {} };
  }, [videoId, autoPlay]);

  useEffect(() => {
    return () => { if (progressTimer.current) clearInterval(progressTimer.current); };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    try { playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo(); } catch {}
  };

  const changeRate = (r) => {
    if (!playerRef.current) return;
    try { playerRef.current.setPlaybackRate(r); setRate(r); } catch {}
    setShowSpeed(false);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try { muted ? playerRef.current.unMute() : playerRef.current.mute(); setMuted(!muted); } catch {}
  };

  const seek = (pct) => {
    if (!playerRef.current || !duration) return;
    try { playerRef.current.seekTo(pct * duration, true); } catch {}
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

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case ' ': case 'k': e.preventDefault(); togglePlay(); break;
        case 'm': e.preventDefault(); toggleMute(); break;
        case 'f': e.preventDefault(); goFullscreen(); break;
        case 'ArrowRight': case 'l': e.preventDefault(); seek(Math.min(1, (currentTime + 10) / Math.max(duration, 1))); break;
        case 'ArrowLeft': case 'j': e.preventDefault(); seek(Math.max(0, (currentTime - 10) / Math.max(duration, 1))); break;
        case 'c': e.preventDefault(); toggleCaptions(); break;
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [playing, muted, duration, currentTime, ccActive]);

  if (!videoId) {
    return (
      <div className="relative bg-gradient-to-br from-[#0A1729] to-[#004B63] rounded-2xl overflow-hidden border border-[#4DA8C4]/20">
        <div className="aspect-video flex flex-col items-center justify-center p-8">
          <div className="w-20 h-20 mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <Icon name="fa-video-slash" className="text-3xl text-white/50" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Video no disponible</h3>
          <p className="text-[#B2D8E5] text-center max-w-md">El contenido de video estará disponible próximamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-[#0A1729] to-[#004B63] rounded-2xl overflow-hidden border border-[#4DA8C4]/20 shadow-2xl">
      <div className="px-6 py-4 border-b border-[#4DA8C4]/20 bg-gradient-to-r from-[#004B63]/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] rounded-lg flex items-center justify-center">
              <Icon name="fa-play" className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">{title || 'Video del Módulo'}</h3>
              <p className="text-sm text-[#B2D8E5]">Contenido educativo premium</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative aspect-video group select-none" onMouseMove={() => { setShowControls(true); clearTimeout(hideTimer.current); hideTimer.current = setTimeout(() => setShowControls(false), 3000); }} onMouseLeave={() => setShowControls(false)}>
        <div ref={containerRef} className="absolute inset-0" />

        {buffering && playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        <div className="absolute inset-0 cursor-pointer" onClick={togglePlay} />

        {!playing && !buffering && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button onClick={togglePlay} className="pointer-events-auto w-20 h-20 bg-[#4DA8C4]/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
              <Icon name="fa-play" className="text-white text-2xl ml-1" />
            </button>
          </div>
        )}

        <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8 pb-3 px-4">
            <div className="group/progress relative mb-2 cursor-pointer" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); }}>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00BCD4] to-[#4DA8C4] rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
              </div>
              <div className="absolute -top-1.5 left-0 w-3 h-3 bg-[#00BCD4] rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 6px)` }} />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center text-white hover:text-[#00BCD4] transition-colors" aria-label={playing ? 'Pausar' : 'Reproducir'}>
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                ) : <Icon name="fa-play" className="text-sm" />}
              </button>
              <div className="flex items-center gap-1.5 group/vol">
                <button onClick={toggleMute} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                  <Icon name={muted || volume === 0 ? 'fa-volume-mute' : 'fa-volume-up'} className="text-[10px]" />
                </button>
              </div>
              <span className="text-xs text-white/70 font-mono whitespace-nowrap">{formatTime(currentTime)} / {formatTime(duration)}</span>
              <div className="flex-1" />
              <div className="relative">
                <button onClick={() => setShowSpeed(!showSpeed)} className="px-2 h-7 text-[11px] font-bold text-white/70 hover:text-white rounded-md hover:bg-white/10">{rate}x</button>
                {showSpeed && (
                  <div className="absolute bottom-full right-0 mb-2 bg-[#0A1729] border border-white/10 rounded-xl p-1.5 shadow-2xl min-w-[100px]">
                    <p className="text-[9px] text-white/40 uppercase tracking-wider px-2 pb-1">Velocidad</p>
                    {SPEEDS.map(s => (
                      <button key={s} onClick={() => changeRate(s)} className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${rate === s ? 'bg-[#00BCD4]/20 text-[#00BCD4] font-bold' : 'text-white/70 hover:bg-white/10'}`}>{s}x</button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={toggleCaptions} className="w-7 h-7 flex items-center justify-center transition-colors" aria-label="Subtítulos" title="Subtítulos">
                <Icon name="fa-closed-captioning" className={`text-[10px] ${ccActive ? 'text-[#00BCD4]' : 'text-white/70 hover:text-white'}`} />
              </button>
              <button onClick={goFullscreen} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white" aria-label="Pantalla completa">
                <Icon name="fa-expand" className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-[#4DA8C4]/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0A3550]/30 rounded-xl p-4">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2"><Icon name="fa-keyboard" /> Atajos de Teclado</h4>
            <div className="space-y-2 text-sm">
              {[['Espacio / K', 'Play/Pause'], ['M', 'Silenciar'], ['C', 'Subtítulos'], ['F', 'Pantalla completa'], ['Flechas / J/L', 'Avanzar/Retroceder 10s']].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-[#B2D8E5]">{k}</span><span className="text-white">{v}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-[#0A3550]/30 rounded-xl p-4">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2"><Icon name="fa-circle-info" /> Información</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#B2D8E5]">Velocidad</span><span className="text-white">{rate}x</span></div>
              <div className="flex justify-between"><span className="text-[#B2D8E5]">Formato</span><span className="text-white">YouTube</span></div>
              <div className="flex justify-between"><span className="text-[#B2D8E5]">Subtítulos</span><span className="text-white">{ccActive ? 'Activados' : 'Disponibles (C)'}</span></div>
            </div>
          </div>
          <div className="bg-[#0A3550]/30 rounded-xl p-4">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2"><Icon name="fa-lightbulb" /> Consejos</h4>
            <ul className="space-y-2 text-sm text-[#B2D8E5]">
              {['Toma notas durante el video', 'Pausa para practicar los conceptos', 'Usa velocidad 1.25x para repasar'].map(t => (
                <li key={t} className="flex items-start gap-2"><Icon name="fa-check" className="text-[#66CCCC] mt-0.5" /><span>{t}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
