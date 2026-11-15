'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X, User, Heart } from 'lucide-react'
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
        {/* Brand Logo with Founder Hover Popover & Mobile Story Ring */}
        <div
          className="relative group py-2 flex items-center gap-2.5"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <Link href="/" className="text-2xl font-bold text-brand tracking-wide inline-flex items-center gap-1.5">
            <span>Gloss<span className="italic font-light">Nails</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 group-hover:scale-125 transition-transform" />
          </Link>

          {/* Luxury Mini Story Avatar (Tap on Mobile, Hover on Desktop) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsLogoHovered(!isLogoHovered)
            }}
            className="relative w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 hover:scale-110 active:scale-95 transition-transform shrink-0 shadow-xs cursor-pointer focus:outline-none"
            title="Meet the Artist (Tap to view)"
            aria-label="Meet the Artist"
          >
            <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
              <Image
                src="/founder.jpg"
                alt="Artist"
                fill
                className="object-cover object-top"
              />
            </div>
            {/* Live pulse indicator dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {/* Desktop Hover Card */}
          <AnimatePresence>
            {isLogoHovered && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="hidden md:block absolute top-full left-0 mt-3 z-50 pointer-events-none"
              >
                <div className="relative aspect-[3/4] w-72 md:w-80 rounded-2xl overflow-hidden shadow-2xl bg-black/5">
                  <Image
                    src="/founder.jpg"
                    alt="Gloss & Glam"
                    fill
                    priority
                    className="object-cover object-top"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Tap Modal (Responsive for Phones) */}
          <AnimatePresence>
            {isLogoHovered && (
              <div
                className="md:hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
                onClick={() => setIsLogoHovered(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 260 }}
                  className="relative aspect-[3/4] w-[82vw] max-w-[320px] rounded-2xl overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src="/founder.jpg"
                    alt="Gloss & Glam"
                    fill
                    priority
                    className="object-cover object-top"
                  />
                  {/* Discreet Mobile Close Button */}
                  <button
                    type="button"
                    onClick={() => setIsLogoHovered(false)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 backdrop-blur-xs"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              </div>
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
          {/* Mobile Artist Story Strip */}
          <div
            onClick={() => {
              setMenuOpen(false)
              setIsLogoHovered(true)
            }}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 cursor-pointer active:scale-98 transition-transform"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-pink-500 to-purple-500 shrink-0">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image src="/founder.jpg" alt="Artist" fill className="object-cover object-top" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-900 leading-tight">Handcrafted by Siddhi ✨</p>
              <p className="text-[11px] text-pink-600 font-medium">Tap to view studio & story →</p>
            </div>
          </div>

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
