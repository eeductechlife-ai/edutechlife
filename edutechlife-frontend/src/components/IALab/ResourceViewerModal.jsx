/**
 * COMPONENTE: ResourceViewerModal
 * 
 * Modal Pop-up Central para visualización de recursos educativos
 * Se abre al hacer clic en cualquier recurso (PDF, OVA, Video, etc.)
 * 
 * Características:
 * - Modal central independiente (pop-up sobre dashboard)
 * - Ocupa 90% de pantalla (height: 90vh)
 * - Botón de cierre claro con "X"
 * - Diseño premium Edutechlife (#004B63, #00BCD4)
 * - Responsive en todos dispositivos
 * - Navegación entre recursos integrada
 * - Botón "Marcar como visto" en este modal
 */

import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../utils/iconMapping.jsx';
import { cn } from '../forum/forumDesignSystem';
import { useIALabContext } from '../../context/IALabContext';
import { useIALabProgress } from '../../hooks/IALab/useIALabProgress';
import QueEsPrompt_OVA_Original from './QueEsPrompt_OVA_Original';
import useFullscreen from './hooks/useFullscreen';
import { stopSpeech } from '../../utils/speech';

const OVAChatGPTTools = lazy(() => import('./OVAChatGPTTools.jsx'));
const OVAEcosystemGuide = lazy(() => import('./OVAEcosystemGuide.jsx'));
const OVABuildGPT = lazy(() => import('./OVABuildGPT.jsx'));
const OVAEtica = lazy(() => import('./OVAEtica.jsx'));
const OVAIntroPrompt = lazy(() => import('./OVAIntroPrompt.jsx'));
const OVANotebookLab = lazy(() => import('./OVANotebookLab.jsx'));
const OVANotebookSimulator = lazy(() => import('./OVANotebookSimulator.jsx'));
const OVANotebookPodcastGuide = lazy(() => import('./OVANotebookPodcastGuide.jsx'));
const OVAPodcastStudio = lazy(() => import('./OVAPodcastStudio.jsx'));
const OVABiasLab = lazy(() => import('./OVABiasLab.jsx'));
const OVARiskSimulator = lazy(() => import('./OVARiskSimulator.jsx'));

/**
 * Reproductor YouTube premium con controles reales vía YT.Player API
 */
const formatTime = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const VideoViewer = ({ resource, youtubeDuration, durationLoading, onVideoEnded }) => {
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
  const hideTimer = useRef(null);
  const progressTimer = useRef(null);

  const videoId = resource?.url?.match(/(?:embed\/|watch\?v=)([a-zA-Z0-9_-]+)/)?.[1];

  useEffect(() => {
    if (!videoId || !containerRef.current) return;
    const init = () => {
      if (playerRef.current) try { playerRef.current.destroy(); } catch {}
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '100%', width: '100%',
        videoId,
        playerVars: {
          autoplay: 1, controls: 0, rel: 0, modestbranding: 1,
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
            if (e.data === window.YT.PlayerState.ENDED) endedRef.current?.();
            if (e.data === window.YT.PlayerState.PLAYING) {
              try { setDuration(playerRef.current.getDuration()); } catch {}
              // Poll currentTime solo durante reproducción (cada 1s en vez de 500ms)
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
    return () => { clearInterval(ci); if (progressTimer.current) clearInterval(progressTimer.current); if (playerRef.current) try { playerRef.current.destroy(); } catch {} };
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
        case 'ArrowRight': e.preventDefault(); seek(Math.min(1, (currentTime + 10) / Math.max(duration, 1))); break;
        case 'ArrowLeft': e.preventDefault(); seek(Math.max(0, (currentTime - 10) / Math.max(duration, 1))); break;
        case 'j': e.preventDefault(); seek(Math.max(0, (currentTime - 10) / Math.max(duration, 1))); break;
        case 'l': e.preventDefault(); seek(Math.min(1, (currentTime + 10) / Math.max(duration, 1))); break;
        case 'c': e.preventDefault(); setCcActive(!ccActive); break;
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
          <p className="text-white/70 text-sm">Video no disponible</p>
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

      {/* Buffering spinner */}
      {buffering && playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Click-to-pause overlay */}
      <div className="absolute inset-0 cursor-pointer" onClick={togglePlay} />

      {/* Pause overlay */}
      {!playing && !buffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Icon name="fa-play" className="text-white text-2xl ml-1" />
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8 pb-3 px-4">
          {/* Progress bar */}
          <div className="group/progress relative mb-2 cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            seek((e.clientX - rect.left) / rect.width);
          }}>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00BCD4] to-[#4DA8C4] rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <div className="absolute -top-1.5 left-0 w-3 h-3 bg-[#00BCD4] rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 6px)` }} />
          </div>

          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center text-white hover:text-[#00BCD4] transition-colors" aria-label={playing ? 'Pausar' : 'Reproducir'}>
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              ) : (
                <Icon name="fa-play" className="text-sm" />
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/vol">
              <button onClick={toggleMute} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors" aria-label={muted ? 'Activar sonido' : 'Silenciar'}>
                <Icon name={muted || volume === 0 ? 'fa-volume-mute' : 'fa-volume-up'} className="text-[10px]" />
              </button>
              <div className="w-0 group-hover/vol:w-16 overflow-hidden transition-all duration-200">
                <input type="range" min={0} max={100} value={muted ? 0 : volume} onChange={(e) => changeVolume(Number(e.target.value))}
                  className="w-16 h-1 accent-[#00BCD4] cursor-pointer" aria-label="Volumen" />
              </div>
            </div>

            {/* Time */}
            <span className="text-xs text-white/70 font-mono whitespace-nowrap">
              {formatTime(currentTime)} / {durationLoading ? '...' : formatTime(duration) || (youtubeDuration || resource.duration || '0:00')}
            </span>

            <div className="flex-1" />

            {/* Speed */}
            <div className="relative">
              <button onClick={() => setShowSpeed(!showSpeed)} className="px-2 h-7 text-[11px] font-bold text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors" aria-label="Velocidad">
                {rate}x
              </button>
              {showSpeed && (
                <div className="absolute bottom-full right-0 mb-2 bg-[#0A1729] border border-white/10 rounded-xl p-1.5 shadow-2xl min-w-[100px]">
                  <p className="text-[9px] text-white/40 uppercase tracking-wider px-2 pb-1">Velocidad</p>
                  {SPEEDS.map(s => (
                    <button key={s} onClick={() => changeRate(s)}
                      className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${rate === s ? 'bg-[#00BCD4]/20 text-[#00BCD4] font-bold' : 'text-white/70 hover:bg-white/10'}`}>
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Captions */}
            <button onClick={toggleCaptions} className="w-7 h-7 flex items-center justify-center transition-colors" aria-label="Subtítulos" title="Subtítulos">
              <Icon name="fa-closed-captioning" className={`text-[10px] ${ccActive ? 'text-[#00BCD4]' : 'text-white/70 hover:text-white'}`} />
            </button>

            {/* Fullscreen */}
            <button onClick={goFullscreen} className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors" aria-label="Pantalla completa">
              <Icon name="fa-expand" className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente para visualizar documentos PDF
 */
const DocumentViewer = ({ resource }) => {
  const iframeRef = useRef(null);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
      {/* Header del documento */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
            <Icon name="fa-file-pdf" className="text-petroleum w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-petroleum">{resource.title}</h4>
            <div className="flex items-center gap-3 text-sm text-petroleum/70">
              <span>{resource.format}</span>
              {resource.size && <span>• {resource.size}</span>}
              {resource.pages && <span>• {resource.pages} páginas</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={resource.url}
            download
            className="px-4 py-2 bg-gradient-to-r from-petroleum to-corporate text-white rounded-lg hover:from-corporate-deep hover:to-corporate-darker transition-colors duration-200 flex items-center gap-2 font-medium"
          >
            <Icon name="fa-download" className="w-4 h-4" />
            Descargar
          </a>
        </div>
      </div>

      {/* Visualizador del documento */}
      <div className="flex-1 relative" ref={iframeRef}>
        <iframe
          src={`${resource.url}#view=FitH`}
          title={resource.title}
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
};

/**
 * Componente para visualizar imágenes e infografías
 */
const ImageViewer = ({ resource }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-auto">
      {/* Header de la imagen */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
            <Icon name="fa-image" className="text-petroleum w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-petroleum">{resource.title}</h4>
            {resource.interactive && (
              <span className="text-sm text-petroleum font-medium">Interactiva</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href={resource.url}
            download
            className="px-4 py-2 bg-gradient-to-r from-petroleum to-corporate text-white rounded-lg hover:from-corporate-deep hover:to-corporate-darker transition-colors duration-200 flex items-center gap-2 font-medium"
          >
            <Icon name="fa-download" className="w-4 h-4" />
            Descargar
          </a>
        </div>
      </div>

      {/* Contenedor de la imagen */}
      <div className="flex-1 relative bg-transparent">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-petroleum/25 border-t-[#004B63] rounded-full animate-spin"></div>
          </div>
        )}

        <img
          src={resource.url}
          alt={resource.title}
          className={cn(
            "w-full object-contain",
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>

      {resource.description && (
        <div className="p-4 bg-petroleum/5">
          <p className="text-sm text-petroleum/80">{resource.description}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Componente para recursos interactivos
 */
const InteractiveViewer = ({ resource }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-petroleum/10 to-corporate/10 flex items-center justify-center">
            <Icon name="fa-puzzle-piece" className="text-petroleum w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-petroleum">{resource.title}</h4>
            <div className="flex items-center gap-3 text-sm text-petroleum/70">
              <span>Recurso interactivo</span>
              {resource.estimatedTime && <span>• {resource.estimatedTime}</span>}
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-gradient-to-br from-petroleum/10 to-corporate/10 text-petroleum rounded-lg font-medium text-sm">
          <Icon name="fa-bolt" className="w-4 h-4 inline mr-1" />
          Interactivo
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-petroleum to-corporate rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Icon name="fa-bolt" className="text-white text-2xl" />
          </div>
          
          <h3 className="text-xl font-bold text-petroleum mb-3">
            {resource.title}
          </h3>
          
          <p className="text-petroleum/70 mb-6">
            {resource.description || "Este recurso interactivo está diseñado para aprendizaje práctico."}
          </p>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-petroleum/25 dark:border-petroleum/40 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-petroleum/80">Simulación activa</span>
              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">En tiempo real</span>
            </div>
            
            <div className="h-32 bg-gradient-to-r from-petroleum/5 to-corporate/5 rounded-lg border border-petroleum/25 flex items-center justify-center">
              <div className="text-center">
                <Icon name="fa-spinner" className="text-[#06B6D4] text-2xl mb-2 animate-spin" />
                <p className="text-sm text-petroleum/70">Cargando experiencia interactiva...</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-petroleum/60">
            <p>Este es un recurso interactivo que requiere interacción del usuario.</p>
            <p>En producción, aquí se cargaría la herramienta interactiva real.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente para PDF Thumbnail (con doble clic para vista inmersiva)
 */
const PDFThumbnailViewer = ({ resource }) => {
  const openFullScreen = () => window.open(resource.url, '_blank');

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-end items-center mb-2 px-1">
        <button
          onClick={openFullScreen}
          className="text-sm font-medium text-petroleum bg-petroleum/10 hover:bg-petroleum/12 py-1.5 px-3 rounded-md transition-colors flex items-center gap-2"
        >
          <Icon name="fa-expand" className="w-3.5 h-3.5" />
          Abrir en pantalla completa
          <Icon name="fa-arrow-up-right-from-square" className="w-3 h-3" />
        </button>
      </div>
      <div className="flex-1 bg-transparent rounded-2xl overflow-hidden">
        <iframe
          src={resource.url}
          title={resource.title}
          className="w-full h-full rounded-lg border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

const OVAViewer = ({ resource, onClose, onAutoComplete }) => {
  const autoMarkedRef = useRef(false);
  const onAutoCompleteRef = useRef(onAutoComplete);
  onAutoCompleteRef.current = onAutoComplete;

  // Documentos requieren clic manual en "Marcar como visto" - sin auto-mark
  useEffect(() => {
    // No auto-mark para documentos
  }, []);

  if (resource.url) {
    return (
      <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-auto">
        <iframe
          src={resource.url}
          title={resource.title}
          className="w-full h-full rounded-2xl border-0"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-auto">
      <div className="flex-1 relative">
        <QueEsPrompt_OVA_Original onClose={onClose} />
      </div>
    </div>
  );
};

/**
 * Componente principal ResourceViewerModal
 */
const ResourceViewerModal = ({ 
  isOpen = false,
  onClose,
  resource = null,
  resourceType = null,
  onMarkAsViewed,
  onPreviousResource,
  onNextResource,
  currentIndex = 0,
  totalResources = 0,
  onOpenImmersiveView = null,
  onOpenOVA = null,
  youtubeDuration = null,
  durationLoading = false
}) => {
  const { activeMod, modules, markResourceAsViewed: markResourceInContext, recordLastTopic } = useIALabContext();
  const { trackResourceViewed } = useIALabProgress();
  
  // Estado para controlar si se marcó como visto
  const [isMarkedAsViewed, setIsMarkedAsViewed] = useState(false);

  const [isOvaFullscreen, setIsOvaFullscreen] = useState(false);
  
  const modalRef = useRef(null);
  const { isFullscreen: isModalFullscreen, toggleFullscreen: toggleModalFullscreen } = useFullscreen(modalRef);

  // Detener audio y cerrar modal
  const handleClose = () => {
    stopSpeech();
    onClose();
  };

  // Manejar tecla ESC para cerrar o salir de fullscreen OVA
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (isOvaFullscreen) {
          setIsOvaFullscreen(false);
        } else {
          handleClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isOvaFullscreen]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      stopSpeech();
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      stopSpeech();
    };
  }, [isOpen]);

  // Resetear estado de "marcado como visto" cuando cambia el recurso
  useEffect(() => {
    setIsMarkedAsViewed(false);
  }, [resource?.id]);

  // Si no está abierto, no renderizar nada
  if (!isOpen || !resource) {
    return null;
  }

const OVA_COMPONENTS = {
  'gpts-ova-1': OVABuildGPT,
  'chatgpt-ova-ecosystem': OVAEcosystemGuide,
  'intro-ova-1': OVAEtica,
  'prompt-ova-html-1': OVAIntroPrompt,
  'notebooklm-ova-1': OVANotebookLab,
  'notebook-summary-ova-1': OVANotebookSimulator,
  'notebook-audio-guide-1': OVANotebookPodcastGuide,
  'notebook-audio-ova-1': OVAPodcastStudio,
  'bias-ova-1': OVABiasLab,
  'privacy-ova-1': OVARiskSimulator,
};

// Replace the ternary monster line 671
const renderOVAById = (resourceId) => {
  const OVAComponent = OVA_COMPONENTS[resourceId];
  return OVAComponent ? <OVAComponent /> : <OVAChatGPTTools />;
};

  // Renderizar el visualizador apropiado según el tipo de recurso
  const renderViewer = () => {
    if (!resource) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-petroleum/5 rounded-2xl">
          <div className="text-center">
            <Icon name="fa-file-circle-question" className="text-petroleum/50 text-4xl mb-4" />
            <p className="text-petroleum/80 font-medium">No hay recurso seleccionado</p>
          </div>
        </div>
      );
    }

    try {
      switch (resourceType || resource.type) {
        case 'video':
          return <VideoViewer resource={resource} youtubeDuration={youtubeDuration} durationLoading={durationLoading} onVideoEnded={handleAutoComplete} />;
        
        case 'documento':
        case 'document':
          return <DocumentViewer resource={resource} onAutoComplete={handleAutoComplete} />;
        
        case 'imagen':
        case 'image':
          return <ImageViewer resource={resource} onAutoComplete={handleAutoComplete} />;
        
        case 'interactivo':
        case 'interactive':
          return <InteractiveViewer resource={resource} />;
        
        case 'pdf':
        case 'pdf-thumbnail':
          return <PDFThumbnailViewer resource={resource} />;
        
        case 'ova':
        case 'ova-thumbnail':
          return <OVAViewer 
            resource={resource} 
            onClose={onClose}
          />;
        
        case 'ova_interactive':
          return (
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-petroleum/5">
                <div className="text-center">
                  <div className="animate-spin w-10 h-10 border-4 border-petroleum border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-petroleum/80 font-bold">Cargando simulador interactivo...</p>
                </div>
              </div>
            }>
              {renderOVAById(resource.id)}
            </Suspense>
          );
        
        default:
          return (
            <div className="w-full h-full flex items-center justify-center bg-amber-50 rounded-2xl">
              <div className="text-center">
                <Icon name="fa-triangle-exclamation" className="text-amber-500 text-4xl mb-4" />
                <p className="text-amber-700 font-medium">Tipo de recurso no soportado: {resource.type}</p>
              </div>
            </div>
          );
      }
    } catch (error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-2xl">
          <div className="text-center">
            <Icon name="fa-circle-xmark" className="text-red-500 text-4xl mb-4" />
            <p className="text-red-700 font-medium">Error al cargar el recurso</p>
            <p className="text-red-600 text-sm mt-2">{error.message}</p>
          </div>
        </div>
      );
    }
  };

  // Animaciones
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  // Manejar "Marcar como visto"
  const handleMarkAsViewed = async () => {
    setIsMarkedAsViewed(true);
    if (onMarkAsViewed) {
      onMarkAsViewed(resource.id);
    }
    if (resource?.id && activeMod) {
      markResourceInContext(activeMod, resource.id);
      const rt = resource.type || 'document';
      await trackResourceViewed(activeMod, resource.id, rt);

      // Registrar ultimo tema visto para notificaciones de inactividad
      if (recordLastTopic) {
        const typeLabels = {
          video: 'Video',
          infographic: 'Infografia',
          document: 'Documento',
          ova_interactive: 'OVA Interactivo',
          lab: 'Laboratorio',
          reading: 'Lectura',
        };
        recordLastTopic(
          activeMod,
          '',
          resourceType,
          resource.title || `${typeLabels[rt] || 'Recurso'}`,
          resource.id
        );
      }
    }
  };

  // Auto-marcar como visto (para video al terminar, para otros al abrir)
  const handleAutoComplete = () => {
    if (!isMarkedAsViewed) {
      handleMarkAsViewed();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop con blur */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            aria-hidden="true" className="fixed inset-0 z-[200] backdrop-blur-md bg-black/40"
            onClick={handleClose}
          />

              {/* Modal principal - 90% de pantalla */}
              <div className="fixed inset-0 z-[201] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
                <motion.div
                  ref={modalRef}
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  role="dialog" aria-modal="true"
                  className={cn(
                    "w-full max-w-6xl bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl",
                    "pointer-events-auto overflow-hidden",
                    "flex flex-col",
                    "h-[90dvh] max-h-[900px]",
                    "mx-2 sm:mx-4", // Margenes responsive
                    "shadow-xl shadow-petroleum/20"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
              {/* Header del modal */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-petroleum to-corporate backdrop-blur-sm">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                  <div className="bg-white/10 p-2 rounded-lg flex-shrink-0">
                    {(resource.type === 'video') ? <Icon name="fa-video" className="text-white w-5 h-5 sm:w-6 sm:h-6" /> :
                     (resource.type === 'document' || resource.type === 'documento') ? <Icon name="fa-file-lines" className="text-white w-5 h-5 sm:w-6 sm:h-6" /> :
                     (resource.type === 'image' || resource.type === 'imagen') ? <Icon name="fa-image" className="text-white w-5 h-5 sm:w-6 sm:h-6" /> :
                     (resource.type === 'interactive' || resource.type === 'interactivo') ? <Icon name="fa-puzzle-piece" className="text-white w-5 h-5 sm:w-6 sm:h-6" /> :
                     (resource.type === 'pdf' || resource.type === 'pdf-thumbnail') ? <Icon name="fa-file-pdf" className="text-white w-5 h-5 sm:w-6 sm:h-6" /> :
                      (resource.type === 'ova' || resource.type === 'ova-thumbnail' || resource.type === 'ova_interactive') ? <Icon name="fa-brain" className="text-white w-5 h-5 sm:w-6 sm:h-6" /> :
                     <Icon name="fa-file" className="text-white w-5 h-5 sm:w-6 sm:h-6" />}
                  </div>
                  
                  {/* Título y metadatos */}
                  <div className="flex-1 min-w-0">
                    <nav aria-label="Breadcrumb" className="mb-1">
                      <ol className="flex items-center gap-1.5 text-white/60 text-xs">
                        <li className="hidden sm:inline text-white/40">Inicio</li>
                        <li aria-hidden="true" className="hidden sm:inline text-white/30">/</li>
                        <li className="truncate max-w-[120px] sm:max-w-[200px]">
                          {modules?.find(m => m.id === activeMod)?.title || `Módulo ${activeMod}`}
                        </li>
                        <li aria-hidden="true">/</li>
                        <li className="truncate max-w-[100px] sm:max-w-[150px] capitalize">
                          {resource.type?.replace(/_/g, ' ')}
                        </li>
                      </ol>
                    </nav>
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                      {resource.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-3 text-white/80 text-xs sm:text-sm mt-1">
                      {resource.type === 'video' && (
                        <>
                          <span>{durationLoading ? '...' : (youtubeDuration || resource.duration)}</span>
                          <span>•</span>
                        </>
                      )}
                      {resource.format && (
                        <>
                          <span>{resource.format}</span>
                          <span>•</span>
                        </>
                      )}
                      {resource.size && (
                        <>
                          <span>{resource.size}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>Vista previa</span>
                    </div>
                  </div>
                </div>

                {/* Botón de pantalla completa — solo para recursos NO video */}
                {resource.type !== 'video' && (
                  <button
                    onClick={toggleModalFullscreen}
                    className="mt-3 sm:mt-0 ml-0 sm:ml-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white border-none rounded-lg sm:rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start"
                    aria-label={isModalFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                  >
                    <Icon name={isModalFullscreen ? "fa-compress" : "fa-expand"} className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="text-sm sm:text-base text-white">{isModalFullscreen ? "Salir" : "Pantalla completa"}</span>
                  </button>
                )}

                {/* Botón de cerrar */}
                <button
                  onClick={handleClose}
                  className="mt-3 sm:mt-0 ml-0 sm:ml-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white border-none rounded-lg sm:rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start"
                  aria-label="Cerrar visor y volver al tema"
                >
                  <Icon name="fa-times" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-sm sm:text-base text-white">Cerrar</span>
                </button>
              </div>

              {/* Contenido principal del recurso */}
              <div className="flex-1 overflow-auto bg-white dark:bg-slate-800">
                {renderViewer()}
              </div>

              {/* Footer con navegación y acciones */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-petroleum/25 dark:border-petroleum/40 bg-white dark:bg-slate-800">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                  {/* Navegación entre recursos */}
                  {totalResources > 1 && (
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
                      <button
                        onClick={onPreviousResource}
                        disabled={currentIndex <= 0}
                        className={cn(
                          "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors duration-200 text-sm sm:text-base font-medium",
                          currentIndex <= 0
                            ? "text-petroleum/50 cursor-not-allowed"
                            : "bg-white dark:bg-slate-800 border border-petroleum/25 dark:border-petroleum/40 text-petroleum/80 dark:text-petroleum hover:bg-petroleum/5 hover:text-petroleum"
                        )}
                        aria-label="Recurso anterior"
                      >
                        <Icon name="fa-chevron-left" className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Anterior</span>
                      </button>
                      
                      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-petroleum/10 rounded-lg text-petroleum/80 font-medium text-sm sm:text-base">
                        {currentIndex + 1} / {totalResources}
                      </div>
                      
                      <button
                        onClick={onNextResource}
                        disabled={currentIndex >= totalResources - 1}
                        className={cn(
                          "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors duration-200 text-sm sm:text-base font-medium",
                          currentIndex >= totalResources - 1
                            ? "text-petroleum/50 cursor-not-allowed"
                            : "bg-white dark:bg-slate-800 border border-petroleum/25 dark:border-petroleum/40 text-petroleum/80 dark:text-petroleum hover:bg-petroleum/5 hover:text-petroleum"
                        )}
                        aria-label="Siguiente recurso"
                      >
                        <span className="hidden sm:inline">Siguiente</span>
                        <Icon name="fa-chevron-right" className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}

                  {/* Botón "Marcar como visto" */}
                  <button
                    onClick={handleMarkAsViewed}
                    aria-label={isMarkedAsViewed ? "Marcado como visto" : "Marcar como visto"}
                    className={cn(
                      "px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center gap-2 sm:gap-3 text-sm sm:text-base w-full sm:w-auto justify-center border-none",
                      isMarkedAsViewed
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-gradient-to-r from-petroleum to-corporate hover:from-corporate-deep hover:to-corporate-darker text-white shadow-md hover:shadow-lg"
                    )}
                  >
                    {isMarkedAsViewed ? (
                      <>
                        <Icon name="fa-check-circle" className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Marcado como visto</span>
                      </>
                    ) : (
                      <>
                        <Icon name="fa-check" className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Marcar como visto</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Pantalla completa OVA — overlay fixed sin API nativa, con botón Salir visible */}
          {isOvaFullscreen && (
            <div className="fixed inset-0 z-[400] bg-white dark:bg-slate-900 flex flex-col">
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate mr-4">
                  {resource?.title}
                </span>
                <button
                  onClick={() => setIsOvaFullscreen(false)}
                  className="px-5 py-2.5 bg-petroleum hover:bg-petroleum-dark text-white rounded-xl flex items-center gap-2 font-medium transition-colors shadow-md border-none flex-shrink-0"
                  aria-label="Salir de pantalla completa"
                >
                  <Icon name="fa-compress" className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-white dark:bg-slate-800">
                {renderViewer()}
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default ResourceViewerModal;