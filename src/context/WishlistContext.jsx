import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('tb_wishlist')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('tb_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const toggle = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p._id === product._id)
      if (exists) return prev.filter((p) => p._id !== product._id)
      return [...prev, product]
    })
  }

  const isWished = (id) => wishlist.some((p) => p._id === id)

  const remove = (id) => setWishlist((prev) => prev.filter((p) => p._id !== id))

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWished, remove, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}