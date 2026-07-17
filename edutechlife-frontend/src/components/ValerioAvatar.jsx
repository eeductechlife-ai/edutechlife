import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { speakTextConversational, stopSpeech } from '../utils/speech'
import { cleanTextForTTS } from '../utils/textCleaner'

const STATE_COLORS = {
  idle: { r: '0,75,99' },
  listening: { r: '16,185,129' },
  thinking: { r: '139,92,246' },
  speaking: { r: '14,165,233' },
}

const STATE_DOT_COLORS = {
  idle: 'bg-[#4DA8C4]',
  listening: 'bg-emerald-500',
  thinking: 'bg-purple-500',
  speaking: 'bg-cyan-500',
}

const ValerioAvatar = ({ state = 'idle', size = 80, enable3DTilt = true }) => {
  const containerRef = useRef(null)
  const animRef = useRef(null)
  const stateRef = useRef(state)
  stateRef.current = state

  const tiltRef = useRef({ x: 0, y: 0 })

  const colors = STATE_COLORS[state] || STATE_COLORS.idle
  const dotColor = STATE_DOT_COLORS[state] || STATE_DOT_COLORS.idle

  useEffect(() => {
    let active = true
    const animate = () => {
      if (!active) return
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => {
      active = false
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  const speak = useCallback((text) => {
    if (!text) return
    const cleanText = cleanTextForTTS(text)
    if (cleanText) speakTextConversational(cleanText, 'valerio', () => {})
  }, [])

  useEffect(() => {
    window.valerioSpeak = speak
    window.__valerioStateRef = stateRef
    return () => {
      delete window.valerioSpeak
      delete window.__valerioStateRef
      stopSpeech()
    }
  }, [speak])

  const dotSize = Math.max(10, size * 0.13)
  const ringWidth = Math.max(1.5, size * 0.028)

  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ perspective: '800px', display: 'inline-flex', lineHeight: 0 }}
    >
      <motion.div
        ref={containerRef}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform .06s ease-out',
          cursor: 'pointer',
          filter: `drop-shadow(0 4px 24px rgba(${colors.r},.25))`,
        }}
        onPointerMove={(e) => {
          if (!enable3DTilt) return
          const rect = containerRef.current.getBoundingClientRect()
          const nx = (e.clientX - rect.left) / rect.width
          const ny = (e.clientY - rect.top) / rect.height
          tiltRef.current.x = ((ny - 0.5) * 2) * -12
          tiltRef.current.y = ((nx - 0.5) * 2) * 12
          containerRef.current.style.transform = `rotateX(${tiltRef.current.x}deg) rotateY(${tiltRef.current.y}deg)`
        }}
        onPointerLeave={() => {
          if (!enable3DTilt) return
          tiltRef.current = { x: 0, y: 0 }
          containerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)'
        }}
      >
        <img
          src="/VALERIO.webp"
          alt="Valerio"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `${ringWidth}px solid rgba(${colors.r},.3)`,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '18%',
            left: '22%',
            width: '35%',
            height: '20%',
            borderRadius: '50%',
            background: 'rgba(255,255,255,.15)',
            transform: 'rotate(-20deg)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: Math.max(2, size * 0.035),
            right: Math.max(2, size * 0.035),
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            border: `${Math.max(1.5, size * 0.02)}px solid rgba(255,255,255,.8)`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
          className={`${dotColor} ${state === 'listening' ? 'animate-pulse' : state === 'speaking' ? 'animate-ping' : ''}`}
        />

        {Array.from({ length: 6 }, (_, i) => {
          const angle = i * 1.047 + Date.now() * 0.0003
          const dist = 0.35 + Math.random() * 0.4
          const px = Math.cos(angle) * dist * (size * 0.45) + size * 0.5
          const py = Math.sin(angle) * dist * (size * 0.45) + size * 0.5
          const opacity = state === 'speaking' ? 0.2 : state === 'idle' ? 0.06 : 0.1
          return (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                left: px,
                top: py,
                width: Math.max(2, size * 0.02),
                height: Math.max(2, size * 0.02),
                borderRadius: '50%',
                backgroundColor: `rgba(${colors.r},${opacity})`,
                pointerEvents: 'none',
              }}
              animate={{
                left: [px, px + Math.cos(angle + 1) * size * 0.08],
                top: [py, py + Math.sin(angle + 1) * size * 0.08],
              }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )
        })}
      </motion.div>
    </motion.div>
  )
}

export default ValerioAvatar
