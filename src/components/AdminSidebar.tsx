'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  LogOut,
  Settings,
  Menu,
  X,
  ExternalLink
} from 'lucide-react'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products & Stock', icon: Package },
  { href: '/admin/orders', label: 'Customer Orders', icon: ShoppingBag },
  { href: '/admin/catalog', label: 'Catalog Poster', icon: Tag },
  { href: '/admin/settings', label: 'Store Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const logout = () => {
    localStorage.removeItem('admin-auth')
    router.push('/admin/login')
  }

  const currentLabel = links.find(l => l.href === pathname)?.label || 'Admin Portal'

  return (
    <>
      {/* ==================================================== */}
      {/* 1. MOBILE TOP BAR (Visible on mobile phones < md)     */}
      {/* ==================================================== */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-gray-800 text-gray-200 hover:text-white hover:bg-gray-700 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-brand" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">GlossNails</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand/20 text-brand border border-brand/30">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">{currentLabel}</p>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium border border-gray-700 transition-colors"
        >
          <span>Store</span>
          <ExternalLink className="w-3 h-3 text-gray-400" />
        </Link>
      </header>

      {/* ==================================================== */}
      {/* 2. MOBILE DRAWER SLIDE-OVER (Mobile overlay navigation) */}
      {/* ==================================================== */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-out Panel */}
          <aside className="relative w-72 max-w-[85vw] bg-gray-900 text-white flex flex-col h-full border-r border-gray-800 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-5 border-b border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-brand">GlossNails</p>
                <p className="text-xs text-gray-400 mt-0.5">Mobile Admin Panel</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
              {links.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand text-white shadow-md shadow-brand/20 font-semibold'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-800 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <span>View Customer Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 w-full transition-colors border border-red-900/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. DESKTOP PERMANENT SIDEBAR (Hidden on mobile < md)  */}
      {/* ==================================================== */}
      <aside className="hidden md:flex md:w-60 md:min-h-screen bg-gray-900 text-white flex-col border-r border-gray-800 shrink-0">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin/dashboard" className="inline-block">
            <span className="text-xl font-bold text-brand tracking-wide">GlossNails</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand/20 text-brand border border-brand/30">
                Admin
              </span>
              <span className="text-xs text-gray-400">Control Panel</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1.5">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand text-white shadow-md shadow-brand/20 font-semibold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-gray-800 hover:text-white w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
