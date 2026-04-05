import { useEffect, useRef } from 'react';

const ValentinaAvatar = ({ state = 'idle', expression = 'neutral', size = 80 }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Validar que size sea un número finito
        if (!Number.isFinite(size) || size <= 0) {
            console.warn('ValentinaAvatar: size inválido', size);
            return;
        }

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
                // Usar expresión específica para estado idle
                if (expression === 'happy') {
                    drawHappy(ctx, centerX, centerY, time);
                } else if (expression === 'encouraging') {
                    drawEncouraging(ctx, centerX, centerY, time);
                } else if (expression === 'surprised') {
                    drawSurprised(ctx, centerX, centerY, time);
                } else if (expression === 'concerned') {
                    drawConcerned(ctx, centerX, centerY, time);
                } else {
                    drawIdle(ctx, centerX, centerY);
                }
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [state, expression, size]);

    // Colores corporativos de EdutechLife
    const COLORS = {
        // Azul Corporativo (#4DA8C4) - Color principal
        corporate: {
            primary: '#4DA8C4',
            light: '#7CC4D9',
            dark: '#2D7A94'
        },
        // Azul Petróleo (#004B63) - Para detalles
        petroleum: {
            primary: '#004B63',
            light: '#2D7A94',
            dark: '#002A3A'
        },
        // Menta (#66CCCC) - Para acentos
        mint: {
            primary: '#66CCCC',
            light: '#8EDEDE',
            dark: '#4DB3B3'
        },
        // Rosa Kinestésico (#FF6B9D) - Para expresiones
        kinesthetic: {
            primary: '#FF6B9D',
            light: '#FF9AC0',
            dark: '#FF3D7A'
        }
    };

    const drawIdle = (ctx, cx, cy) => {
        // Validar parámetros
        if (!Number.isFinite(cx) || !Number.isFinite(cy) || !Number.isFinite(size)) {
            return;
        }

        // Gradiente corporativo principal
        const gradient = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, size * 0.4);
        gradient.addColorStop(0, COLORS.corporate.primary);  // #4DA8C4
        gradient.addColorStop(1, COLORS.petroleum.primary);  // #004B63
        
        // Cabeza
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Cabello (estilo profesional femenino)
        ctx.beginPath();
        ctx.ellipse(cx, cy - size * 0.15, size * 0.3, size * 0.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.petroleum.dark;
        ctx.fill();
        
        // Ojos (expresión amigable)
        const eyeY = cy - size * 0.08;
        const eyeSpacing = size * 0.1;
        
        // Ojo izquierdo
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
        
        // Pupila izquierda
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.02, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.petroleum.primary;
        ctx.fill();
        
        // Ojo derecho
        ctx.beginPath();
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
        
        // Pupila derecha
        ctx.beginPath();
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.02, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.petroleum.primary;
        ctx.fill();
        
        // Sonrisa amigable
        ctx.beginPath();
        ctx.arc(cx, cy + size * 0.05, size * 0.08, 0, Math.PI);
        ctx.strokeStyle = COLORS.mint.primary;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Lentes (opcional, estilo profesional)
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.07, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.07, 0, Math.PI * 2);
        ctx.strokeStyle = COLORS.corporate.light;
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    const drawListening = (ctx, cx, cy, time) => {
        // Ondas de escucha (color menta)
        for (let i = 3; i >= 0; i--) {
            const pulseScale = 1 + Math.sin(time * 3 + i * 0.8) * 0.15;
            const radius = size * 0.35 * pulseScale + i * 8;
            const alpha = 0.3 - i * 0.08;
            
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(102, 204, 204, ${alpha})`; // #66CCCC
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Cabeza con gradiente auditivo
        const gradient = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, size * 0.35);
        gradient.addColorStop(0, COLORS.mint.primary);   // #66CCCC
        gradient.addColorStop(0.7, '#4DB3B3');
        gradient.addColorStop(1, '#339999');
        
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Ojos atentos
        const eyeY = cy - size * 0.05;
        const eyeSpacing = size * 0.1;
        
        // Ojos más abiertos (escuchando)
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.06, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.06, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
        
        // Pupilas (mirando hacia el usuario)
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.025, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.025, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.petroleum.primary;
        ctx.fill();
        
        // Oreja (símbolo de escucha)
        ctx.beginPath();
        ctx.arc(cx + size * 0.25, cy, size * 0.08, 0, Math.PI * 2);
        ctx.strokeStyle = COLORS.mint.primary;
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    const drawThinking = (ctx, cx, cy, time) => {
        // Partículas de pensamiento (color azul info)
        for (let i = 0; i < 3; i++) {
            const breathe = Math.sin(time * 1.5 + i * 1.2) * 0.1 + 1;
            const dotY = cy - size * 0.45 - i * 12 - 5;
            const dotX = cx + (i - 1) * 12;
            
            ctx.beginPath();
            ctx.arc(dotX, dotY, 4 * breathe, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59, 130, 246, ${0.6 + i * 0.15})`; // #3B82F6
            ctx.fill();
        }

        // Cabeza con gradiente pensante
        const gradient = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, size * 0.35);
        gradient.addColorStop(0, '#3B82F6');   // Azul info
        gradient.addColorStop(0.7, '#2563EB');
        gradient.addColorStop(1, '#1D4ED8');
        
        const breatheScale = Math.sin(time * 2) * 0.03 + 1;
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35 * breatheScale, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Ojos pensativos (mirando hacia arriba)
        const eyeY = cy - size * 0.08;
        const eyeSpacing = size * 0.1;
        
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY - 2, size * 0.05, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY - 2, size * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
        
        // Pupilas (mirando hacia arriba)
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY - 4, size * 0.02, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY - 4, size * 0.02, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.petroleum.primary;
        ctx.fill();
        
        // Ceño fruncido (pensando)
        ctx.beginPath();
        ctx.moveTo(cx - size * 0.15, eyeY - size * 0.05);
        ctx.lineTo(cx + size * 0.15, eyeY - size * 0.05);
        ctx.strokeStyle = COLORS.corporate.dark;
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    const drawSpeaking = (ctx, cx, cy, time) => {
        // Ondas de voz (color corporativo)
        const waveCount = 4;
        for (let i = 0; i < waveCount; i++) {
            const angle = (i / waveCount) * Math.PI * 2;
            const distance = size * 0.55 + Math.sin(time * 4 + i) * 8;
            const waveX = cx + Math.cos(angle + time * 0.5) * distance;
            const waveY = cy + Math.sin(angle + time * 0.5) * distance;
            const waveSize = 3 + Math.sin(time * 3 + i) * 2;

            ctx.beginPath();
            ctx.arc(waveX, waveY, waveSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(77, 168, 196, ${0.4 + Math.sin(time * 2 + i) * 0.2})`; // #4DA8C4
            ctx.fill();
        }

        // Arcos de voz
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

        // Cabeza con gradiente de habla
        const gradient = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, size * 0.35);
        gradient.addColorStop(0, COLORS.corporate.primary);   // #4DA8C4
        gradient.addColorStop(0.7, '#0EA5E9');
        gradient.addColorStop(1, '#0284C7');
        
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Boca animada (hablando)
        const mouthWidth = size * 0.15 + Math.sin(time * 8) * size * 0.03;
        const mouthHeight = size * 0.06 + Math.sin(time * 8) * size * 0.02;
        
        ctx.beginPath();
        ctx.ellipse(cx, cy + size * 0.05, mouthWidth, mouthHeight, 0, 0, Math.PI);
        ctx.fillStyle = COLORS.kinesthetic.primary; // Rosa para contraste
        ctx.fill();
        
        // Ojos expresivos (hablando)
        const eyeY = cy - size * 0.08;
        const eyeSpacing = size * 0.1;
        
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.05, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        
        // Pupilas
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.02, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.02, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.petroleum.primary;
        ctx.fill();
    };

    const drawHappy = (ctx, cx, cy, time) => {
        // Cabeza con gradiente feliz
        const gradient = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, size * 0.35);
        gradient.addColorStop(0, COLORS.mint.primary);   // #66CCCC
        gradient.addColorStop(0.7, '#4DB3B3');
        gradient.addColorStop(1, '#339999');
        
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Ojos felices (entrecerrados)
        const eyeY = cy - size * 0.08;
        const eyeSpacing = size * 0.1;
        
        // Ojo izquierdo (entrecerrado)
        ctx.beginPath();
        ctx.moveTo(cx - eyeSpacing - size * 0.04, eyeY);
        ctx.bezierCurveTo(
            cx - eyeSpacing - size * 0.02, eyeY - size * 0.02,
            cx - eyeSpacing + size * 0.02, eyeY - size * 0.02,
            cx - eyeSpacing + size * 0.04, eyeY
        );
        ctx.strokeStyle = COLORS.petroleum.primary;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Ojo derecho (entrecerrado)
        ctx.beginPath();
        ctx.moveTo(cx + eyeSpacing - size * 0.04, eyeY);
        ctx.bezierCurveTo(
            cx + eyeSpacing - size * 0.02, eyeY - size * 0.02,
            cx + eyeSpacing + size * 0.02, eyeY - size * 0.02,
            cx + eyeSpacing + size * 0.04, eyeY
        );
        ctx.strokeStyle = COLORS.petroleum.primary;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Sonrisa amplia
        ctx.beginPath();
        ctx.arc(cx, cy + size * 0.08, size * 0.12, 0.2, Math.PI - 0.2);
        ctx.strokeStyle = COLORS.kinesthetic.primary;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Partículas de felicidad
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + time * 0.5;
            const distance = size * 0.5;
            const particleX = cx + Math.cos(angle) * distance;
            const particleY = cy + Math.sin(angle) * distance;
            const particleSize = 2 + Math.sin(time * 3 + i) * 1;
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 107, 157, ${0.5 + Math.sin(time * 2 + i) * 0.3})`; // #FF6B9D
            ctx.fill();
        }
    };

    const drawEncouraging = (ctx, cx, cy, time) => {
        // Cabeza con gradiente de apoyo
        const gradient = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, size * 0.35);
        gradient.addColorStop(0, '#4DA8C4');   // #4DA8C4
        gradient.addColorStop(0.7, '#3B82F6');
        gradient.addColorStop(1, '#2563EB');
        
        const breatheScale = Math.sin(time * 1.5) * 0.02 + 1;
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35 * breatheScale, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Ojos cálidos y alentadores
        const eyeY = cy - size * 0.08;
        const eyeSpacing = size * 0.1;
        
        // Ojos con brillo
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.06, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.06, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
        
        // Pupilas con destello
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.025, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.025, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.petroleum.primary;
        ctx.fill();
        
        // Destello en los ojos
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing - size * 0.015, eyeY - size * 0.015, size * 0.01, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing - size * 0.015, eyeY - size * 0.015, size * 0.01, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        
        // Sonrisa alentadora
        ctx.beginPath();
        ctx.arc(cx, cy + size * 0.05, size * 0.1, 0.1, Math.PI - 0.1);
        ctx.strokeStyle = COLORS.mint.primary;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Mano dando pulgar arriba (símbolo de apoyo)
        const handX = cx + size * 0.3;
        const handY = cy;
        
        // Base de la mano
        ctx.beginPath();
        ctx.arc(handX, handY, size * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.corporate.light;
        ctx.fill();
        
        // Pulgar
        ctx.beginPath();
        ctx.ellipse(handX + size * 0.05, handY - size * 0.1, size * 0.04, size * 0.06, Math.PI/4, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.corporate.primary;
        ctx.fill();
    };

    const drawSurprised = (ctx, cx, cy, time) => {
        // Cabeza con gradiente de sorpresa
        const gradient = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, size * 0.35);
        gradient.addColorStop(0, '#FF6B9D');   // Rosa kinestésico
        gradient.addColorStop(0.7, '#FF9AC0');
        gradient.addColorStop(1, '#FF3D7A');
        
        const pulseScale = Math.sin(time * 4) * 0.05 + 1;
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Ojos muy abiertos (sorpresa)
        const eyeY = cy - size * 0.1;
        const eyeSpacing = size * 0.12;
        
        // Ojos grandes
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.08, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
        ctx.fill();
        
        // Pupilas pequeñas (sorpresa)
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.015, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.015, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.petroleum.primary;
        ctx.fill();
        
        // Boca en "O" de sorpresa
        ctx.beginPath();
        ctx.arc(cx, cy + size * 0.1, size * 0.06, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.corporate.primary;
        ctx.fill();
        
        // Líneas de sorpresa alrededor
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const startX = cx + Math.cos(angle) * size * 0.4;
            const startY = cy + Math.sin(angle) * size * 0.4;
            const endX = cx + Math.cos(angle) * (size * 0.5 + Math.sin(time * 3 + i) * 5);
            const endY = cy + Math.sin(angle) * (size * 0.5 + Math.sin(time * 3 + i) * 5);
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = `rgba(255, 107, 157, ${0.4 + Math.sin(time * 2 + i) * 0.2})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    };

    const drawConcerned = (ctx, cx, cy, time) => {
        // Cabeza con gradiente de preocupación
        const gradient = ctx.createRadialGradient(cx, cy - 5, 0, cx, cy, size * 0.35);
        gradient.addColorStop(0, '#64748B');   // Gris azulado
        gradient.addColorStop(0.7, '#475569');
        gradient.addColorStop(1, '#334155');
        
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Ojos preocupados (ligeramente entrecerrados)
        const eyeY = cy - size * 0.07;
        const eyeSpacing = size * 0.1;
        
        // Ojos
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY, size * 0.05, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY, size * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();
        
        // Pupilas (mirando hacia abajo)
        ctx.beginPath();
        ctx.arc(cx - eyeSpacing, eyeY + size * 0.015, size * 0.02, 0, Math.PI * 2);
        ctx.arc(cx + eyeSpacing, eyeY + size * 0.015, size * 0.02, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.petroleum.primary;
        ctx.fill();
        
        // Ceño fruncido
        ctx.beginPath();
        ctx.moveTo(cx - size * 0.12, eyeY - size * 0.05);
        ctx.quadraticCurveTo(cx, eyeY - size * 0.08, cx + size * 0.12, eyeY - size * 0.05);
        ctx.strokeStyle = COLORS.corporate.dark;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Boca preocupada (ligeramente hacia abajo)
        ctx.beginPath();
        ctx.moveTo(cx - size * 0.08, cy + size * 0.05);
        ctx.quadraticCurveTo(cx, cy + size * 0.03, cx + size * 0.08, cy + size * 0.05);
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Líneas de preocupación
        for (let i = 0; i < 3; i++) {
            const lineY = cy + size * 0.2 + i * 3;
            const lineLength = size * 0.15 + Math.sin(time * 1 + i) * 2;
            
            ctx.beginPath();
            ctx.moveTo(cx - lineLength, lineY);
            ctx.lineTo(cx + lineLength, lineY);
            ctx.strokeStyle = `rgba(100, 116, 139, ${0.3 + i * 0.1})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    };

    const getStatusLabel = () => {
        switch (state) {
            case 'listening': return 'Escuchando...';
            case 'thinking': return 'Pensando...';
            case 'speaking': return 'Hablando...';
            default: 
                switch (expression) {
                    case 'happy': return '¡Feliz!';
                    case 'encouraging': return 'Apoyándote';
                    case 'surprised': return '¡Sorprendida!';
                    case 'concerned': return 'Preocupada';
                    default: return 'Valentina - Psicóloga VAK';
                }
        }
    };

    const getStatusColor = () => {
        switch (state) {
            case 'listening': return COLORS.mint.primary;      // #66CCCC
            case 'thinking': return '#3B82F6';                // Azul info
            case 'speaking': return COLORS.corporate.primary; // #4DA8C4
            default: 
                switch (expression) {
                    case 'happy': return COLORS.mint.primary;      // #66CCCC
                    case 'encouraging': return '#4DA8C4';         // Azul corporativo
                    case 'surprised': return '#FF6B9D';           // Rosa kinestésico
                    case 'concerned': return '#64748B';           // Gris azulado
                    default: return COLORS.corporate.primary;     // #4DA8C4
                }
        }
    };

    return (
        <div className="valentina-avatar-container">
            <canvas 
                ref={canvasRef}
                width={size}
                height={size}
                className="valentina-canvas valentina-avatar-float"
                aria-label={`Avatar de Valentina - ${getStatusLabel()}`}
            />
            <div 
                className="valentina-status"
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

export default ValentinaAvatar;