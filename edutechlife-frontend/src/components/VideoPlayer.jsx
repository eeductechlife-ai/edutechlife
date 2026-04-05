import { useState, useEffect, useRef } from 'react';
import { Icon } from '../utils/iconMapping.jsx';

const VideoPlayer = ({ url, title, autoPlay = false, showControls = true }) => {
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSettings, setShowSettings] = useState(false);
    const [quality, setQuality] = useState('auto');
    const iframeRef = useRef(null);

    // Extraer video ID de URL de YouTube
    const getVideoId = (url) => {
        if (!url) return null;
        
        // Diferentes formatos de URLs de YouTube
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    };

    const videoId = getVideoId(url);
    
    // Construir URL de embed con parámetros
    const buildEmbedUrl = () => {
        if (!videoId) return null;
        
        const params = new URLSearchParams({
            autoplay: autoPlay ? '1' : '0',
            controls: showControls ? '1' : '0',
            modestbranding: '1',
            rel: '0',
            showinfo: '0',
            iv_load_policy: '3',
            enablejsapi: '1',
            origin: window.location.origin
        });
        
        if (!showControls) {
            params.set('controls', '0');
            params.set('disablekb', '1');
        }
        
        return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    };

    const embedUrl = buildEmbedUrl();

    // Manejar eventos del teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch (e.key) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    setIsPlaying(!isPlaying);
                    break;
                case 'm':
                    e.preventDefault();
                    setIsMuted(!isMuted);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    setCurrentTime(prev => Math.min(prev + 5, duration));
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    setCurrentTime(prev => Math.max(prev - 5, 0));
                    break;
                case 'f':
                    e.preventDefault();
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        iframeRef.current?.requestFullscreen?.();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, isMuted, duration]);

    // Formatear tiempo
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calcular progreso
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Si no hay URL, mostrar placeholder
    if (!url || !embedUrl) {
        return (
            <div className="relative bg-gradient-to-br from-[#0A1729] to-[#004B63] rounded-2xl overflow-hidden border border-[#4DA8C4]/20">
                <div className="aspect-video flex flex-col items-center justify-center p-8">
                    <div className="w-20 h-20 mb-4 bg-gradient-to-br from-[#4DA8C4]/20 to-[#66CCCC]/20 rounded-full flex items-center justify-center">
                        <Icon name="fa-video-slash" className="text-3xl text-[#4DA8C4]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Video no disponible</h3>
                    <p className="text-[#B2D8E5] text-center max-w-md">
                        El contenido de video para este módulo estará disponible próximamente.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-gradient-to-br from-[#0A1729] to-[#004B63] rounded-2xl overflow-hidden border border-[#4DA8C4]/20 shadow-2xl">
            {/* Encabezado del video */}
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
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 text-[#B2D8E5] hover:text-white transition-colors"
                            title="Configuración"
                        >
                            <Icon name="fa-cog" />
                        </button>
                        <button
                            onClick={() => iframeRef.current?.requestFullscreen?.()}
                            className="p-2 text-[#B2D8E5] hover:text-white transition-colors"
                            title="Pantalla completa"
                        >
                            <Icon name="fa-expand" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Reproductor de YouTube */}
            <div className="relative aspect-video">
                <iframe
                    ref={iframeRef}
                    src={embedUrl}
                    title={title || 'Video educativo'}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                />
                
                {/* Overlay de controles personalizados */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Indicador de reproducción */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button
                                onClick={() => setIsPlaying(true)}
                                className="pointer-events-auto w-20 h-20 bg-gradient-to-br from-[#4DA8C4] to-[#66CCCC] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
                            >
                                <Icon name="fa-play" className="text-white text-2xl ml-1" />
                            </button>
                        </div>
                    )}
                    
                    {/* Barra de progreso inferior */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
                        <div className="flex items-center gap-4">
                            {/* Botón play/pause */}
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="text-white hover:text-[#66CCCC] transition-colors"
                            >
                                <Icon name={isPlaying ? 'fa-pause' : 'fa-play'} />
                            </button>
                            
                            {/* Tiempo actual */}
                            <span className="text-sm text-white font-mono">
                                {formatTime(currentTime)}
                            </span>
                            
                            {/* Barra de progreso */}
                            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-[#4DA8C4] to-[#66CCCC] rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            
                            {/* Tiempo total */}
                            <span className="text-sm text-white/70 font-mono">
                                {formatTime(duration)}
                            </span>
                            
                            {/* Botón mute */}
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="text-white hover:text-[#66CCCC] transition-colors"
                            >
                                <Icon name={isMuted ? 'fa-volume-mute' : 'fa-volume-up'} />
                            </button>
                            
                            {/* Selector de velocidad */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="text-white hover:text-[#66CCCC] transition-colors text-sm"
                                >
                                    {playbackRate}x
                                </button>
                                
                                {showSettings && (
                                    <div className="absolute bottom-full right-0 mb-2 bg-[#0A1729] border border-[#4DA8C4]/30 rounded-lg p-2 min-w-32 shadow-2xl">
                                        <div className="text-xs text-[#B2D8E5] mb-2">Velocidad</div>
                                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                                            <button
                                                key={speed}
                                                onClick={() => {
                                                    setPlaybackRate(speed);
                                                    setShowSettings(false);
                                                }}
                                                className={`block w-full text-left px-3 py-2 rounded hover:bg-[#004B63] transition-colors ${
                                                    playbackRate === speed 
                                                        ? 'bg-[#004B63] text-white' 
                                                        : 'text-[#B2D8E5]'
                                                }`}
                                            >
                                                {speed}x
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel de información */}
            <div className="p-6 border-t border-[#4DA8C4]/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Atajos de teclado */}
                    <div className="bg-[#0A3550]/30 rounded-xl p-4">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                            <Icon name="fa-keyboard" />
                            Atajos de Teclado
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#B2D8E5]">Espacio / K</span>
                                <span className="text-white">Play/Pause</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#B2D8E5]">M</span>
                                <span className="text-white">Silenciar</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#B2D8E5]">F</span>
                                <span className="text-white">Pantalla completa</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#B2D8E5]">Flechas</span>
                                <span className="text-white">Avanzar/Retroceder</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Información técnica */}
                    <div className="bg-[#0A3550]/30 rounded-xl p-4">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                            <Icon name="fa-info-circle" />
                            Información
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#B2D8E5]">Calidad</span>
                                <span className="text-white">{quality === 'auto' ? 'Auto (HD)' : quality}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#B2D8E5]">Formato</span>
                                <span className="text-white">YouTube Embed</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#B2D8E5]">Subtítulos</span>
                                <span className="text-white">Disponibles (CC)</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Consejos de aprendizaje */}
                    <div className="bg-[#0A3550]/30 rounded-xl p-4">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                            <Icon name="fa-lightbulb" />
                            Consejos
                        </h4>
                        <ul className="space-y-2 text-sm text-[#B2D8E5]">
                            <li className="flex items-start gap-2">
                                <Icon name="fa-check" className="text-[#66CCCC] mt-0.5" />
                                <span>Toma notas durante el video</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Icon name="fa-check" className="text-[#66CCCC] mt-0.5" />
                                <span>Pausa para practicar los conceptos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Icon name="fa-check" className="text-[#66CCCC] mt-0.5" />
                                <span>Usa velocidad 1.25x para repasar</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;