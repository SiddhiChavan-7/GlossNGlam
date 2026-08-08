'use client'
import { useState } from 'react'
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
import { Truck, ShieldCheck, Sparkles, Instagram } from 'lucide-react'

export default function StoreClientView({ initialProducts }: { initialProducts: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const displayedProducts = activeCategory === 'All' 
    ? initialProducts 
    : initialProducts.filter(p => p.categories?.name === activeCategory)

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
              <div className="mt-10 flex gap-4 justify-center">
                <MagneticButton>
                  <button onClick={() => {
                    document.getElementById('shop-grid')?.scrollIntoView({ behavior: 'smooth' })
                  }} className="btn-primary px-10">Explore Collection</button>
                </MagneticButton>
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

        {/* Unified Shop Grid */}
        <section id="shop-grid" className="max-w-6xl mx-auto px-4 py-16">
          <FadeIn direction="up">
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Collection</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {['All', 'Glam', 'Minimal', 'Valentine\'s'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all ${
                      activeCategory === cat ? 'bg-brand text-white border-brand shadow-md' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {displayedProducts.map(product => (
              <StaggerItem key={product.id}>
                <Interactive3DCard
                  onClick={() => openProduct(product)}
                  className="cursor-none group block brutal-card h-full flex flex-col relative"
                >
                  <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden rounded-t-2xl">
                    <img 
                      src={product.image_url || 'https://placehold.co/400x500/f5e6e8/c06b72?text=GlossNails'} 
                      alt={product.name} 
                      loading="lazy"
                      decoding="async"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 transform-gpu will-change-transform"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {!product.in_stock && <span className="bg-black/80 backdrop-blur-md text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full tracking-wider">Sold Out</span>}
                      {product.categories?.name && <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] uppercase font-bold px-3 py-1.5 rounded-full tracking-wider shadow-sm">{product.categories.name}</span>}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white rounded-b-2xl">
                    <h3 className="font-bold text-gray-900 leading-tight text-lg">{product.name}</h3>
                    <p className="font-semibold text-brand mt-2 text-lg">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </Interactive3DCard>
              </StaggerItem>
            ))}
            {displayedProducts.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500">No products found in this category.</div>
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

        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <p className="text-white font-bold text-lg mb-3">GlossNails</p>
              <p className="text-gray-500 text-xs leading-relaxed">Handcrafted press-on nails. Made with love.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-3">Support</p>
              <div className="flex flex-col gap-2">
                <span>Shipping: 4-7 days</span>
                <span>DM on Instagram for queries</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
