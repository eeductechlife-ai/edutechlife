import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

const CustomCursor = () => {
  const [isTouchDevice] = useState(() => typeof window !== 'undefined' ? window.matchMedia('(hover: none) and (pointer: coarse)').matches : false)
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return null
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 600, mass: 0.3 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const isHovering = useMotionValue(0)
  const isClicking = useMotionValue(0)
  const scaleTransform = useSpring(1, springConfig)
  const clickScale = useSpring(1, { damping: 15, stiffness: 800 })

  const trail1X = useSpring(cursorX, { damping: 28, stiffness: 450, mass: 0.5 })
  const trail1Y = useSpring(cursorY, { damping: 28, stiffness: 450, mass: 0.5 })
  const trail2X = useSpring(cursorX, { damping: 32, stiffness: 350, mass: 0.7 })
  const trail2Y = useSpring(cursorY, { damping: 32, stiffness: 350, mass: 0.7 })

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e) => {
      const target = e.target
      if (target.closest('a') || target.closest('button') || target.closest('[role="button"]') || target.closest('.interactive') || target.closest('input') || target.closest('select') || target.closest('textarea')) {
        isHovering.set(1)
      }
    }

    const handleMouseOut = (e) => {
      const target = e.target
      if (target.closest('a') || target.closest('button') || target.closest('[role="button"]') || target.closest('.interactive') || target.closest('input') || target.closest('select') || target.closest('textarea')) {
        isHovering.set(0)
      }
    }

    const handleMouseDown = () => {
      isClicking.set(1)
      clickScale.set(0.8)
    }

    const handleMouseUp = () => {
      isClicking.set(0)
      clickScale.set(1)
    }

    window.addEventListener('mousemove', moveCursor, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    window.addEventListener('mouseout', handleMouseOut, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  useEffect(() => {
    const unsubscribeHover = isHovering.on("change", (val) => {
      scaleTransform.set(isClicking.get() ? 0.8 : (val ? 1.3 : 1))
    })
    const unsubscribeClick = isClicking.on("change", (val) => {
      scaleTransform.set(val ? 0.8 : (isHovering.get() ? 1.3 : 1))
    })
    return () => {
      unsubscribeHover()
      unsubscribeClick()
    }
  }, [scaleTransform])

  if (isTouchDevice) return null

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      <motion.div
        className="absolute w-8 h-8 rounded-full pointer-events-none"
        style={{
          translateX: '-50%',
          translateY: '-50%',
          x: trail2X,
          y: trail2Y,
          scale: scaleTransform,
          backgroundColor: 'rgba(77, 168, 196, 0.04)',
          willChange: 'transform',
        }}
      />

      <motion.div
        className="absolute w-5 h-5 rounded-full pointer-events-none"
        style={{
          translateX: '-50%',
          translateY: '-50%',
          x: trail1X,
          y: trail1Y,
          scale: scaleTransform,
          backgroundColor: 'rgba(77, 168, 196, 0.12)',
          willChange: 'transform',
        }}
      />

      <motion.div
        className="absolute w-8 h-8 rounded-full border-2 pointer-events-none"
        style={{
          translateX: '-50%',
          translateY: '-50%',
          scale: scaleTransform,
          borderColor: isHovering ? 'rgba(77, 168, 196, 0.6)' : 'rgba(0, 75, 99, 0.3)',
          backgroundColor: isHovering ? 'rgba(77, 168, 196, 0.1)' : 'rgba(77, 168, 196, 0.05)',
          willChange: 'transform',
        }}
      />

      <motion.div
        className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
        style={{
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: isHovering ? '#004B63' : '#4DA8C4',
          scale: clickScale,
          willChange: 'transform',
        }}
      />
    </motion.div>
  )
}

export default CustomCursor
