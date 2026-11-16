'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/components/UserContext'
import toast from 'react-hot-toast'
import { Share2, X, Instagram, Camera, Sparkles, Ruler, Star, MessageSquarePlus, CheckCircle2, Image as ImageIcon } from 'lucide-react'
import SizingGuideModal from '@/components/SizingGuideModal'
import NailShapeVisualizer, { NailLengthType } from '@/components/NailShapeVisualizer'
import { Product, ProductReview } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [selectedShape, setSelectedShape] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false)
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (!product) return

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://gloss-n-glam.vercel.app'
    const pathname = typeof window !== 'undefined' && window.location.pathname.includes('catalog') ? '/catalog' : '/'
    const shareUrl = `${origin}${pathname}?product=${product.id}`

    const shareData = {
      title: `${product.name} | Gloss & Glam`,
      text: `Check out ${product.name} (₹${product.price}) handcrafted luxury press-on nails on Gloss & Glam! ✨`,
      url: shareUrl,
    }

    // Try native Web Share API (mobile phones, tablets, supported browsers)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err: any) {
        if (err.name === 'AbortError') return // User cancelled
      }
    }

    // Fallback: Copy direct URL to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        const input = document.createElement('input')
        input.value = shareUrl
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Product link copied! Share with friends ✨', { icon: '🔗' })
    } catch {
      toast.error('Unable to copy link to clipboard.')
    }
  }

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewAuthor, setReviewAuthor] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewPhotoUrl, setReviewPhotoUrl] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null)

  // Reset state and fetch reviews when product opens
  useEffect(() => {
    if (isOpen && product) {
      if (product.nail_shapes?.length) setSelectedShape(product.nail_shapes[0])
      setSelectedSize('')

      setIsLoadingReviews(true)
      fetch(`/api/reviews?productId=${product.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setReviews(data)
        })
        .catch(() => {})
        .finally(() => setIsLoadingReviews(false))
    } else {
      setReviews([])
      setShowReviewForm(false)
    }
  }, [isOpen, product])

  useEffect(() => {
    if (user?.name && !reviewAuthor) {
      setReviewAuthor(user.name)
    }
  }, [user, reviewAuthor])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product?.id) return
    if (!reviewAuthor.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (!reviewComment.trim()) {
      toast.error('Please write a short review')
      return
    }
    setIsSubmittingReview(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          customer_name: reviewAuthor.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
          photo_url: reviewPhotoUrl.trim() || null
        })
      })
      const data = await res.json()
      if (data.success && data.review) {
        setReviews(prev => [data.review, ...prev])
        setReviewComment('')
        setReviewPhotoUrl('')
        setShowReviewForm(false)
        toast.success('Thank you for your review! 💖')
      } else {
        toast.error(data.error || 'Failed to submit review')
      }
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : '5.0'
  const photoReviews = reviews.filter(r => r.photo_url)

  const handleAddToCart = () => {
    if (!product) return
    if (!selectedShape) { toast.error('Please select a nail shape'); return }
    if (!selectedSize) { toast.error('Please select a nail size'); return }
    addToCart(product, selectedShape, selectedSize)
    toast.success('Added to bag! 💅')
    onClose() // Auto close after adding
  }

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transform-gpu will-change-transform"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full h-[90vh] mt-[10vh] md:h-full md:mt-0 md:w-[600px] bg-white rounded-t-3xl md:rounded-none shadow-2xl flex flex-col overflow-hidden transform-gpu will-change-transform"
          >
            {/* Header */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                type="button"
                onClick={handleShare}
                title={copied ? 'Link Copied!' : 'Share this product'}
                aria-label="Share this product"
                className="p-3 bg-white/90 backdrop-blur rounded-full hover:bg-white active:scale-95 shadow transition-all flex items-center justify-center cursor-pointer"
              >
                {copied ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 transition-transform scale-110" />
                ) : (
                  <Share2 className="w-5 h-5 text-gray-700 hover:text-brand transition-colors" />
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                title="Close modal"
                aria-label="Close modal"
                className="p-3 bg-white/90 backdrop-blur rounded-full hover:bg-gray-100 active:scale-95 shadow transition-all cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-32">
              {/* Image Hero Carousel */}
              <div className="relative w-full aspect-square bg-gray-50 flex overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {(product.gallery_urls && product.gallery_urls.length > 0) ? (
                  product.gallery_urls.map((url, idx) => (
                    <div key={idx} className="relative w-full h-full flex-shrink-0 snap-center">
                      <Image
                        src={url}
                        alt={`${product.name} - view ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      {/* Dots indicator (minimalist hack) */}
                      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
                        {product.gallery_urls!.map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50 backdrop-blur-sm'}`} />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative w-full h-full flex-shrink-0 snap-center">
                    <Image
                      src={product.image_url || 'https://placehold.co/600x600/f5e6e8/c06b72?text=GlossNails'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Content Panel */}
              <div className="p-6 md:p-10 flex flex-col gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  {product.categories && (
                    <span className="text-xs text-brand font-medium bg-brand-light px-3 py-1 rounded-full mt-2 inline-block">
                      {product.categories.name}
                    </span>
                  )}
                </div>

                <p className="text-3xl font-bold text-brand">₹{product.price.toLocaleString('en-IN')}</p>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{product.description}</p>

                <div className="text-sm text-gray-500 space-y-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p><span className="font-medium text-gray-700">Shipping:</span> Ships within 4-7 days</p>
                  <p><span className="font-medium text-gray-700">Support:</span> DM on Instagram @_glossnglam8</p>
                </div>

                {/* Nail shape selector */}
                {product.nail_shapes?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2.5 border-t border-gray-100 pt-6">
                      <p className="text-sm font-semibold text-gray-900">Nail Shape</p>
                      <button
                        type="button"
                        onClick={() => setIsVisualizerOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 hover:bg-pink-100 border border-brand/25 text-brand text-xs font-semibold transition-all shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-brand text-brand" />
                        <span>Try on Virtual Hand</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.nail_shapes.map((shape: string) => (
                        <button
                          key={shape}
                          onClick={() => setSelectedShape(shape)}
                          className={`px-4 py-2 rounded-full text-sm transition-all capitalize border ${selectedShape === shape ? 'bg-gray-900 text-white border-gray-900 shadow-xs' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">Nail Size</p>
                      {user?.saved_sizes?.preset && (
                        <button
                          type="button"
                          onClick={() => {
                            const p = user.saved_sizes?.preset
                            if (p) {
                              setSelectedSize(p)
                              if (user.saved_sizes?.preferred_shape && product.nail_shapes?.includes(user.saved_sizes.preferred_shape)) {
                                setSelectedShape(user.saved_sizes.preferred_shape)
                              }
                              toast.success(`Applied your saved profile size (${p})! ✨`)
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-[11px] font-semibold transition-all"
                          title="Click to apply your saved size"
                        >
                          <Ruler className="w-3 h-3 text-purple-600" />
                          <span>Apply Saved ({user.saved_sizes.preset})</span>
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setIsSizingModalOpen(true)}
                      className="text-xs text-brand font-medium hover:underline flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Size Guide (Coin Photo)
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex-shrink-0 rounded-xl text-sm font-medium border transition-all ${selectedSize === size ? 'bg-gray-900 text-white border-gray-900 shadow-xs' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Sizing photo & Instagram DM banner */}
                  <div className="mt-3.5 p-3 bg-gradient-to-r from-pink-50/90 via-rose-50/70 to-pink-50/90 border border-brand/20 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl overflow-hidden relative flex-shrink-0 border border-brand/30 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setIsSizingModalOpen(true)}
                        title="Click to view sizing guide"
                      >
                        <Image src="/size-guide.jpg" alt="Size Guide" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900">Don&apos;t know your size?</p>
                        <p className="text-[11px] text-gray-600">Send 2 photos with a coin on Instagram</p>
                      </div>
                    </div>
                    <a
                      href="https://ig.me/m/_glossnglam8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand hover:opacity-90 text-white rounded-xl text-xs font-medium transition-all shadow-sm shrink-0"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>DM Us</span>
                    </a>
                  </div>
                </div>

                {/* Customer Reviews & Real Hand Photos */}
                <div className="border-t border-gray-100 pt-8 mt-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">⭐ {avgRating}</span>
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(Number(avgRating))
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">
                          ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        100% verified press-on nail wearers
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white hover:bg-brand transition-colors shadow-xs"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                      <span>{showReviewForm ? 'Cancel' : 'Write Review'}</span>
                    </button>
                  </div>

                  {/* Real Hand Photos Gallery Strip */}
                  {photoReviews.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-brand" />
                          <span>Real Customer Hand Gallery</span>
                        </span>
                        <span className="text-gray-400 text-[11px] font-normal">Click to view</span>
                      </div>
                      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                        {photoReviews.map((r, idx) => (
                          <div
                            key={idx}
                            onClick={() => r.photo_url && setActivePreviewImage(r.photo_url)}
                            className="group/photo relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer border border-pink-100 hover:border-brand shadow-2xs hover:shadow-md transition-all"
                          >
                            <img
                              src={r.photo_url!}
                              alt={`Worn by ${r.customer_name}`}
                              className="object-cover w-full h-full group-hover/photo:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-end p-1">
                              <span className="text-[9px] text-white font-medium truncate">
                                {r.customer_name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Write a Review Form */}
                  <AnimatePresence>
                    {showReviewForm && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmitReview}
                        className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4 space-y-3.5 overflow-hidden"
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                          Share Your Experience
                        </h4>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Your Rating
                          </label>
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map(num => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setReviewRating(num)}
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    num <= reviewRating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs font-bold text-gray-700 ml-1">
                              {reviewRating} of 5 Stars
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Your Name
                            </label>
                            <input
                              type="text"
                              value={reviewAuthor}
                              onChange={e => setReviewAuthor(e.target.value)}
                              placeholder="e.g. Priya Sharma"
                              required
                              className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-brand"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Photo URL (Optional)
                            </label>
                            <input
                              type="url"
                              value={reviewPhotoUrl}
                              onChange={e => setReviewPhotoUrl(e.target.value)}
                              placeholder="https://... nail photo"
                              className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-brand"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Review Details
                          </label>
                          <textarea
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                            rows={3}
                            placeholder="How did the nails fit? Loved the shine or durability?"
                            required
                            className="w-full text-xs p-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-brand resize-none"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmittingReview}
                            className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand text-white hover:bg-brand-dark transition-colors shadow-sm disabled:opacity-50"
                          >
                            {isSubmittingReview ? 'Submitting...' : 'Post Review 💖'}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Reviews List */}
                  {isLoadingReviews ? (
                    <div className="py-6 text-center text-xs text-gray-400 animate-pulse">
                      Loading customer reviews...
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="py-8 text-center bg-gray-50 rounded-2xl border border-gray-100 p-6">
                      <p className="text-sm font-semibold text-gray-800">No reviews yet for this set</p>
                      <p className="text-xs text-gray-500 mt-1">Be the first verified customer to share your thoughts!</p>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(true)}
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-brand text-white hover:opacity-90 transition-opacity"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Write the First Review</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map(rev => (
                        <div
                          key={rev.id}
                          className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 text-xs space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-900">{rev.customer_name}</span>
                                {rev.is_verified !== false && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Verified Buyer 💅</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-amber-400 mt-1">
                                {[1, 2, 3, 4, 5].map(st => (
                                  <Star
                                    key={st}
                                    className={`w-3.5 h-3.5 ${
                                      st <= rev.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-[11px] text-gray-400 shrink-0">
                              {rev.created_at
                                ? new Date(rev.created_at).toLocaleDateString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                : 'Recent'}
                            </span>
                          </div>

                          <p className="text-gray-700 leading-relaxed text-xs">{rev.comment}</p>

                          {rev.photo_url && (
                            <div className="pt-2">
                              <div
                                onClick={() => setActivePreviewImage(rev.photo_url!)}
                                className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity shadow-xs"
                              >
                                <img
                                  src={rev.photo_url}
                                  alt="Customer photo"
                                  className="object-cover w-full h-full"
                                />
                                <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded-md">
                                  Worn 💅
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 md:p-6 pb-8 md:pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all shadow-xl ${product.in_stock
                    ? 'bg-gray-900 text-white hover:bg-brand active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed hidden'
                  }`}
              >
                {product.in_stock ? `Add to Bag — ₹${product.price.toLocaleString('en-IN')}` : 'Sold Out'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <SizingGuideModal isOpen={isSizingModalOpen} onClose={() => setIsSizingModalOpen(false)} />
      <NailShapeVisualizer
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
        initialShape={selectedShape}
        productName={product?.name}
        onApply={(shape: string, length: NailLengthType) => {
          setSelectedShape(shape)
          toast.success(`Selected ${shape} shape (${length})! 💅`)
        }}
      />
      {/* Photo Lightbox */}
      <AnimatePresence>
        {activePreviewImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePreviewImage(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl z-10"
            >
              <button
                onClick={() => setActivePreviewImage(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative aspect-square w-full bg-black">
                <img
                  src={activePreviewImage}
                  alt="Customer Hand Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 bg-white text-center">
                <p className="text-xs font-semibold text-gray-800">✨ Verified Customer Wear</p>
                <p className="text-[11px] text-gray-500">Handcrafted press-on nails styled on real hands</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}
