'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'
import { Share2, X, Instagram, Camera } from 'lucide-react'
import SizingGuideModal from '@/components/SizingGuideModal'
import { Product } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { addToCart } = useCart()
  const [selectedShape, setSelectedShape] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false)

  // Reset state when product opens
  useEffect(() => {
    if (isOpen && product) {
      if (product.nail_shapes?.length) setSelectedShape(product.nail_shapes[0])
      setSelectedSize('')
    }
  }, [isOpen, product])

  const handleAddToCart = () => {
    if (!product) return
    if (!selectedShape) { toast.error('Please select a nail shape'); return }
    if (!selectedSize) { toast.error('Please select a nail size'); return }
    addToCart(product, selectedShape, selectedSize)
    toast.success('Added to bag! 💅')
    onClose() // Auto close after adding
  }

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transform-gpu will-change-transform"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full h-[90vh] mt-[10vh] md:h-full md:mt-0 md:w-[600px] bg-white rounded-t-3xl md:rounded-none shadow-2xl flex flex-col overflow-hidden transform-gpu will-change-transform"
          >
            {/* Header */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button className="p-3 bg-white/80 backdrop-blur rounded-full hover:bg-white shadow">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
              <button onClick={onClose} className="p-3 bg-white/80 backdrop-blur rounded-full hover:bg-gray-100 shadow">
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-32">
              {/* Image Hero Carousel */}
              <div className="relative w-full aspect-square bg-gray-50 flex overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {(product.gallery_urls && product.gallery_urls.length > 0) ? (
                  product.gallery_urls.map((url, idx) => (
                    <div key={idx} className="relative w-full h-full flex-shrink-0 snap-center">
                      <Image
                        src={url}
                        alt={`${product.name} - view ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      {/* Dots indicator (minimalist hack) */}
                      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
                        {product.gallery_urls!.map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50 backdrop-blur-sm'}`} />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative w-full h-full flex-shrink-0 snap-center">
                    <Image
                      src={product.image_url || 'https://placehold.co/600x600/f5e6e8/c06b72?text=GlossNails'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Content Panel */}
              <div className="p-6 md:p-10 flex flex-col gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  {product.categories && (
                    <span className="text-xs text-brand font-medium bg-brand-light px-3 py-1 rounded-full mt-2 inline-block">
                      {product.categories.name}
                    </span>
                  )}
                </div>

                <p className="text-3xl font-bold text-brand">₹{product.price.toLocaleString('en-IN')}</p>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{product.description}</p>

                <div className="text-sm text-gray-500 space-y-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p><span className="font-medium text-gray-700">Shipping:</span> Ships within 4-7 days</p>
                  <p><span className="font-medium text-gray-700">Support:</span> DM on Instagram @_glossnglam8</p>
                </div>

                {/* Nail shape selector */}
                {product.nail_shapes?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2 border-t pt-6">Nail Shape</p>
                    <div className="flex flex-wrap gap-2">
                      {product.nail_shapes.map((shape: string) => (
                        <button
                          key={shape}
                          onClick={() => setSelectedShape(shape)}
                          className={`px-4 py-2 rounded-full text-sm transition-all capitalize border ${selectedShape === shape ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900">Nail Size</p>
                    <button
                      onClick={() => setIsSizingModalOpen(true)}
                      className="text-xs text-brand font-medium hover:underline flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Size Guide (Coin Photo)
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex-shrink-0 rounded-xl text-sm font-medium border transition-all ${selectedSize === size ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Sizing photo & Instagram DM banner */}
                  <div className="mt-3.5 p-3 bg-gradient-to-r from-pink-50/90 via-rose-50/70 to-pink-50/90 border border-brand/20 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl overflow-hidden relative flex-shrink-0 border border-brand/30 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setIsSizingModalOpen(true)}
                        title="Click to view sizing guide"
                      >
                        <Image src="/size-guide.jpg" alt="Size Guide" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900">Don&apos;t know your size?</p>
                        <p className="text-[11px] text-gray-600">Send 2 photos with a coin on Instagram</p>
                      </div>
                    </div>
                    <a
                      href="https://ig.me/m/_glossnglam8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand hover:opacity-90 text-white rounded-xl text-xs font-medium transition-all shadow-sm shrink-0"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>DM Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 md:p-6 pb-8 md:pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all shadow-xl ${product.in_stock
                    ? 'bg-gray-900 text-white hover:bg-brand active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed hidden'
                  }`}
              >
                {product.in_stock ? `Add to Bag — ₹${product.price.toLocaleString('en-IN')}` : 'Sold Out'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <SizingGuideModal isOpen={isSizingModalOpen} onClose={() => setIsSizingModalOpen(false)} />
    </AnimatePresence>
  )
}
