'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Instagram, Camera, ZoomIn, ZoomOut, Maximize2, RotateCcw, Copy, Check, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SizingGuideModal({ isOpen, onClose }: Props) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [copied, setCopied] = useState(false)

  const handleCopyHandle = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText('_glossnglam8')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation()
    setZoomScale(prev => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation()
    setZoomScale(prev => Math.max(prev - 0.5, 1))
  }

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation()
    setZoomScale(1)
  }

  const openFullscreen = () => {
    setZoomScale(1)
    setIsZoomed(true)
  }

  const closeFullscreen = () => {
    setIsZoomed(false)
    setZoomScale(1)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transform-gpu will-change-transform"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-24px)] sm:w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] transform-gpu will-change-transform"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2 text-brand">
                  <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center">
                    <Camera size={18} className="text-brand" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                      Coin Sizing Guide
                    </h3>
                    <p className="text-[11px] text-gray-500">Measure your nails accurately in 2 minutes</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close sizing guide"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-4 sm:space-y-5 pb-6">
                {/* Sizing Guide Image with Tap-To-Zoom */}
                <div className="space-y-1.5">
                  <div
                    onClick={openFullscreen}
                    className="group relative w-full aspect-square bg-neutral-900/5 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer select-none"
                    title="Click or tap to zoom full screen"
                  >
                    <Image
                      src="/size-guide.jpg"
                      alt="Gloss n Glam Coin Sizing Guide"
                      fill
                      sizes="(max-width: 640px) 92vw, 480px"
                      className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      priority
                    />

                    {/* Tap to Zoom Badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-black/75 hover:bg-black/90 text-white text-[11px] sm:text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-transform group-hover:scale-105">
                      <ZoomIn size={13} className="text-brand" />
                      <span>Tap to Zoom Fullscreen</span>
                    </div>

                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-gray-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-gray-200/60 shadow-xs">
                      100% Accurate Measurement
                    </div>
                  </div>
                  <p className="text-[11px] text-center text-gray-500">
                    💡 <span className="font-medium">On mobile:</span> Tap the image above to zoom in and see measurement details clearly.
                  </p>
                </div>

                {/* Step by Step Mobile Guide */}
                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-gray-200/80 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand" />
                    How to measure with a coin
                  </h4>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-gray-100 shadow-xs">
                      <span className="w-5 h-5 rounded-full bg-brand/10 text-brand font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <p className="text-gray-700 leading-relaxed">
                        <strong className="text-gray-900">Get any Indian coin:</strong> Use a ₹1, ₹2, ₹5, or ₹10 coin as a universal measurement reference.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-gray-100 shadow-xs">
                      <span className="w-5 h-5 rounded-full bg-brand/10 text-brand font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </span>
                      <p className="text-gray-700 leading-relaxed">
                        <strong className="text-gray-900">Rest your hand flat:</strong> Place your hand flat on a plain white paper or clean table next to the coin.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-gray-100 shadow-xs">
                      <span className="w-5 h-5 rounded-full bg-brand/10 text-brand font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </span>
                      <p className="text-gray-700 leading-relaxed">
                        <strong className="text-gray-900">Take 2 clear top-down photos:</strong>
                        <br />
                        • <span className="text-gray-600">Photo 1:</span> 4 fingers (Index to Pinky) flat next to the coin.
                        <br />
                        • <span className="text-gray-600">Photo 2:</span> Your thumb flat next to the coin.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-gray-100 shadow-xs">
                      <span className="w-5 h-5 rounded-full bg-brand/10 text-brand font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        4
                      </span>
                      <p className="text-gray-700 leading-relaxed">
                        <strong className="text-gray-900">Send them to us on Instagram:</strong> DM both photos to <span className="font-semibold text-brand">@_glossnglam8</span>. We calculate your exact millimetre size for a flawless fit!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instagram Action Button */}
                <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border border-brand/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-center space-y-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Send Your Photos for Perfect Sizing</h4>
                    <p className="text-gray-600 text-xs mt-1">
                      Our nail artists verify your coin photos and guarantee 100% custom sizing!
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href="https://ig.me/m/_glossnglam8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-brand hover:opacity-90 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-brand/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>DM Photos on Instagram</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyHandle}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-medium transition-all"
                      title="Copy Instagram handle"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                      <span>{copied ? 'Copied @_glossnglam8' : 'Copy Handle'}</span>
                    </button>
                  </div>
                </div>

                {/* Standard Sizes Chart */}
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2">Standard Sizes Reference (mm)</h4>
                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-gray-100 overflow-x-auto">
                    <div className="flex justify-between font-medium text-xs text-gray-500 border-b border-gray-200 pb-2 mb-2">
                      <span>Size</span>
                      <span>Thumb to Pinky (mm)</span>
                    </div>
                    <ul className="space-y-2 text-xs text-gray-700">
                      <li className="flex justify-between">
                        <span className="font-semibold px-2 py-0.5 bg-gray-200/60 rounded text-[11px]">XS</span>
                        <span className="font-mono text-gray-600">14, 10, 11, 10, 7</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-semibold px-2 py-0.5 bg-gray-200/60 rounded text-[11px]">S</span>
                        <span className="font-mono text-gray-600">15, 11, 12, 11, 8</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-semibold px-2 py-0.5 bg-gray-200/60 rounded text-[11px]">M</span>
                        <span className="font-mono text-gray-600">16, 12, 13, 12, 9</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-semibold px-2 py-0.5 bg-gray-200/60 rounded text-[11px]">L</span>
                        <span className="font-mono text-gray-600">18, 13, 14, 13, 10</span>
                      </li>
                      <li className="flex justify-between border-t border-gray-200 pt-2 text-brand font-medium">
                        <span className="font-semibold">Custom</span>
                        <span>Verified via Instagram Coin Photo</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fullscreen Interactive Lightbox / Pinch-to-Zoom Viewer */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex flex-col justify-between p-3 sm:p-6 backdrop-blur-md"
            onClick={closeFullscreen}
          >
            {/* Top Lightbox Controls */}
            <div className="flex items-center justify-between z-20 text-white" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-white/90">Coin Sizing Guide — Zoom View</span>
                <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                  {Math.round(zoomScale * 100)}%
                </span>
              </div>
              <button
                onClick={closeFullscreen}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close fullscreen view"
              >
                <X size={20} />
              </button>
            </div>

            {/* Zoomable Image Container */}
            <div
              className="flex-1 w-full h-full flex items-center justify-center overflow-auto py-2"
              onClick={e => e.stopPropagation()}
            >
              <div
                className="relative max-w-full max-h-full transition-transform duration-200 origin-center"
                style={{
                  transform: `scale(${zoomScale})`,
                  width: 'min(90vw, 650px)',
                  aspectRatio: '1/1',
                }}
              >
                <Image
                  src="/size-guide.jpg"
                  alt="Gloss n Glam Coin Sizing Guide Fullscreen"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Bottom Floating Toolbar */}
            <div
              className="flex items-center justify-center gap-2 z-20 pb-2"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-neutral-900/90 border border-white/20 rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomScale <= 1}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  title="Zoom Out"
                >
                  <ZoomOut size={18} />
                </button>

                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 py-1 rounded text-xs text-white/80 hover:text-white hover:bg-white/10 transition-all font-mono"
                  title="Reset Zoom"
                >
                  <RotateCcw size={14} className="inline mr-1" />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomScale >= 3}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  title="Zoom In"
                >
                  <ZoomIn size={18} />
                </button>

                <div className="h-4 w-px bg-white/20 mx-0.5" />

                <button
                  type="button"
                  onClick={closeFullscreen}
                  className="px-3 py-1 bg-brand hover:opacity-90 text-white text-xs font-semibold rounded-full transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
