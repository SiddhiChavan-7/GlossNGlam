'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import toast from 'react-hot-toast'

interface WishlistContextType {
  wishlist: string[]
  isWishlisted: (id: string) => boolean
  toggleWishlist: (id: string, name?: string) => void
  clearWishlist: () => void
  totalWishlist: number
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  isWishlisted: () => false,
  toggleWishlist: () => {},
  clearWishlist: () => {},
  totalWishlist: 0,
})

const STORAGE_KEY = 'gng_wishlist_ids'

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setWishlist(JSON.parse(saved))
      }
    } catch {}
    setIsLoaded(true)
  }, [])

  const persist = (ids: string[]) => {
    setWishlist(ids)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {}
  }

  const isWishlisted = (id: string) => {
    return wishlist.includes(id)
  }

  const toggleWishlist = (id: string, name?: string) => {
    if (wishlist.includes(id)) {
      const next = wishlist.filter(item => item !== id)
      persist(next)
      toast.success(name ? `Removed ${name} from Wishlist` : 'Removed from Wishlist')
    } else {
      const next = [...wishlist, id]
      persist(next)
      toast.success(name ? `Saved ${name} to Wishlist! ❤️` : 'Saved to Wishlist! ❤️')
    }
  }

  const clearWishlist = () => {
    persist([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        toggleWishlist,
        clearWishlist,
        totalWishlist: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)

