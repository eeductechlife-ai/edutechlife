import { useState, useEffect } from 'react';
import FloatingParticles from './FloatingParticles';

const LoadingScreen = ({ onComplete, minDuration = 2500 }) => {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('Inicializando...');
    const [isExiting, setIsExiting] = useState(false);

    const loadingSteps = [
        { progress: 15, text: 'Conectando con servidores...' },
        { progress: 30, text: 'Cargando módulo de IA...' },
        { progress: 45, text: 'Inicializando Valerio...' },
        { progress: 60, text: 'Configurando entorno VAK...' },
        { progress: 75, text: 'Preparando recursos educativos...' },
        { progress: 90, text: 'Sincronizando datos...' },
        { progress: 100, text: '¡Listo!' },
    ];

    useEffect(() => {
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < loadingSteps.length) {
                setProgress(loadingSteps[currentStep].progress);
                setStatusText(loadingSteps[currentStep].text);
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, minDuration / loadingSteps.length);

        return () => clearInterval(interval);
    }, [minDuration]);

    useEffect(() => {
        if (progress >= 100) {
            const exitTimer = setTimeout(() => {
                setIsExiting(true);
                const completeTimer = setTimeout(() => {
                    if (onComplete) onComplete();
                }, 400);
                return () => clearTimeout(completeTimer);
            }, 200);
            return () => clearTimeout(exitTimer);
        }
    }, [progress, onComplete]);

    return (
        <div className={`loading-screen ${isExiting ? 'exiting' : ''}`}>
            {/* Floating Particles - Enhanced 3D */}
            <FloatingParticles count={55} className="z-1" />

            {/* Additional 3D Floating Elements - Corporate colors only */}
            <div className="absolute top-[20%] left-[10%] w-4 h-4 bg-[#4DA8C4]/20 rounded-full animate-[float-3d_6s_ease-in-out_infinite]" style={{ animationDelay: '-2s' }} />
            <div className="absolute top-[60%] right-[15%] w-3 h-3 bg-[#66CCCC]/25 rounded-full animate-[float-3d_8s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }} />
            <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-[#B2D8E5]/20 rounded-full animate-[float-3d_7s_ease-in-out_infinite]" style={{ animationDelay: '-1s' }} />
            <div className="absolute top-[40%] left-[25%] w-3 h-3 bg-[#4DA8C4]/15 rounded-full animate-[float-3d_9s_ease-in-out_infinite]" style={{ animationDelay: '-3s' }} />
            <div className="absolute top-[25%] right-[30%] w-2 h-2 bg-[#66CCCC]/20 rounded-full animate-[float-3d_6s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />

            <div className="loading-content">
                <div className="loading-brand">
                    <div className="brand-logo">
                        <img 
                            src="/images/logo-edutechlife.webp" 
                            alt="Edutechlife" 
                            className="logo-img"
                        />
                    </div>
                </div>

                <div className="loading-progress">
                    <div className="progress-bar-container">
                        <div 
                            className="progress-bar-fill"
                            style={{ width: `${progress}%` }}
                        />
                        <div className="progress-bar-glow" style={{ left: `${progress}%` }} />
                    </div>
                    <div className="progress-percentage">{progress}%</div>
                </div>

                <div className="loading-status">
                    <div className="status-icon">
                        {progress < 100 ? (
                            <div className="status-dots">
                                <span className="dot" />
                                <span className="dot" />
                                <span className="dot" />
                            </div>
                        ) : (
                            <i className="fa-solid fa-check" />
                        )}
                    </div>
                    <span className="status-text">{statusText}</span>
                </div>

                <div className="loading-features">
                    <div className="feature-item premium">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, rgba(0, 75, 99, 0.1) 0%, rgba(77, 168, 196, 0.15) 100%)', border: '1px solid rgba(0, 75, 99, 0.2)' }}>
                            <i className="fa-solid fa-robot" style={{ color: '#004B63' }} />
                        </div>
                        <span>IA Integrada</span>
                    </div>
                    <div className="feature-item premium">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, rgba(0, 75, 99, 0.1) 0%, rgba(77, 168, 196, 0.15) 100%)', border: '1px solid rgba(0, 75, 99, 0.2)' }}>
                            <i className="fa-solid fa-brain" style={{ color: '#004B63' }} />
                        </div>
                        <span>VAK Metodología</span>
                    </div>
                    <div className="feature-item premium">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, rgba(0, 75, 99, 0.1) 0%, rgba(77, 168, 196, 0.15) 100%)', border: '1px solid rgba(0, 75, 99, 0.2)' }}>
                            <i className="fa-solid fa-award" style={{ color: '#004B63' }} />
                        </div>
                        <span>Certificaciones</span>
                    </div>
                </div>
            </div>

            <div className="loading-bg">
                <div className="bg-orb orb-1" />
                <div className="bg-orb orb-2" />
                <div className="bg-orb orb-3" />
                <div className="bg-grid" />
            </div>
        </div>
    );
};

const MiniLoader = ({ size = 'md', color = 'primary' }) => {
    const sizeClass = `loader-${size}`;
    const colorClass = `loader-${color}`;
    
    return (
        <div className={`mini-loader ${sizeClass} ${colorClass}`}>
            <div className="loader-bars">
                <span /><span /><span /><span /><span />
            </div>
        </div>
    );
};

const PageLoader = ({ message = 'Cargando...' }) => {
    return (
        <div className="page-loader">
            <div className="page-loader-content">
                <div className="loader-spinner">
                    <div className="spinner-ring" />
                    <div className="spinner-ring ring-2" />
                    <div className="spinner-core">
                        <i className="fa-solid fa-graduation-cap" />
                    </div>
                </div>
                <span className="loader-message">{message}</span>
            </div>
        </div>
    );
};

const SkeletonLoader = ({ type = 'text', lines = 3 }) => {
    const renderSkeleton = () => {
        switch(type) {
            case 'card':
                return (
                    <div className="skeleton-card">
                        <div className="skeleton-image" />
                        <div className="skeleton-content">
                            <div className="skeleton-line title" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line short" />
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="skeleton-profile">
                        <div className="skeleton-avatar" />
                        <div className="skeleton-info">
                            <div className="skeleton-line title" />
                            <div className="skeleton-line short" />
                        </div>
                    </div>
                );
            case 'hero':
                return (
                    <div className="skeleton-hero">
                        <div className="skeleton-badge" />
                        <div className="skeleton-line title-lg" />
                        <div className="skeleton-line title-lg short" />
                        <div className="skeleton-line" />
                        <div className="skeleton-line" />
                        <div className="skeleton-buttons">
                            <div className="skeleton-btn" />
                            <div className="skeleton-btn secondary" />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="skeleton-text">
                        {Array.from({ length: lines }).map((_, i) => (
                            <div 
                                key={i} 
                                className={`skeleton-line ${i === lines - 1 ? 'short' : ''}`}
                            />
                        ))}
                    </div>
                );
        }
    };

    return renderSkeleton();
};

export { LoadingScreen, MiniLoader, PageLoader, SkeletonLoader };
export default LoadingScreen;
