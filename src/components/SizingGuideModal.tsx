'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Ruler } from 'lucide-react'

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
                <Ruler size={24} />
                <h3 className="text-xl font-bold text-gray-900">Sizing Guide</h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <h4 className="font-semibold text-gray-900 mb-2">How to measure</h4>
              <p className="text-gray-500 text-sm mb-6">
                Use a soft measuring tape horizontally across the widest part of your natural nail bed. 
                If you don't have a tape, use a piece of tape, mark the edges, and measure with a ruler.
              </p>

              <div className="bg-brand-light/40 rounded-2xl p-4 mb-6">
                <div className="flex justify-between font-medium text-sm text-gray-700 border-b border-brand/20 pb-2 mb-2">
                  <span>Size</span>
                  <span>Thumb to Pinky (mm)</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex justify-between"><span>XS</span> <span className="font-mono">14, 10, 11, 10, 7</span></li>
                  <li className="flex justify-between"><span>S</span> <span className="font-mono">15, 11, 12, 11, 8</span></li>
                  <li className="flex justify-between"><span>M</span> <span className="font-mono">16, 12, 13, 12, 9</span></li>
                  <li className="flex justify-between"><span>L</span> <span className="font-mono">18, 13, 14, 13, 10</span></li>
                </ul>
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">Custom Sizing</h4>
              <p className="text-gray-500 text-sm">
                If your measurements don't match our standard sets perfectly, select "Custom" and leave your measurements in the order notes in millimeters!
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
