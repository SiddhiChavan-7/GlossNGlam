'use client'
import Link from 'next/link'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/components/UserContext'
import { useState } from 'react'

export default function Navbar({ onCartClick }: { onCartClick?: () => void }) {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-brand tracking-wide">
          Gloss<span className="italic font-light">Nails</span>
        </Link>

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
          {user && <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-brand">My Dashboard</Link>}
          <button onClick={() => { setMenuOpen(false); onCartClick && onCartClick(); }} className="text-left py-2 border-b border-gray-50">Cart ({totalItems})</button>
        </div>
      )}
    </nav>
  )
}
