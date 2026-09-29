import { useEffect, useRef } from "react";

// Paleta de marca: petróleo, turquesa, menta, azul claro.
const COLORS = ["0,75,99", "0,151,167", "102,204,204", "77,168,196"];
const INTRO_MS = 1800;

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Constelación "Nueva Era": partículas que nacen de un punto, se expanden
 * en una red neuronal y reaccionan al cursor. Canvas 2D, sin dependencias.
 * Se detiene cuando `running` es false; con reduced motion dibuja un solo frame.
 */
export const HeroConstellation = ({ running, reducedMotion }) => {
  const canvasRef = useRef(null);
  const runningRef = useRef(running);
  const loopRef = useRef(null);

  useEffect(() => {
    runningRef.current = running;
    if (running) loopRef.current?.();
  }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window.matchMedia !== "function") return undefined;
    let ctx;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      return undefined;
    }
    if (!ctx) return undefined;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const count = mobile ? 42 : 110;
    const linkDist = mobile ? 90 : 135;
    const pointer = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    let particles = [];
    let raf = null;
    let start = performance.now();

    const seed = () => {
      const origin = mobile
        ? { x: w * 0.5, y: h * 0.3 }
        : { x: w * 0.7, y: h * 0.45 };
      particles = Array.from({ length: count }, (_, i) => ({
        ox: origin.x,
        oy: origin.y,
        x: origin.x,
        y: origin.y,
        tx: Math.random() * w,
        ty: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1 + Math.random() * 1.8,
        c: COLORS[i % COLORS.length],
      }));
      start = performance.now();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const widthChanged = Math.abs(rect.width - w) > 40;
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Solo re-sembrar si cambia el ancho (evita reiniciar con la barra móvil).
      if (widthChanged || particles.length === 0) seed();
      if (reducedMotion) draw(performance.now());
    };

    const draw = (now) => {
      const intro = reducedMotion
        ? 1
        : easeOut(Math.min((now - start) / INTRO_MS, 1));
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (intro >= 1 && !reducedMotion) {
          p.tx += p.vx;
          p.ty += p.vy;
          if (p.tx < 0 || p.tx > w) p.vx *= -1;
          if (p.ty < 0 || p.ty > h) p.vy *= -1;
        }
        let x = p.ox + (p.tx - p.ox) * intro;
        let y = p.oy + (p.ty - p.oy) * intro;
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        const d = Math.hypot(dx, dy);
        if (d < 170) {
          x += dx * 0.12 * (1 - d / 170);
          y += dy * 0.12 * (1 - d / 170);
        }
        p.x = x;
        p.y = y;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            ctx.strokeStyle = `rgba(0,151,167,${(1 - d / linkDist) * 0.28})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const dp = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (dp < 170) {
          ctx.strokeStyle = `rgba(0,75,99,${(1 - dp / 170) * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.fillStyle = `rgba(${p.c},0.75)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (raf !== null) return;
      const tick = (now) => {
        if (!runningRef.current) {
          raf = null;
          return;
        }
        draw(now);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    loopRef.current = reducedMotion ? null : loop;

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    if (reducedMotion) draw(performance.now());
    else if (runningRef.current) loop();

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);
    if (!mobile) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      loopRef.current = null;
      ro?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-80 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_85%,transparent)] lg:[mask-image:linear-gradient(to_right,transparent_5%,black_50%)]"
    />
  );
};
