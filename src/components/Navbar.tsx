'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X, User, Heart, Sparkles } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/components/UserContext'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar({
  onCartClick,
  onWishlistClick
}: {
  onCartClick?: () => void
  onWishlistClick?: () => void
}) {
  const { totalItems } = useCart()
  const { totalWishlist } = useWishlist()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Brand Logo with Founder Hover Popover */}
        <div
          className="relative group py-2"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <Link href="/" className="text-2xl font-bold text-brand tracking-wide inline-flex items-center gap-1.5">
            <span>Gloss<span className="italic font-light">Nails</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 group-hover:scale-125 transition-transform" />
          </Link>

          {/* Floating Founder Studio Hover Card */}
          <AnimatePresence>
            {isLogoHovered && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="hidden md:block absolute top-full left-0 mt-2 z-50 pointer-events-none"
              >
                <div className="w-60 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-2xl border border-pink-200/80 ring-1 ring-black/5 overflow-hidden">
                  {/* Photo Container */}
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-pink-50">
                    <Image
                      src="/founder.jpg"
                      alt="Founder & Nail Artist - Gloss & Glam"
                      fill
                      className="object-cover object-top"
                    />
                    {/* Top Badge */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide">
                        <Sparkles className="w-3 h-3 text-pink-300" />
                        <span>Handcrafted by Siddhi</span>
                      </span>
                    </div>

                    {/* Bottom Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2.5 text-white">
                      <p className="text-xs font-bold leading-tight">Gloss & Glam Studio</p>
                      <p className="text-[10px] text-pink-200/90 leading-tight">Every set sculpted with love ✨</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 text-sm text-gray-600 font-medium">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <Link href="/catalog" className="hover:text-brand transition-colors font-semibold">Catalog</Link>
          <Link href="/#shop-grid" className="hover:text-brand transition-colors">Best Sellers</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <Link href="/dashboard" className="text-gray-700 font-serif hover:text-brand transition-colors">Hi, {user.name.split(' ')[0]}</Link>
              <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors text-xs uppercase tracking-wider">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-brand transition-colors font-medium">
              <User className="w-5 h-5" />
              <span>Login</span>
            </Link>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={() => onWishlistClick && onWishlistClick()}
            className="relative text-gray-700 hover:text-brand transition-colors p-1"
            title="My Wishlist"
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${totalWishlist > 0 ? 'fill-brand text-brand' : ''}`} />
            {totalWishlist > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {totalWishlist}
              </span>
            )}
          </button>

          <button onClick={() => onCartClick && onCartClick()} className="relative text-gray-800">
            <ShoppingBag className="w-6 h-6 hover:text-brand transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 text-sm font-medium text-gray-700">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/catalog" onClick={() => setMenuOpen(false)} className="text-brand font-semibold">Full Catalog</Link>
          <Link href="/#shop-grid" onClick={() => setMenuOpen(false)}>Best Sellers</Link>
          <button
            onClick={() => {
              setMenuOpen(false)
              onWishlistClick && onWishlistClick()
            }}
            className="text-left py-1 text-gray-700 flex items-center justify-between"
          >
            <span>Wishlist</span>
            <span className="text-xs bg-pink-100 text-brand px-2 py-0.5 rounded-full font-bold">
              {totalWishlist}
            </span>
          </button>
          {user && <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-brand">My Dashboard</Link>}
          <button onClick={() => { setMenuOpen(false); onCartClick && onCartClick(); }} className="text-left py-2 border-b border-gray-50">Cart ({totalItems})</button>
        </div>
      )}
    </nav>
  )
}
