'use client'

import Link from 'next/link'
import { Instagram, Mail, ShieldCheck, Truck, Sparkles, Lock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-purple-100/70 bg-gradient-to-b from-[#FFF5F8] via-[#FAF5FF] to-[#F0F7FF] text-gray-700">
      {/* Iridescent Unicorn Ambient Glow Orbs */}
      <div className="absolute -top-24 -left-20 w-80 h-80 bg-pink-300/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-sky-300/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Sleek Minimal Trust Bar */}
      <div className="relative z-10 border-b border-purple-100/60 bg-white/40 backdrop-blur-sm py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-y-2 gap-x-6 md:gap-x-10 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Handcrafted Salon Gel
          </span>
          <span className="hidden sm:inline text-purple-200">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-purple-500" /> Free Shipping Over ₹599
          </span>
          <span className="hidden sm:inline text-purple-200">•</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Complimentary Prep Kit
          </span>
          <span className="hidden sm:inline text-purple-200">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-pink-500" /> Razorpay 256-Bit SSL
          </span>
        </div>
      </div>

      {/* Main Minimal Footer Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 pb-10 border-b border-purple-100/60">
          {/* Brand Info (Cols 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                Gloss<span className="italic font-light bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Nails</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              Bespoke handcrafted luxury press-on nails. Salon-grade gel sculpted to order for flawless, reusable wear delivered across India.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://ig.me/m/_glossnglam8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-pink-600 text-xs font-medium border border-purple-100 shadow-2xs hover:shadow-xs transition-all"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                <span>@_glossnglam8</span>
              </a>
              <a
                href="mailto:glossnglam8@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-purple-600 text-xs font-medium border border-purple-100 shadow-2xs hover:shadow-xs transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-purple-500" />
                <span>Email Us</span>
              </a>
            </div>
          </div>

          {/* Quick Links (Cols 6-8) */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-purple-900/70 mb-3.5">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li>
                <Link href="/catalog" className="hover:text-pink-600 transition-colors font-medium">
                  Full Catalog & Sets →
                </Link>
              </li>
              <li>
                <Link href="/#shop-grid" className="hover:text-pink-600 transition-colors">
                  Curated Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-pink-600 transition-colors">
                  My Orders & Sizing Profile
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-pink-600 transition-colors">
                  Custom Orders & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy Links (Cols 9-12) - Mandatory for Razorpay Live Approval */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-purple-900/70 mb-3.5">
              Policies & Help
            </h4>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-gray-600">
              <li>
                <Link href="/shipping-policy" className="hover:text-pink-600 transition-colors">
                  Shipping (4-7 Days)
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-pink-600 transition-colors">
                  Returns & Hygiene
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-pink-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-pink-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>

            {/* Micro Sizing Note */}
            <div className="mt-4 p-3 rounded-2xl bg-white/70 backdrop-blur-xs border border-purple-100/70 shadow-2xs">
              <p className="text-[11px] font-semibold text-gray-800">
                📏 Free Coin-Sizing Help
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                Send 2 photos of your fingers with a coin on Instagram DM for instant custom mm sizing.
              </p>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p className="text-[11px]">
            © {new Date().getFullYear()} Gloss n Glam. Handcrafted in India with love.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span>UPI • Cards • NetBanking</span>
            <span>•</span>
            <span className="text-gray-500">Razorpay Verified</span>
            <span>•</span>
            <Link href="/admin" className="text-gray-400 hover:text-gray-700 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
