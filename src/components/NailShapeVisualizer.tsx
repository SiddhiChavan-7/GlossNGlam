'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Check, Info, Palette } from 'lucide-react'

export type NailShapeType = 'almond' | 'coffin' | 'stiletto' | 'square' | 'oval' | 'squoval'
export type NailLengthType = 'short' | 'medium' | 'long'

interface NailShapeVisualizerProps {
  isOpen: boolean
  onClose: () => void
  initialShape?: string
  initialLength?: NailLengthType
  initialColor?: string
  productName?: string
  onApply?: (shape: string, length: NailLengthType) => void
}

const SHAPES: { id: NailShapeType; name: string; tag: string; description: string }[] = [
  {
    id: 'almond',
    name: 'Almond',
    tag: 'Most Popular',
    description: 'Softly tapered sides with a rounded tip. Naturally elongates the fingers.'
  },
  {
    id: 'coffin',
    name: 'Coffin / Ballerina',
    tag: 'Trendy',
    description: 'Tapered sides that flatten into a sharp square tip. Bold and high-fashion.'
  },
  {
    id: 'stiletto',
    name: 'Stiletto',
    tag: 'Dramatic',
    description: 'Aggressively tapered into an ultra-sharp point. Fierce, glam statement.'
  },
  {
    id: 'square',
    name: 'Square',
    tag: 'Classic',
    description: 'Parallel straight sidewalls with crisp 90° edges. Clean, modern, and sharp.'
  },
  {
    id: 'oval',
    name: 'Oval',
    tag: 'Natural',
    description: 'Straight sides curving into a gentle symmetrical arch. Timeless and versatile.'
  },
  {
    id: 'squoval',
    name: 'Squoval',
    tag: 'Low-Maintenance',
    description: 'The strength of a square with soft rounded corners. Ideal for daily active wear.'
  }
]

const LENGTHS: { id: NailLengthType; name: string; approx: string }[] = [
  { id: 'short', name: 'Short', approx: '12–14 mm' },
  { id: 'medium', name: 'Medium', approx: '16–18 mm' },
  { id: 'long', name: 'Long', approx: '22–26 mm' }
]

const SKIN_TONES = [
  { id: 'fair', name: 'Fair', bg: '#F8D8C4', shadow: '#E2B89F' },
  { id: 'medium', name: 'Warm Tan', bg: '#E5B68E', shadow: '#C89369' },
  { id: 'deep', name: 'Deep Rich', bg: '#9E6845', shadow: '#7C4B2C' }
]

const POLISH_COLORS = [
  { name: 'Product Match', hex: '#FF66A3' },
  { name: 'Rose Nude', hex: '#E7B8AC' },
  { name: 'Crimson Red', hex: '#8B0021' },
  { name: 'Lilac Dream', hex: '#9B72CF' },
  { name: 'Glossy Black', hex: '#1C1C1E' },
  { name: 'Milky White', hex: '#F5F5F7' }
]

export default function NailShapeVisualizer({
  isOpen,
  onClose,
  initialShape = 'almond',
  initialLength = 'medium',
  initialColor,
  productName,
  onApply
}: NailShapeVisualizerProps) {
  const [selectedShape, setSelectedShape] = useState<NailShapeType>(
    (initialShape?.toLowerCase() as NailShapeType) || 'almond'
  )
  const [selectedLength, setSelectedLength] = useState<NailLengthType>(initialLength || 'medium')
  const [selectedSkin, setSelectedSkin] = useState(SKIN_TONES[1])
  const [selectedPolish, setSelectedPolish] = useState(initialColor || POLISH_COLORS[0].hex)

  // Multiplier for nail height based on length
  const lengthHeightMultiplier: Record<NailLengthType, number> = {
    short: 1.0,
    medium: 1.35,
    long: 1.75
  }

  // Generate SVG path for a single nail shape
  // viewBox="0 0 100 160", base nail connects at y=150
  const getNailSvgPath = (shape: NailShapeType, length: NailLengthType) => {
    const mult = lengthHeightMultiplier[length]
    // Tip Y position: higher up for longer nails
    const baseTipY = 30
    const tipY = Math.max(5, baseTipY - (mult - 1) * 35)

    switch (shape) {
      case 'almond':
        return `M 22 150 C 20 100 32 ${tipY + 25} 50 ${tipY} C 68 ${tipY + 25} 80 100 78 150 Z`
      case 'coffin':
        return `M 22 150 C 22 110 32 ${tipY + 20} 38 ${tipY} L 62 ${tipY} C 68 ${tipY + 20} 78 110 78 150 Z`
      case 'stiletto':
        return `M 22 150 C 24 105 38 ${tipY + 15} 50 ${tipY - 5} C 62 ${tipY + 15} 76 105 78 150 Z`
      case 'square':
        return `M 22 150 L 22 ${tipY} L 78 ${tipY} L 78 150 Z`
      case 'squoval':
        return `M 22 150 L 22 ${tipY + 8} Q 22 ${tipY} 30 ${tipY} L 70 ${tipY} Q 78 ${tipY} 78 ${tipY + 8} L 78 150 Z`
      case 'oval':
      default:
        return `M 22 150 C 22 100 24 ${tipY + 15} 50 ${tipY} C 76 ${tipY + 15} 78 100 78 150 Z`
    }
  }

  const handleApply = () => {
    if (onApply) {
      onApply(selectedShape, selectedLength)
    }
    onClose()
  }

  const currentShapeObj = SHAPES.find(s => s.id === selectedShape) || SHAPES[0]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full sm:max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-pink-50 border border-brand/20 flex items-center justify-center text-brand">
                  <Sparkles className="w-4 h-4 fill-brand" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    Virtual Shape & Length Visualizer
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Preview how shapes look on realistic fingers before choosing
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Interactive Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Left Column: Visual Hand Simulation (7 cols) */}
              <div className="md:col-span-7 bg-gradient-to-b from-gray-50 to-neutral-100 p-6 flex flex-col items-center justify-between min-h-[340px] sm:min-h-[420px] relative">
                
                {/* Hand Tone & Polish Color Switcher Overlay */}
                <div className="w-full flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-gray-400 mr-1">Skin Tone:</span>
                    {SKIN_TONES.map(tone => (
                      <button
                        key={tone.id}
                        onClick={() => setSelectedSkin(tone)}
                        className={`w-4 h-4 rounded-full border transition-all ${
                          selectedSkin.id === tone.id ? 'ring-2 ring-brand scale-110 border-white' : 'border-black/20 opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: tone.bg }}
                        title={tone.name}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
                    <Palette className="w-3.5 h-3.5 text-gray-400 mr-1" />
                    {POLISH_COLORS.map(c => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedPolish(c.hex)}
                        className={`w-3.5 h-3.5 rounded-full border transition-all ${
                          selectedPolish === c.hex ? 'ring-2 ring-brand scale-110 border-white' : 'border-black/20'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Hand / 4-Fingers Realistic Simulation */}
                <div className="relative w-full max-w-[320px] h-[280px] sm:h-[320px] flex items-end justify-center gap-3 sm:gap-4 pb-4">
                  {/* Finger 1: Index */}
                  <div className="flex flex-col items-center relative" style={{ width: 56 }}>
                    {/* Nail Tip Overlay */}
                    <div className="relative z-10 -mb-7 w-full flex justify-center">
                      <svg width="52" height="85" viewBox="0 0 100 160" className="drop-shadow-md">
                        <defs>
                          <linearGradient id={`nail-grad-index-${selectedShape}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={selectedPolish} />
                            <stop offset="60%" stopColor={selectedPolish} />
                            <stop offset="100%" stopColor="#222" stopOpacity="0.25" />
                          </linearGradient>
                          <linearGradient id="shine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
                            <stop offset="40%" stopColor="#fff" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                        <path
                          d={getNailSvgPath(selectedShape, selectedLength)}
                          fill={`url(#nail-grad-index-${selectedShape})`}
                          stroke="rgba(0,0,0,0.12)"
                          strokeWidth="1.5"
                        />
                        <path
                          d={getNailSvgPath(selectedShape, selectedLength)}
                          fill="url(#shine-grad)"
                          className="pointer-events-none"
                        />
                      </svg>
                    </div>
                    {/* Finger Body */}
                    <div
                      className="w-12 h-36 rounded-t-3xl shadow-inner border border-black/5"
                      style={{ backgroundColor: selectedSkin.bg }}
                    />
                    <span className="text-[10px] font-medium text-gray-400 mt-1">Index</span>
                  </div>

                  {/* Finger 2: Middle (Taller) */}
                  <div className="flex flex-col items-center relative" style={{ width: 58 }}>
                    <div className="relative z-10 -mb-7 w-full flex justify-center">
                      <svg width="54" height="90" viewBox="0 0 100 160" className="drop-shadow-md">
                        <path
                          d={getNailSvgPath(selectedShape, selectedLength)}
                          fill={`url(#nail-grad-index-${selectedShape})`}
                          stroke="rgba(0,0,0,0.12)"
                          strokeWidth="1.5"
                        />
                        <path
                          d={getNailSvgPath(selectedShape, selectedLength)}
                          fill="url(#shine-grad)"
                          className="pointer-events-none"
                        />
                      </svg>
                    </div>
                    <div
                      className="w-13 h-42 rounded-t-3xl shadow-inner border border-black/5"
                      style={{ backgroundColor: selectedSkin.bg }}
                    />
                    <span className="text-[10px] font-medium text-gray-400 mt-1">Middle</span>
                  </div>

                  {/* Finger 3: Ring */}
                  <div className="flex flex-col items-center relative" style={{ width: 56 }}>
                    <div className="relative z-10 -mb-7 w-full flex justify-center">
                      <svg width="52" height="85" viewBox="0 0 100 160" className="drop-shadow-md">
                        <path
                          d={getNailSvgPath(selectedShape, selectedLength)}
                          fill={`url(#nail-grad-index-${selectedShape})`}
                          stroke="rgba(0,0,0,0.12)"
                          strokeWidth="1.5"
                        />
                        <path
                          d={getNailSvgPath(selectedShape, selectedLength)}
                          fill="url(#shine-grad)"
                          className="pointer-events-none"
                        />
                      </svg>
                    </div>
                    <div
                      className="w-12 h-38 rounded-t-3xl shadow-inner border border-black/5"
                      style={{ backgroundColor: selectedSkin.bg }}
                    />
                    <span className="text-[10px] font-medium text-gray-400 mt-1">Ring</span>
                  </div>

                  {/* Finger 4: Pinky (Smaller) */}
                  <div className="flex flex-col items-center relative" style={{ width: 48 }}>
                    <div className="relative z-10 -mb-6 w-full flex justify-center">
                      <svg width="44" height="74" viewBox="0 0 100 160" className="drop-shadow-md">
                        <path
                          d={getNailSvgPath(selectedShape, selectedLength)}
                          fill={`url(#nail-grad-index-${selectedShape})`}
                          stroke="rgba(0,0,0,0.12)"
                          strokeWidth="1.5"
                        />
                        <path
                          d={getNailSvgPath(selectedShape, selectedLength)}
                          fill="url(#shine-grad)"
                          className="pointer-events-none"
                        />
                      </svg>
                    </div>
                    <div
                      className="w-10 h-28 rounded-t-3xl shadow-inner border border-black/5"
                      style={{ backgroundColor: selectedSkin.bg }}
                    />
                    <span className="text-[10px] font-medium text-gray-400 mt-1">Pinky</span>
                  </div>
                </div>

                {/* Active Shape & Length Badge */}
                <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-2xl border border-gray-200 text-xs flex items-center gap-3 shadow-xs">
                  <span className="font-semibold text-gray-900 capitalize">
                    {currentShapeObj.name} • {selectedLength} Length
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500 text-[11px]">
                    {LENGTHS.find(l => l.id === selectedLength)?.approx}
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Selection Controls (5 cols) */}
              <div className="md:col-span-5 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 bg-white">
                <div className="space-y-5">
                  {/* 1. Length Selector */}
                  <div>
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2">
                      1. Choose Length
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {LENGTHS.map(l => {
                        const isActive = selectedLength === l.id
                        return (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => setSelectedLength(l.id)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isActive
                                ? 'border-brand bg-pink-50/40 text-brand shadow-xs font-semibold'
                                : 'border-gray-200 text-gray-600 hover:border-gray-400'
                            }`}
                          >
                            <p className="text-xs font-bold capitalize">{l.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{l.approx}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 2. Shape Selector Grid */}
                  <div>
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2">
                      2. Choose Nail Shape
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {SHAPES.map(s => {
                        const isSelected = selectedShape === s.id
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedShape(s.id)}
                            className={`p-3 rounded-xl border text-left transition-all relative ${
                              isSelected
                                ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                                : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold capitalize">{s.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-brand" />}
                            </div>
                            <span
                              className={`text-[10px] mt-1 inline-block ${
                                isSelected ? 'text-gray-300' : 'text-gray-400'
                              }`}
                            >
                              {s.tag}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Shape Details Card */}
                  <div className="bg-pink-50/50 border border-brand/15 rounded-2xl p-3 text-xs">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">
                          {currentShapeObj.name} Shape
                        </p>
                        <p className="text-gray-600 text-[11px] mt-0.5 leading-relaxed">
                          {currentShapeObj.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="pt-6">
                  <button
                    onClick={handleApply}
                    className="w-full py-3.5 bg-brand hover:bg-brand/90 transition-all text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand/25"
                  >
                    <span>Choose {currentShapeObj.name} ({selectedLength})</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-2 mt-1"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

