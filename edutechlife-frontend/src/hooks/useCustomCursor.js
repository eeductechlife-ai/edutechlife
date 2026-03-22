import { useEffect, useRef } from 'react';

export const useCustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);

  useEffect(() => {
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');

    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    cursorDotRef.current = cursorDot;
    cursorOutlineRef.current = cursorOutline;

    document.body.style.cursor = 'none';

    const mouseMoveHandler = (e) => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        
        if (cursorOutlineRef.current && cursorDotRef.current) {
          const outlineRect = cursorOutlineRef.current.getBoundingClientRect();
          const dotRect = cursorDotRef.current.getBoundingClientRect();
          
          const outlineX = parseFloat(cursorOutlineRef.current.style.left || 0);
          const outlineY = parseFloat(cursorOutlineRef.current.style.top || 0);
          const targetX = parseFloat(cursorDotRef.current.style.left || 0);
          const targetY = parseFloat(cursorDotRef.current.style.top || 0);
          
          const dx = targetX - outlineX;
          const dy = targetY - outlineY;
          
          const speed = 0.15;
          const newX = outlineX + dx * speed;
          const newY = outlineY + dy * speed;
          
          cursorOutlineRef.current.style.left = `${newX}px`;
          cursorOutlineRef.current.style.top = `${newY}px`;
        }
      }
      
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', mouseMoveHandler);

    const handleMouseDown = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = 'scale(0.8)';
      }
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.transform = 'scale(1.2)';
      }
    };

    const handleMouseUp = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = 'scale(1)';
      }
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.transform = 'scale(1)';
      }
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