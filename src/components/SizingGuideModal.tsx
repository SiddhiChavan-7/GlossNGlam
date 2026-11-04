'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Instagram, Camera } from 'lucide-react'
import Image from 'next/image'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SizingGuideModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transform-gpu will-change-transform"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh] transform-gpu will-change-transform"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 text-brand">
                <Camera size={22} />
                <h3 className="text-xl font-bold text-gray-900">Nail Sizing Guide</h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
              {/* Sizing Guide Image */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-neutral-50 relative aspect-[1/1] w-full">
                <Image
                  src="/size-guide.jpg"
                  alt="Gloss n Glam Coin Sizing Guide"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Instagram Action Button */}
              <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border border-brand/20 rounded-2xl p-4 text-center space-y-3">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Send Your Photos for Perfect Sizing</h4>
                  <p className="text-gray-600 text-xs mt-1">
                    Take 2 photos next to any Indian coin (4 fingers & thumb) and DM us on Instagram. We&apos;ll calculate your exact nail size!
                  </p>
                </div>
                <a
                  href="https://ig.me/m/_glossnglam8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-brand hover:opacity-90 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Instagram className="w-4 h-4" />
                  DM Photos on Instagram (@_glossnglam8)
                </a>
              </div>

              {/* Standard Sizes Chart */}
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Standard Sizes Reference (mm)</h4>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex justify-between font-medium text-xs text-gray-500 border-b border-gray-200 pb-2 mb-2">
                    <span>Size</span>
                    <span>Thumb to Pinky</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-gray-700">
                    <li className="flex justify-between">
                      <span className="font-semibold">XS</span>
                      <span className="font-mono text-gray-600">14, 10, 11, 10, 7</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-semibold">S</span>
                      <span className="font-mono text-gray-600">15, 11, 12, 11, 8</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-semibold">M</span>
                      <span className="font-mono text-gray-600">16, 12, 13, 12, 9</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-semibold">L</span>
                      <span className="font-mono text-gray-600">18, 13, 14, 13, 10</span>
                    </li>
                    <li className="flex justify-between border-t border-gray-200 pt-2 text-brand font-medium">
                      <span>Custom</span>
                      <span>Send photos via Instagram DM</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
