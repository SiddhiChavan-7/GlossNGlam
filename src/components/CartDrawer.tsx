'use client'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/components/UserContext'
import { useRouter } from 'next/navigation'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, giftOffer } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  // Calculate base total for progress bar (excluding free gift price which is 0 anyway)
  const baseTotal = items.filter(i => !i.isFreeGift).reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  
  let progress = 0
  let amountLeft = 0
  if (giftOffer?.is_active) {
    progress = Math.min((baseTotal / giftOffer.threshold) * 100, 100)
    amountLeft = Math.max(giftOffer.threshold - baseTotal, 0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transform-gpu will-change-transform"
          />

          {/* Sliding Drawer */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col transform-gpu will-change-transform"
          >
            {/* Header */}
            <div className="flex flex-col p-6 border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <ShoppingBag className="w-5 h-5 text-brand" /> Your Bag
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-900" />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden">
                  <X className="w-5 h-5 text-gray-900" />
                </button>
              </div>

              {/* Progress Bar */}
              {giftOffer?.is_active && (
                <div className="bg-pink-50 p-3 rounded-xl border border-pink-100/50">
                  <p className="text-sm text-brandtext font-medium mb-2 text-center">
                    {amountLeft > 0 
                      ? <>Add <span className="font-bold text-brand">₹{amountLeft.toLocaleString('en-IN')}</span> more for a FREE Nail Set! 🎁</>
                      : <>You've unlocked a <span className="font-bold text-brand">FREE Nail Set!</span> 🎁</>
                    }
                  </p>
                  <div className="w-full h-2 bg-pink-200/50 rounded-full overflow-hidden">
                    <motion.div 
                      key={progress}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-brand"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Empty State */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                <p className="text-lg font-bold text-gray-900 mb-2">Your bag is empty</p>
                <p className="text-gray-500 text-sm">Add some gorgeous nails first!</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.nail_shape}-${item.nail_size}`} className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                        <Image
                          src={item.product.image_url || 'https://placehold.co/200x200/f5e6e8/c06b72?text=💅'}
                          alt={item.product.name}
                          fill className="object-cover"
                        />
                        {item.isFreeGift && (
                          <div className="absolute top-0 left-0 w-full bg-brand text-white text-[10px] font-bold text-center py-0.5 uppercase tracking-wide">
                            FREE GIFT
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{item.product.name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5 capitalize">
                              {item.nail_shape} · Size {item.nail_size}
                            </p>
                          </div>
                          {!item.isFreeGift && (
                            <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-red-400 transition-colors p-1">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)} 
                              disabled={item.isFreeGift}
                              className="text-gray-400 hover:text-brand disabled:opacity-30 disabled:hover:text-gray-400"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)} 
                              disabled={item.isFreeGift}
                              className="text-gray-400 hover:text-brand disabled:opacity-30 disabled:hover:text-gray-400"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-bold text-gray-900 text-sm">
                            {item.isFreeGift ? (
                              <span className="text-brand uppercase">Free</span>
                            ) : (
                              `₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer / Checkout Button */}
                <div className="border-t border-gray-100 p-6 bg-white shrink-0">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="font-bold text-lg text-gray-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-center text-gray-400 mb-4">Shipping & taxes calculated at checkout.</p>
                  <button
                    onClick={() => { 
                      onClose(); 
                      if (user) {
                        onCheckout();
                      } else {
                        router.push('/login');
                      }
                    }}
                    className="w-full py-4 bg-gray-900 text-white rounded-full font-bold text-base hover:bg-brand active:scale-95 transition-all shadow-xl"
                  >
                    CHECKOUT — ₹{totalPrice.toLocaleString('en-IN')}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
