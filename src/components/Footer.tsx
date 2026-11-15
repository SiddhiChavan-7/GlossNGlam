'use client'

import Link from 'next/link'
import { Instagram, Mail, ShieldCheck, Truck, Sparkles, Lock, CreditCard } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-neutral-950 text-stone-200 border-t border-pink-900/30">
      {/* Subtle leopard pattern background */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20 mix-blend-luminosity"
        style={{ backgroundImage: `url('/leopard-pattern.jpg')` }}
      />
      {/* Deep luxury gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-[#14080c]/90 to-black/95 pointer-events-none" />

      {/* Trust bar */}
      <div className="relative z-10 border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center justify-center gap-1.5 p-2">
            <Truck className="w-5 h-5 text-pink-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-200">Free Shipping</span>
            <span className="text-[10px] text-stone-400">On all prepaid orders over ₹599</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 p-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-200">Free Prep Kit</span>
            <span className="text-[10px] text-stone-400">Glue, tabs, buffer & pusher included</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 p-2">
            <Lock className="w-5 h-5 text-pink-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-200">100% Secure Checkout</span>
            <span className="text-[10px] text-stone-400">Razorpay 256-Bit SSL Encrypted</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 p-2">
            <ShieldCheck className="w-5 h-5 text-pink-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-200">Handcrafted Gel</span>
            <span className="text-[10px] text-stone-400">Reusable, salon-grade durability</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-wide text-[#FAF6F0]">
                Gloss<span className="italic font-light text-pink-400">Nails</span>
              </span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Bespoke luxury press-on nails. Every set is meticulously sculpted with salon-grade gel, custom-sized to your hands, and delivered across India.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://ig.me/m/_glossnglam8"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-pink-600/30 text-stone-200 hover:text-white flex items-center justify-center transition-all border border-white/10"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:glossnglam8@gmail.com"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-pink-600/30 text-stone-200 hover:text-white flex items-center justify-center transition-all border border-white/10"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-300 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home & Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-white transition-colors text-pink-300 font-medium">
                  Full Catalog & Shapes →
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  My Orders & Sizing Profile
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Luxury" className="hover:text-white transition-colors">
                  Luxury Collection
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Minimalist" className="hover:text-white transition-colors">
                  Everyday Minimalist
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-300 mb-4">
              Policies & Help
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-white transition-colors">
                  Returns & Hygiene Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us & Custom Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Sizing */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-300">
              Need Sizing Help?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Unsure about your measurements? Send 2 photos of your hand with a ₹1 or ₹5 coin next to your fingers. We measure your exact millimeter sizes!
            </p>
            <a
              href="https://ig.me/m/_glossnglam8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-200 hover:text-white text-xs font-semibold transition-all shadow-sm"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>DM @_glossnglam8</span>
            </a>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-[11px] text-stone-500 hover:text-stone-300 transition-colors"
              >
                <span>🔐 Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Gloss n Glam. Handcrafted with love in India.</p>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>UPI • Debit/Credit Cards • NetBanking • Wallets</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-pink-300/80">Razorpay Verified Merchant</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

