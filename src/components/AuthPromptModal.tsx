'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/UserContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Gift, Ruler, Truck, X, ArrowRight } from 'lucide-react'

const PROMPT_DELAY_MS = 35000 // 35 seconds of browsing
const SNOOZE_HOURS = 24 // Don't show again for 24 hours if dismissed
const STORAGE_KEY = 'gng_vip_prompt_dismissed_until'

export default function AuthPromptModal() {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 1. Don't show if user is logged in or auth is still resolving
    if (loading || user) return

    // 2. Don't show on auth or admin pages
    if (
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/order-success')
    ) {
      return
    }

    // 3. Check if user dismissed recently
    try {
      const dismissedUntil = localStorage.getItem(STORAGE_KEY)
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        return
      }
    } catch {
      // localStorage may fail in private mode; continue gracefully
    }

    // 4. Start browsing timer
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, PROMPT_DELAY_MS)

    return () => clearTimeout(timer)
  }, [user, loading, pathname])

  const dismissPrompt = () => {
    setIsOpen(false)
    try {
      const snoozedUntil = Date.now() + SNOOZE_HOURS * 60 * 60 * 1000
      localStorage.setItem(STORAGE_KEY, snoozedUntil.toString())
    } catch {}
  }

  const handleNavigate = (path: string) => {
    dismissPrompt()
    router.push(path)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={dismissPrompt}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 z-10"
          >
            {/* Top decorative pink glow */}
            <div className="h-2 bg-gradient-to-r from-brand via-pink-400 to-brand" />

            {/* Close button */}
            <button
              onClick={dismissPrompt}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-7">
              {/* VIP Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200/60 text-brand text-[11px] font-bold tracking-wider uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 fill-brand text-brand" />
                <span>Gloss VIP Club</span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-snug">
                Unlock <span className="text-brand">10% OFF</span> & Save Your Custom Sizing
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                Join our VIP Club for 1-click checkout, saved nail sizing measurements, and private drop access.
              </p>

              {/* Perks List */}
              <div className="my-5 space-y-2.5 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-pink-100/70 text-brand flex items-center justify-center shrink-0 mt-0.5">
                    <Gift className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">10% OFF Your First Set</p>
                    <p className="text-[11px] text-gray-500">Use welcome promo code <span className="font-mono font-bold text-brand">GLOSS10</span> at checkout</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Ruler className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Save Your Custom Nail Sizing</p>
                    <p className="text-[11px] text-gray-500">Measure once with our coin guide & never measure again</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Live Order Tracking</p>
                    <p className="text-[11px] text-gray-500">Track shipping & manage orders in your private dashboard</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => handleNavigate('/register')}
                  className="w-full h-12 bg-brand hover:bg-brand/90 transition-all text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand/25 active:scale-[0.99]"
                >
                  <span>Create Free Account (10% OFF)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    onClick={() => handleNavigate('/login')}
                    className="text-gray-600 hover:text-brand font-medium transition-colors"
                  >
                    Already a member? <span className="underline font-semibold text-gray-900">Log In</span>
                  </button>

                  <button
                    onClick={dismissPrompt}
                    className="text-gray-400 hover:text-gray-600 font-medium transition-colors"
                  >
                    Continue as guest
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
