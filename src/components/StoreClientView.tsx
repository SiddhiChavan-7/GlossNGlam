'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/FadeIn'
import ProductModal from './ProductModal'
import CartDrawer from './CartDrawer'
import CheckoutModal from './CheckoutModal'
import VIPInstagramCard from './VIPInstagramCard'
import Interactive3DCard from './animations/Interactive3DCard'
import MagneticButton from './animations/MagneticButton'
import { Truck, ShieldCheck, Sparkles, Instagram, Star, ArrowRight } from 'lucide-react'

export default function StoreClientView({ initialProducts }: { initialProducts: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // Dynamically extract categories from products
  const categoryList = useMemo(() => {
    const list = ['All']
    initialProducts.forEach(p => {
      const name = p.categories?.name
      if (name && !list.some(item => item.toLowerCase() === name.toLowerCase())) {
        list.push(name)
      }
    })
    return list
  }, [initialProducts])

  // Products selected by Admin to appear on Main Page (show_on_home is true or unset)
  const homeProducts = useMemo(() => {
    const onHome = initialProducts.filter(p => p.show_on_home !== false)
    if (activeCategory === 'All') return onHome
    return onHome.filter(
      p => p.categories?.name?.toLowerCase() === activeCategory.toLowerCase()
    )
  }, [initialProducts, activeCategory])

  // Handlers for Drawer states
  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const openCheckout = () => setIsCheckoutOpen(true)
  const closeCheckout = () => setIsCheckoutOpen(false)
  const openProduct = (product: Product) => setActiveProduct(product)
  const closeProduct = () => setActiveProduct(null)

  return (
    <>
      <div className="w-full bg-brand-dark text-white flex overflow-hidden py-2 border-b border-white/10">
        <div className="animate-marquee whitespace-nowrap text-xs font-semibold uppercase tracking-[0.3em]">
          ✨ THE GLOSS COLLECTION ✨ PREMIUM HANDCRAFTED LUXURY ✨ FREE SHIPPING ON ORDERS OVER ₹599 ✨ 
          THE GLOSS COLLECTION ✨ PREMIUM HANDCRAFTED LUXURY ✨ FREE SHIPPING ON ORDERS OVER ₹599 ✨
        </div>
      </div>
      <Navbar onCartClick={openCart} />
      <main className="overflow-hidden">
        {/* Drawers / Modals */}
        <ProductModal isOpen={!!activeProduct} onClose={closeProduct} product={activeProduct} />
        <CartDrawer isOpen={isCartOpen} onClose={closeCart} onCheckout={openCheckout} />
        <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />

        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-light/30 via-white to-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/5 blur-[100px] rounded-full point-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-light/20 blur-[100px] rounded-full point-events-none" />
          
          <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center gap-12 relative z-10">
            <FadeIn direction="up" className="flex-1 text-center">
              <span className="inline-block text-brand font-bold uppercase tracking-[0.2em] mb-4 text-xs">Exquisite Craftsmanship</span>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                Nails that <br /><span className="text-brand italic font-light">define luxury.</span>
              </h1>
              <p className="mt-6 text-gray-500 font-medium text-lg max-w-md mx-auto">
                Experience the ultimate in bespoke press-on nails. Handcrafted perfection for the modern woman.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <MagneticButton>
                  <button onClick={() => {
                    document.getElementById('shop-grid')?.scrollIntoView({ behavior: 'smooth' })
                  }} className="btn-primary px-8">Explore Collection</button>
                </MagneticButton>
                <Link
                  href="/catalog"
                  className="relative group overflow-hidden inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-pink-400/50 hover:border-pink-300 text-[#FAF6F0] font-bold transition-all shadow-md hover:shadow-xl active:scale-95"
                >
                  {/* Richly visible pink leopard pattern */}
                  <span
                    className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                    style={{ backgroundImage: `url('/leopard-pattern.jpg')` }}
                  />
                  {/* Subtle darkening tint so off-white letters are crystal clear */}
                  <span className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/30 to-black/45 group-hover:from-black/35 group-hover:to-black/35 transition-colors pointer-events-none" />

                  {/* Off-white Text & Arrow */}
                  <span className="relative z-10 flex items-center gap-2 tracking-wide text-[#FAF6F0] font-bold drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.85)]">
                    <span>Full Catalog</span>
                    <ArrowRight className="w-4 h-4 text-[#FAF6F0] group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Trust bar */}
        <FadeIn direction="up" delay={0.4}>
          <section className="bg-white border-y border-gray-100 py-6">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { icon: Truck, text: 'Free Shipping over ₹599' },
                { icon: ShieldCheck, text: 'Safe, Reusable Materials' },
                { icon: Sparkles, text: 'Handcrafted Designs' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-2">
                  <item.icon className="w-5 h-5 text-brand" strokeWidth={1.5} />
                  <span className="text-[10px] uppercase font-bold tracking-[0.1em] text-gray-500">{item.text}</span>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Featured Sets Block (Curated by Admin for Main Page) */}
        <section id="shop-grid" className="max-w-6xl mx-auto px-4 py-16">
          <FadeIn direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-light/70 text-brand text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Sets
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Curated Collection
                </h2>
                <p className="text-gray-500 text-sm mt-1.5 max-w-lg">
                  Handcrafted luxury press-on nails selected for our main showcase. Explore all styles in the full catalog.
                </p>
              </div>

              {/* Desktop direct link to full catalog */}
              <Link
                href="/catalog"
                className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-dark transition-colors group shrink-0"
              >
                <span>View Full Catalog ({initialProducts.length}+ Sets)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
            {categoryList.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-brand text-white border-brand shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Grid */}
          <StaggerContainer key={activeCategory} className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {homeProducts.map(product => {
              const shapes = product.nail_shapes || []
              return (
                <StaggerItem key={product.id}>
                  <Interactive3DCard
                    onClick={() => openProduct(product)}
                    className="cursor-pointer group block brutal-card h-full flex flex-col relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-brand/30 hover:shadow-xl transition-all"
                  >
                    <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                      <img 
                        key={product.image_url || product.id}
                        src={product.image_url || 'https://placehold.co/400x500/f5e6e8/c06b72?text=GlossNails'} 
                        alt={product.name} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 transform-gpu will-change-transform"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {!product.in_stock && (
                          <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-wider shadow-sm">
                            Sold Out
                          </span>
                        )}
                        {product.categories?.name && (
                          <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-wider shadow-sm">
                            {product.categories.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 leading-tight text-lg group-hover:text-brand transition-colors">
                          {product.name}
                        </h3>

                        {/* Available shapes */}
                        {shapes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {shapes.slice(0, 3).map(shape => (
                              <span key={shape} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md capitalize font-medium">
                                {shape}
                              </span>
                            ))}
                            {shapes.length > 3 && (
                              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-medium">
                                +{shapes.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <p className="font-bold text-brand text-xl">₹{product.price.toLocaleString('en-IN')}</p>
                        <span className="text-xs font-semibold text-gray-700 bg-gray-50 group-hover:bg-brand group-hover:text-white px-3.5 py-1.5 rounded-xl border border-gray-200 group-hover:border-brand transition-colors">
                          Customize →
                        </span>
                      </div>
                    </div>
                  </Interactive3DCard>
                </StaggerItem>
              )
            })}
            {homeProducts.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500">
                No products currently featured on the main page for this category. Visit our{' '}
                <Link href="/catalog" className="text-brand font-semibold underline">
                  Full Catalog
                </Link>{' '}
                to view all sets.
              </div>
            )}
          </StaggerContainer>
        </section>

        {/* How it works */}
        <section className="bg-gray-50 py-16 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn direction="up">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">How it works</h2>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { step: '1', title: 'Pick your set', desc: 'Browse our curated collections' },
                { step: '2', title: 'Choose shape & size', desc: 'Select from 4 nail shapes' },
                { step: '3', title: 'Place your order', desc: 'Pay securely with UPI or card' },
                { step: '4', title: 'Apply & slay', desc: 'Ships in 4-7 days' },
              ].map(({ step, title, desc }) => (
                <StaggerItem key={step}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-brand/20">{step}</div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
        
        {/* 3D VIP Instagram Card */}
        <FadeIn direction="up">
          <VIPInstagramCard />
        </FadeIn>

        <footer className="relative overflow-hidden py-14 border-t border-pink-900/30 text-stone-200">
          {/* Leopard pattern background */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url('/leopard-pattern.jpg')` }}
          />
          {/* Deep dark luxury tint overlay for perfect contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-[#1a080d]/85 to-black/92 backdrop-blur-[1px] pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm pb-10 border-b border-white/10">
              <div>
                <p className="text-[#FAF6F0] font-bold text-xl tracking-wide mb-3 drop-shadow-sm">
                  Gloss<span className="italic font-light text-pink-300">Nails</span>
                </p>
                <p className="text-stone-300 text-xs leading-relaxed max-w-xs">
                  Handcrafted luxury press-on nails. Salon-grade gel finish, sculpted to order with love.
                </p>
              </div>

              <div>
                <p className="text-[#FAF6F0] font-semibold mb-3 text-xs uppercase tracking-wider text-pink-200">Quick Links</p>
                <div className="flex flex-col gap-2 text-xs">
                  <Link href="/" className="text-stone-300 hover:text-white transition-colors">Home</Link>
                  <Link href="/catalog" className="text-stone-300 hover:text-white transition-colors font-semibold text-pink-300">Full Catalog →</Link>
                  <a href="https://ig.me/m/_glossnglam8" target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-white transition-colors">Instagram DM Sizing</a>
                </div>
              </div>

              <div>
                <p className="text-[#FAF6F0] font-semibold mb-3 text-xs uppercase tracking-wider text-pink-200">Support & Delivery</p>
                <div className="flex flex-col gap-2 text-xs text-stone-300">
                  <span>📦 Shipping: 4-7 Days Across India</span>
                  <span>✨ Prep Kit Included with Every Set</span>
                  <a href="https://ig.me/m/_glossnglam8" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition-colors">
                    DM @_glossnglam8 for Custom Sizing
                  </a>
                </div>
              </div>

              <div>
                <p className="text-[#FAF6F0] font-semibold mb-3 text-xs uppercase tracking-wider text-pink-200">Store Staff</p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FAF6F0] transition-colors text-xs font-medium border border-white/10 w-fit backdrop-blur-sm"
                  >
                    <span>🔐 Admin Portal</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-stone-400">
              <p>© {new Date().getFullYear()} Gloss n Glam. All rights reserved.</p>
              <p className="text-stone-400 text-[11px] tracking-wider uppercase">Bespoke Press-On Nails • Made in India</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
