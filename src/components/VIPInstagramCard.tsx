'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Instagram } from 'lucide-react'

export default function VIPInstagramCard() {
  const ref = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs for the 3D rotation
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 })

  // Map mouse position to rotation max +/- 12 degrees for extreme elegance
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg'])
  
  // Dynamic glare based on mouse position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['100%', '0%'])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['100%', '0%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    // Reset back to absolute zero (flat) when mouse leaves
    x.set(0)
    y.set(0)
  }

  return (
    <section className="py-20 px-4 flex justify-center my-8" style={{ perspective: 2000 }}>
      {/* 
        This is the actual physical "Ticket".
        When hovering, the Ticket itself rotates in 3D.
      */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-full max-w-3xl bg-white rounded-[2.5rem] p-10 md:p-16 border border-gray-100 flex flex-col items-center text-center cursor-crosshair shadow-[0_30px_60px_rgba(224,17,95,0.08)]"
      >
        {/* Dynamic Glass Glare Effect tracking cursor */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none rounded-[2.5rem] overflow-hidden mix-blend-overlay"
          style={{
            background: useTransform(
              [glareX, glareY], 
              ([gx, gy]: any) => `radial-gradient(circle at ${gx} ${gy}, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 60%)`
            )
          }}
        />

        {/* Ambient Glossy Glows inside the ticket */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-light/20 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none z-0" />

        {/* The Internal Content container pushed FORWARD in 3D space to pop! */}
        <motion.div 
          style={{ transform: 'translateZ(60px)' }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
            <Instagram className="w-8 h-8 md:w-10 md:h-10 text-brand" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-brand tracking-tight">
            Looking for Custom Nails?
          </h2>
          
          <p className="text-gray-500 font-medium mb-12 text-sm md:text-lg max-w-lg mx-auto leading-relaxed drop-shadow-sm">
            Have a specific design in mind? Slide into our DMs to collaborate on a bespoke, one-of-a-kind set handcrafted exclusively for you.
          </p>
          
          {/* We push the button even further out in Z space for 3 layers of depth */}
          <motion.a 
            style={{ transform: 'translateZ(20px)' }}
            href="https://www.instagram.com/_glossnglam8" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative bg-brand text-white font-bold px-10 py-5 rounded-full text-xs md:text-sm hover:scale-105 transition-transform shadow-[0_15px_30px_rgba(224,17,95,0.4)] whitespace-nowrap inline-flex items-center gap-3 overflow-hidden"
          >
            <span className="relative z-10 tracking-widest uppercase">DM us at @_glossnglam8</span>
            <Instagram className="w-4 h-4 text-white relative z-10 transition-colors" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  )
}
