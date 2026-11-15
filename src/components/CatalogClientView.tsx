'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProductModal from './ProductModal'
import CartDrawer from './CartDrawer'
import CheckoutModal from './CheckoutModal'
import WishlistDrawer from './WishlistDrawer'
import SizingGuideModal from './SizingGuideModal'
import Footer from '@/components/Footer'
import { Product, Category } from '@/lib/types'
import { COLOR_FAMILIES, matchesSearchWithColorIntelligence, filterProductsByColorFamily } from '@/lib/colors'
import { useWishlist } from '@/context/WishlistContext'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/FadeIn'
import {
  Search,
  X,
  Camera,
  Instagram,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  Heart
} from 'lucide-react'

const NAIL_SHAPES = ['almond', 'coffin', 'square', 'stiletto', 'oval', 'round']

interface CatalogClientViewProps {
  initialProducts: Product[]
  categories: Category[]
}

export default function CatalogClientView({ initialProducts, categories }: CatalogClientViewProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  // Modals
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false)
  const { isWishlisted, toggleWishlist } = useWishlist()

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'All')
  const [selectedShape, setSelectedShape] = useState<string>('All')
  const [selectedColor, setSelectedColor] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest')
  const [inStockOnly, setInStockOnly] = useState(false)

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  // Category list
  const categoryList = useMemo(() => {
    const list = ['All']
    categories.forEach(c => {
      if (c.name && !list.some(item => item.toLowerCase() === c.name.toLowerCase())) {
        list.push(c.name)
      }
    })
    initialProducts.forEach(p => {
      const name = p.categories?.name
      if (name && !list.some(item => item.toLowerCase() === name.toLowerCase())) {
        list.push(name)
      }
    })
    return list
  }, [categories, initialProducts])

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts]

    // 1. Intelligent color & text search
    if (searchQuery.trim()) {
      result = result.filter(p => matchesSearchWithColorIntelligence(p, searchQuery))
    }

    // 2. Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        p => p.categories?.name?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // 3. Shape filter
    if (selectedShape !== 'All') {
      result = result.filter(p =>
        Array.isArray(p.nail_shapes) &&
        p.nail_shapes.map(s => s.toLowerCase()).includes(selectedShape.toLowerCase())
      )
    }

    // 4. Color family filter
    if (selectedColor !== 'All') {
      result = result.filter(p => filterProductsByColorFamily(p, selectedColor))
    }

    // 5. In-stock only
    if (inStockOnly) {
      result = result.filter(p => p.in_stock)
    }

    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    })

    return result
  }, [initialProducts, searchQuery, selectedCategory, selectedShape, selectedColor, inStockOnly, sortBy])

  const hasFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedShape !== 'All' || selectedColor !== 'All' || inStockOnly

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedShape('All')
    setSelectedColor('All')
    setInStockOnly(false)
    setSortBy('newest')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* Editorial Announcement Bar */}
      <div className="w-full bg-brand-dark text-white/90 text-center py-2 px-4 text-[11px] font-medium tracking-[0.2em] uppercase border-b border-white/10">
        ✨ Complimentary Salon Prep Kit With Every Order • Free Shipping Over ₹599
      </div>

      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
      />

      {/* Modals */}
      <ProductModal isOpen={!!activeProduct} onClose={() => setActiveProduct(null)} product={activeProduct} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => setIsCheckoutOpen(true)} />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={initialProducts}
        onSelectProduct={(p) => setActiveProduct(p)}
      />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <SizingGuideModal isOpen={isSizingModalOpen} onClose={() => setIsSizingModalOpen(false)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Clean, Unified Filter & Search Bar */}
        <section className="mb-8 border-b border-gray-100 pb-6">
          {/* Row 1: Categories Bar */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto pb-4 scrollbar-none">
            {categoryList.map(cat => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    active
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Row 2: Secondary Controls (Shape, Search, Sort, Sizing Pill) */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Shape Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mr-1 shrink-0">
                Shape:
              </span>
              <button
                onClick={() => setSelectedShape('All')}
                className={`px-3 py-1 rounded-full text-xs capitalize transition-colors shrink-0 ${
                  selectedShape === 'All'
                    ? 'bg-brand/10 text-brand font-semibold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                All
              </button>
              {NAIL_SHAPES.map(shape => {
                const active = selectedShape.toLowerCase() === shape.toLowerCase()
                return (
                  <button
                    key={shape}
                    onClick={() => setSelectedShape(active ? 'All' : shape)}
                    className={`px-3 py-1 rounded-full text-xs capitalize transition-colors shrink-0 ${
                      active
                        ? 'bg-brand/10 text-brand font-semibold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {shape}
                  </button>
                )
              })}
            </div>

            {/* Right: Search + Sort + Sizing Guide */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Search input */}
              <div className="relative flex-1 md:w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sets..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-gray-50 text-xs text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 pr-6 appearance-none cursor-pointer focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Coin Sizing Link */}
              <button
                onClick={() => setIsSizingModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-brand transition-colors shrink-0 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-brand/40 bg-white"
                title="View Indian Coin Sizing Guide"
              >
                <Camera className="w-3.5 h-3.5 text-brand" />
                <span>Coin Sizing</span>
              </button>
            </div>
          </div>

          {/* Row 3: Visual Color Swatches Filter */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mr-1 shrink-0">
              Color:
            </span>
            <button
              onClick={() => setSelectedColor('All')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                selectedColor === 'All'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              All Colors
            </button>
            {COLOR_FAMILIES.map(c => {
              const isActive = selectedColor.toLowerCase() === c.id.toLowerCase()
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(isActive ? 'All' : c.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 border ${
                    isActive
                      ? 'border-gray-900 bg-gray-900 text-white shadow-xs'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
                  }`}
                  title={`Filter by ${c.name}`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              )
            })}
          </div>

          {/* Active filter count & reset */}
          {hasFilters && (
            <div className="mt-3 pt-2 flex items-center justify-between text-xs text-gray-500">
              <span>
                Filtered: <strong className="text-gray-900">{filteredProducts.length}</strong> sets
                {selectedCategory !== 'All' && <span> in {selectedCategory}</span>}
                {selectedShape !== 'All' && <span> • {selectedShape}</span>}
                {selectedColor !== 'All' && <span> • {COLOR_FAMILIES.find(c => c.id === selectedColor)?.name || selectedColor}</span>}
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-brand hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Minimal, High-Impact Product Grid */}
        <StaggerContainer
          key={`${selectedCategory}-${selectedShape}-${selectedColor}-${sortBy}-${inStockOnly}-${searchQuery}`}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10"
        >
          {filteredProducts.map(product => {
            const shapes = product.nail_shapes || []
            return (
              <StaggerItem key={product.id}>
                <div
                  onClick={() => setActiveProduct(product)}
                  className="group cursor-pointer flex flex-col h-full"
                >
                  {/* Image container */}
                  <div className="relative aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden mb-3.5 transition-shadow group-hover:shadow-lg">
                    <img
                      key={product.image_url || product.id}
                      src={product.image_url || 'https://placehold.co/400x500/f5e6e8/c06b72?text=GlossNails'}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out transform-gpu will-change-transform"
                    />

                    {/* Subtle badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      {!product.in_stock && (
                        <span className="bg-black/80 backdrop-blur-md text-white text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider">
                          Sold Out
                        </span>
                      )}
                      {product.categories?.name && (
                        <span className="bg-white/90 backdrop-blur-md text-gray-800 text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider shadow-2xs">
                          {product.categories.name}
                        </span>
                      )}
                    </div>

                    {/* Wishlist Heart Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(product.id, product.name)
                      }}
                      aria-label="Save to Wishlist"
                      className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-md group/heart border border-pink-100"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isWishlisted(product.id)
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-gray-600 group-hover/heart:text-rose-500'
                        }`}
                      />
                    </button>

                    {/* Quick view button appearing on hover */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                      <div className="w-full py-2.5 bg-white/95 backdrop-blur-md text-gray-900 text-xs font-semibold rounded-xl text-center shadow-md hover:bg-white transition-colors">
                        Select Shape & Size
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      {/* Available shapes & colors preview */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        {shapes.length > 0 ? (
                          <p className="text-[10px] text-gray-400 capitalize font-medium tracking-wide">
                            {shapes.slice(0, 3).join(' • ')}
                            {shapes.length > 3 ? ` • +${shapes.length - 3}` : ''}
                          </p>
                        ) : <span />}
                        {product.colors && product.colors.length > 0 && (
                          <div className="flex items-center gap-1 shrink-0">
                            {product.colors.slice(0, 3).map(colorId => {
                              const family = COLOR_FAMILIES.find(f => f.id === colorId)
                              return (
                                <span
                                  key={colorId}
                                  className="w-2 h-2 rounded-full border border-gray-300"
                                  style={{ backgroundColor: family?.hex || '#ccc' }}
                                  title={family?.name || colorId}
                                />
                              )
                            })}
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-brand transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>

                    <div className="mt-1.5 flex items-baseline justify-between">
                      <span className="text-sm md:text-base font-semibold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-brand font-medium md:hidden">
                        Customize →
                      </span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-base text-gray-600 mb-2 font-medium">No sets match your selection.</p>
            <p className="text-xs text-gray-400 mb-6">Try clearing your search query or shape filter.</p>
            <button
              onClick={resetFilters}
              className="px-5 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Minimal Bespoke & Sizing Bottom Section */}
        <section className="mt-20 pt-10 border-t border-gray-100">
          <div className="bg-neutral-50 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand block mb-1">
                Bespoke Atelier
              </span>
              <h3 className="text-xl md:text-2xl font-light text-gray-900">
                Want a custom design or need help with sizing?
              </h3>
              <p className="text-xs md:text-sm text-gray-500 mt-2 leading-relaxed">
                Send us your Pinterest inspiration photo or 2 photos next to an Indian coin directly on Instagram. We handcraft custom sets made to fit your exact measurements.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsSizingModalOpen(true)}
                className="px-4 py-2.5 bg-white text-gray-800 rounded-xl text-xs font-semibold border border-gray-200 hover:border-gray-300 transition-colors"
              >
                View Coin Guide
              </button>
              <a
                href="https://ig.me/m/_glossnglam8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>DM on Instagram</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
