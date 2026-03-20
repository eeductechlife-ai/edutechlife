import { useEffect, useRef } from 'react';

const ValerioAvatar = ({ state = 'idle', size = 80 }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = size / 2;
        const centerY = size / 2;
        let time = 0;

        const draw = () => {
            ctx.clearRect(0, 0, size, size);
            time += 0.05;

            if (state === 'listening') {
                drawListening(ctx, centerX, centerY, time);
            } else if (state === 'thinking') {
                drawThinking(ctx, centerX, centerY, time);
            } else if (state === 'speaking') {
                drawSpeaking(ctx, centerX, centerY, time);
            } else {
                drawIdle(ctx, centerX, centerY);
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [state, size]);

    const drawIdle = (ctx, cx, cy) => {
        const gradient = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, size * 0.4);
        gradient.addColorStop(0, '#4DA8C4');
        gradient.addColorStop(1, '#004B63');
        
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(cx, cy - size * 0.08, size * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
    };

    const drawListening = (ctx, cx, cy, time) => {
        for (let i = 3; i >= 0; i--) {
            const pulseScale = 1 + Math.sin(time * 3 + i * 0.8) * 0.15;
            const radius = size * 0.35 * pulseScale + i * 8;
            const alpha = 0.3 - i * 0.08;
            
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        const gradient = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, size * 0.35);
        gradient.addColorStop(0, '#10B981');
        gradient.addColorStop(0.7, '#059669');
        gradient.addColorStop(1, '#047857');
        
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        const eyeY = cy - size * 0.05;
        const eyeSpacing = size * 0.1;
        
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.05, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
    };

    const drawThinking = (ctx, cx, cy, time) => {
        for (let i = 0; i < 3; i++) {
            const breathe = Math.sin(time * 1.5 + i * 1.2) * 0.1 + 1;
            const dotY = cy - size * 0.45 - i * 12 - 5;
            const dotX = cx + (i - 1) * 12;
            
            ctx.beginPath();
            ctx.arc(dotX, dotY, 4 * breathe, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${0.6 + i * 0.15})`;
            ctx.fill();
        }

        const gradient = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, size * 0.35);
        gradient.addColorStop(0, '#8B5CF6');
        gradient.addColorStop(0.7, '#7C3AED');
        gradient.addColorStop(1, '#6D28D9');
        
        const breatheScale = Math.sin(time * 2) * 0.03 + 1;
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35 * breatheScale, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy - size * 0.08, size * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
    };

    const drawSpeaking = (ctx, cx, cy, time) => {
        const waveCount = 4;
        for (let i = 0; i < waveCount; i++) {
            const angle = (i / waveCount) * Math.PI * 2;
            const distance = size * 0.55 + Math.sin(time * 4 + i) * 8;
            const waveX = cx + Math.cos(angle + time * 0.5) * distance;
            const waveY = cy + Math.sin(angle + time * 0.5) * distance;
            const waveSize = 3 + Math.sin(time * 3 + i) * 2;

            ctx.beginPath();
            ctx.arc(waveX, waveY, waveSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(77, 168, 196, ${0.4 + Math.sin(time * 2 + i) * 0.2})`;
            ctx.fill();
        }

        for (let i = 0; i < 3; i++) {
            const arcRadius = size * 0.5 + i * 15;
            const arcStart = -Math.PI / 3 + Math.sin(time * 2 + i) * 0.2;
            const arcEnd = Math.PI / 3 - Math.sin(time * 2 + i) * 0.2;
            
            ctx.beginPath();
            ctx.arc(cx, cy, arcRadius, arcStart, arcEnd);
            ctx.strokeStyle = `rgba(77, 168, 196, ${0.3 - i * 0.08})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        const gradient = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, size * 0.35);
        gradient.addColorStop(0, '#4DA8C4');
        gradient.addColorStop(0.7, '#0EA5E9');
        gradient.addColorStop(1, '#0284C7');
        
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        const mouthWidth = size * 0.15 + Math.sin(time * 8) * size * 0.03;
        ctx.beginPath();
        ctx.ellipse(cx, cy + size * 0.05, mouthWidth, size * 0.06, 0, 0, Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
    };

    const getStatusLabel = () => {
        switch (state) {
            case 'listening': return 'Escuchando...';
            case 'thinking': return 'Pensando...';
            case 'speaking': return 'Hablando...';
            default: return 'Listo para ayudarte';
        }
    };

    const getStatusColor = () => {
        switch (state) {
            case 'listening': return '#10B981';
            case 'thinking': return '#8B5CF6';
            case 'speaking': return '#0EA5E9';
            default: return '#4DA8C4';
        }
    };

    return (
        <div className="valerio-avatar-container">
            <canvas 
                ref={canvasRef}
                width={size}
                height={size}
                className="valerio-canvas"
            />
            <div 
                className="valerio-status"
                style={{ 
                    background: `${getStatusColor()}20`,
                    borderColor: `${getStatusColor()}40`,
                    color: getStatusColor()
                }}
            >
                <span className={`status-dot ${state}`} style={{ background: getStatusColor() }} />
                {getStatusLabel()}
            </div>
        </div>
    );
};

export default ValerioAvatar;
