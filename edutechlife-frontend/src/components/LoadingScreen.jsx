import { useState, useEffect, useMemo } from 'react';

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

    const fallingBalls = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 2 + Math.random() * 2,
            size: 8 + Math.random() * 16,
            color: i % 3 === 0 ? '#1B9EBA' : i % 3 === 1 ? '#0A3044' : '#B8E6F0'
        }));
    }, []);

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
                }, 600);
                return () => clearTimeout(completeTimer);
            }, 400);
            return () => clearTimeout(exitTimer);
        }
    }, [progress, onComplete]);

    return (
        <div className={`loading-screen ${isExiting ? 'exiting' : ''}`}>
            {/* Falling Balls 3D Effect */}
            <div className="falling-balls-container">
                {fallingBalls.map((ball) => (
                    <div
                        key={ball.id}
                        className="falling-ball"
                        style={{
                            left: `${ball.left}%`,
                            animationDelay: `${ball.delay}s`,
                            animationDuration: `${ball.duration}s`,
                            width: `${ball.size}px`,
                            height: `${ball.size}px`,
                            background: `radial-gradient(circle at 30% 30%, ${ball.color}, ${ball.color}88)`,
                            boxShadow: `inset -3px -3px 6px rgba(0,0,0,0.2), 0 4px 8px ${ball.color}40`
                        }}
                    />
                ))}
            </div>

            <div className="loading-content">
                <div className="loading-brand">
                    <div className="brand-logo">
                        <img 
                            src="/images/logo-edutechlife.webp" 
                            alt="Edutechlife" 
                            className="logo-img"
                        />
                    </div>
                    <span className="brand-tagline">Transformando la educación con IA</span>
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
                    <div className="feature-item">
                        <i className="fa-solid fa-brain" />
                        <span>IA Integrada</span>
                    </div>
                    <div className="feature-item">
                        <i className="fa-solid fa-users" />
                        <span>VAK Metodología</span>
                    </div>
                    <div className="feature-item">
                        <i className="fa-solid fa-certificate" />
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
