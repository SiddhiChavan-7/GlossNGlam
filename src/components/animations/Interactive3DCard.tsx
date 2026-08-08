'use client';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Interactive3DCard({ children, className = '', onClick }: Interactive3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the motion
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  // Map mouse position to rotation (-10 to 10 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);
  
  // Calculate a shine offset based on mouse position
  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ['100%', '-100%']);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], ['100%', '-100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize to -0.5 to 0.5
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative rounded-2xl ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div 
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ mixBlendMode: 'soft-light' }}
      >
        <motion.div
          className="w-full h-full bg-gradient-to-tr from-white/0 via-white/40 to-white/0"
          style={{
            x: shineX,
            y: shineY,
            scale: 2,
            rotate: 45
          }}
        />
      </div>
      <div style={{ transform: 'translateZ(20px)' }} className="w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
