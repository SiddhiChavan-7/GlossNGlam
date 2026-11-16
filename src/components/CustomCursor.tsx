'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Sparkle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

const SPARKLE_COLORS = [
  '#E0115F', '#FFB6C1', '#8B0045',
  '#FFFFFF', '#fce4ec', '#FFD700',
  '#C0C0C0', '#9C27B0', '#FF4081'
];

const SparkleSvg = ({ color, size }: { color: string, size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
    <path d="M12 0C12 0 12.5 9.5 24 12C12.5 14.5 12 24 12 24C12 24 11.5 14.5 0 12C11.5 9.5 12 0 12 0Z" />
  </svg>
);

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [isTouch, setIsTouch] = useState(false)

  const lastSparkleTime = useRef(0)
  const lastPos = useRef({ x: -100, y: -100 })

  const spawnSparkles = (x: number, y: number, count = 1) => {
    const now = Date.now()
    const newItems: Sparkle[] = []

    for (let i = 0; i < count; i++) {
      newItems.push({
        id: `${now}-${i}-${Math.random()}`,
        x: x + (count > 1 ? (Math.random() - 0.5) * 26 : 0),
        y: y + (count > 1 ? (Math.random() - 0.5) * 26 : 0),
        size: Math.random() * 14 + 10, // 10px to 24px
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        rotation: Math.random() * 180,
      })
    }

    setSparkles(prev => [...prev.slice(-45), ...newItems])

    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newItems.some(item => item.id === s.id)))
    }, 1100)
  }

  useEffect(() => {
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)

    setIsTouch(isTouchDevice)

    // Only hide system cursor on desktop mice
    if (!isTouchDevice) {
      document.body.style.cursor = 'none'
    }

    // --- Desktop Mouse Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      const now = Date.now()
      const dist = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y)

      if (now - lastSparkleTime.current > 15 && dist > 8) {
        lastSparkleTime.current = now
        lastPos.current = { x: e.clientX, y: e.clientY }
        spawnSparkles(e.clientX, e.clientY, 1)
      }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName) ||
        target?.closest('a') ||
        target?.closest('button') ||
        target?.classList?.contains('cursor-pointer')
      ) {
        setHovering(true)
      } else {
        setHovering(false)
      }
    }

    const handleMouseLeave = () => {
      setHovering(false)
    }

    // --- Mobile Touch Handlers ---
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      setPosition({ x: touch.clientX, y: touch.clientY })
      lastPos.current = { x: touch.clientX, y: touch.clientY }
      lastSparkleTime.current = Date.now()
      // Burst 3 sparkles instantly at the tapped location
      spawnSparkles(touch.clientX, touch.clientY, 3)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      setPosition({ x: touch.clientX, y: touch.clientY })

      const now = Date.now()
      const dist = Math.hypot(touch.clientX - lastPos.current.x, touch.clientY - lastPos.current.y)

      // Throttle sparkle creation during drag/scroll
      if (now - lastSparkleTime.current > 25 && dist > 12) {
        lastSparkleTime.current = now
        lastPos.current = { x: touch.clientX, y: touch.clientY }
        spawnSparkles(touch.clientX, touch.clientY, 1)
      }
    }

    const handleTouchEnd = () => {
      // Hide cursor bubble when finger leaves the screen
      setPosition({ x: -100, y: -100 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseLeave)

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseLeave)

      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <>
      {/* Custom bubble cursor (only shown on mouse or while touching) */}
      {!isTouch && (
        <div
          className={`bubble-cursor ${hovering ? 'hovering' : ''}`}
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
        />
      )}

      {/* Sparkles Stream (Works on both Mobile Touch and Desktop Mouse) */}
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            initial={{
              opacity: 1,
              scale: 0,
              x: sparkle.x - sparkle.size / 2,
              y: sparkle.y - sparkle.size / 2,
              rotate: sparkle.rotation
            }}
            animate={{
              opacity: 0,
              scale: 1.5,
              y: sparkle.y - Math.random() * 50 - 20, // drift upwards
              x: sparkle.x + (Math.random() - 0.5) * 40, // spread sideways
              rotate: sparkle.rotation + (Math.random() > 0.5 ? 90 : -90)
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              zIndex: 9998,
            }}
          >
            <SparkleSvg color={sparkle.color} size={sparkle.size} />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  )
}
