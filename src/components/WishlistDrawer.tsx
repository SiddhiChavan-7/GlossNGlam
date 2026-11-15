'use client'

import { useWishlist } from '@/context/WishlistContext'
import { Product } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'

interface WishlistDrawerProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  onSelectProduct: (p: Product) => void
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}: WishlistDrawerProps) {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist()

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id))

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[75] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-brand text-brand" />
                <h2 className="text-lg font-bold text-gray-900">
                  My Wishlist ({wishlistedProducts.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {wishlistedProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-pink-50 border border-brand/20 flex items-center justify-center text-brand">
                    <Heart className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Your Wishlist is Empty</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-[240px]">
                      Click the heart on any nail set you love to save it here for later!
                    </p>
                  </div>
                  <Link
                    href="/catalog"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white font-bold text-xs rounded-full shadow-sm hover:opacity-90"
                  >
                    <span>Browse All Nails</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                wishlistedProducts.map(p => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:shadow-xs transition-all gap-3"
                  >
                    <div
                      className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0 cursor-pointer"
                      onClick={() => {
                        onClose()
                        onSelectProduct(p)
                      }}
                    >
                      <Image
                        src={p.image_url || '/placeholder.png'}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-semibold text-sm text-gray-900 truncate hover:text-brand cursor-pointer"
                        onClick={() => {
                          onClose()
                          onSelectProduct(p)
                        }}
                      >
                        {p.name}
                      </h4>
                      <p className="text-xs font-bold text-brand mt-0.5">
                        ₹{p.price.toLocaleString('en-IN')}
                      </p>
                      <button
                        onClick={() => {
                          onClose()
                          onSelectProduct(p)
                        }}
                        className="text-[11px] font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 mt-1"
                      >
                        <ShoppingBag className="w-3 h-3 text-brand" />
                        <span>Select Shape & Bag</span>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleWishlist(p.id, p.name)}
                      className="w-8 h-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors shrink-0"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            {wishlistedProducts.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-white space-y-2">
                <Link
                  href="/catalog"
                  onClick={onClose}
                  className="w-full py-3 bg-gray-900 hover:bg-brand text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Continue Shopping All Sets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={clearWishlist}
                  className="w-full py-2 text-center text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear Wishlist
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

