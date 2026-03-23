import { useEffect, useRef } from 'react';

export const useCustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const outlinePos = useRef({ x: -100, y: -100 });
  const dotScaleRef = useRef(1);
  const outlineScaleRef = useRef(1);

  useEffect(() => {
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');

    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';

    // Remove CSS transitions on top/left to avoid layout thrashing
    cursorDot.style.transition = 'width 0.2s, height 0.2s';
    cursorOutline.style.transition = 'width 0.2s, height 0.2s';
    
    // Hardware acceleration base
    cursorDot.style.willChange = 'transform';
    cursorOutline.style.willChange = 'transform';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    cursorDotRef.current = cursorDot;
    cursorOutlineRef.current = cursorOutline;

    document.body.style.cursor = 'none';

    const mouseMoveHandler = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const { x: targetX, y: targetY } = mousePos.current;
        const { x: outlineX, y: outlineY } = outlinePos.current;
        
        const speed = 0.15;
        const newX = outlineX + (targetX - outlineX) * speed;
        const newY = outlineY + (targetY - outlineY) * speed;
        
        outlinePos.current = { x: newX, y: newY };
        
        if (cursorDotRef.current) {
          cursorDotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(${dotScaleRef.current})`;
        }
        if (cursorOutlineRef.current) {
          cursorOutlineRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0) scale(${outlineScaleRef.current})`;
        }
      }
      
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', mouseMoveHandler, { passive: true });

    const handleMouseDown = () => {
      dotScaleRef.current = 0.8;
      outlineScaleRef.current = 1.2;
    };

    const handleMouseUp = () => {
      dotScaleRef.current = 1;
      outlineScaleRef.current = 1;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      if (cursorDotRef.current && document.body.contains(cursorDotRef.current)) {
        document.body.removeChild(cursorDotRef.current);
      }
      if (cursorOutlineRef.current && document.body.contains(cursorOutlineRef.current)) {
        document.body.removeChild(cursorOutlineRef.current);
      }
      
      document.body.style.cursor = 'auto';
    };
  }, []);

  return null;
};