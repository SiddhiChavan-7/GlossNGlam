'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Product } from '@/lib/types'

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, nail_shape: string, nail_size: string) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  giftOffer: { is_active: boolean; threshold: number; product: Product | null } | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [giftOffer, setGiftOffer] = useState<{is_active: boolean; threshold: number; product: Product | null} | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('glossnails-cart')
    if (stored) setItems(JSON.parse(stored))

    // Fetch global offer settings via API (no more direct Supabase)
    fetch('/api/settings')
      .then(r => r.json())
      .then(({ settings }) => {
        const offer = settings?.find((s: any) => s.key === 'free_gift_offer')?.value
        if (offer?.is_active && offer.product_id) {
          fetch(`/api/products`)
            .then(r => r.json())
            .then((products: Product[]) => {
              const product = products.find((p: Product) => p.id === offer.product_id) || null
              if (product) {
                setGiftOffer({ is_active: true, threshold: offer.threshold, product })
              }
            })
            .catch(() => {})
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('glossnails-cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product, nail_shape: string, nail_size: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.nail_shape === nail_shape && i.nail_size === nail_size)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.nail_shape === nail_shape && i.nail_size === nail_size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { product, quantity: 1, nail_shape, nail_size }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i))
  }

  const clearCart = () => setItems([])

  const baseTotalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const baseTotalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  const validForGift = giftOffer?.is_active && baseTotalPrice >= giftOffer.threshold
  const displayItems = [...items]

  if (validForGift && giftOffer.product) {
    displayItems.push({
      product: { ...giftOffer.product, price: 0 },
      quantity: 1,
      nail_shape: 'Standard (Almond)',
      nail_size: 'M',
      isFreeGift: true
    })
  }

  const totalItems = displayItems.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = displayItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items: displayItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, giftOffer }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
