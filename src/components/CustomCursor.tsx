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

  const lastSparkleTime = useRef(0)
  const lastPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    // Only run on client, hide default cursor on body
    document.body.style.cursor = 'none'

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      const now = Date.now()
      const dist = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y)

      // Throttle sparkle creation: wait at least 15ms and move at least 8px
      if (now - lastSparkleTime.current > 15 && dist > 8) {
        lastSparkleTime.current = now;
        lastPos.current = { x: e.clientX, y: e.clientY };

        const newSparkle: Sparkle = {
          id: now.toString() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 14 + 10, // Between 10px and 24px
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
          rotation: Math.random() * 180
        };

        setSparkles(prev => [...prev.slice(-45), newSparkle]); // keep up to 45 at a time

        // Remove sparkle after a short time
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 1200);
      }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if we are hovering over an interactive element
      if (
        ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setHovering(true)
      } else {
        setHovering(false)
      }
    }

    const handleMouseLeave = () => {
      setHovering(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseLeave)
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <>
      <div
        className={`bubble-cursor ${hovering ? 'hovering' : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />

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
              y: sparkle.y - Math.random() * 50 - 20, // drift upwards slightly
              x: sparkle.x + (Math.random() - 0.5) * 40, // spread sideways
              rotate: sparkle.rotation + (Math.random() > 0.5 ? 90 : -90) // spin slightly
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
