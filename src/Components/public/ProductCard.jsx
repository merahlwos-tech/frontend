import { Link } from 'react-router-dom'
import { Heart, Star, ShoppingBag } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

function ProductCard({ product }) {
  const { toggle, isWished } = useWishlist()
  const { addToCart, cartItems } = useCart()
  const liked = isWished(product._id)

  // Compteur d'achats dans le panier actuel
  const cartQty = cartItems?.reduce((acc, item) => {
    return item._id === product._id || item.product?._id === product._id
      ? acc + (item.quantity || 1) : acc
  }, 0) || 0

  const imageUrl = product.images?.[0] || '/placeholder.jpg'
  const rating   = product.rating  || (4 + Math.random()).toFixed(1)
  const reviews  = product.reviews || Math.floor(40 + Math.random() * 30)

  const CAT_COLORS = {
    'Skincare':  { bg: '#FFE8EF', color: '#C4607A' },
    'Makeup':    { bg: '#FFF0E8', color: '#C46020' },
    'Body Care': { bg: '#EBE0FF', color: '#7B3FA0' },
    'Hair Care': { bg: '#D6FFEE', color: '#2A8A60' },
  }
  const catStyle = CAT_COLORS[product.category] || { bg: '#EBE0FF', color: '#7B3FA0' }

  const handleWishlist = (e) => {
    e.preventDefault()
    const wasLiked = isWished(product._id)
    toggle(product)
    if (!wasLiked) toast.success('💜 Ajouté à ta wishlist !', { duration: 2000 })
    else toast('🤍 Retiré de ta wishlist', { duration: 1500 })
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product, null, 1)
    toast.success(`🛍️ Ajouté au panier !`, { duration: 1800 })
  }

  return (
    <Link to={`/products/${product._id}`}
      className="block group"
      style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(155,95,192,0.08)', transition: 'all 0.3s ease', textDecoration: 'none' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(155,95,192,0.16)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(155,95,192,0.08)' }}>

      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', background: '#F8F3FC' }}>
        <img src={imageUrl} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy" />

        {/* Wishlist */}
        <button onClick={handleWishlist}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ background: liked ? 'rgba(232,160,180,0.95)' : 'rgba(255,255,255,0.90)', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }}>
          <Heart size={12} style={{ fill: liked ? 'white' : 'none', color: liked ? 'white' : '#C4B0D8', strokeWidth: 2 }} />
        </button>

        {/* Badge catégorie */}
        <div className="absolute top-2 left-2">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: catStyle.bg, color: catStyle.color }}>
            {product.category}
          </span>
        </div>

        {/* Compteur panier */}
        {cartQty > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full px-1.5 py-0.5"
            style={{ background: '#9B5FC0' }}>
            <ShoppingBag size={8} color="white" />
            <span style={{ fontSize: '9px', fontWeight: 800, color: 'white' }}>{cartQty}</span>
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-full px-1.5 py-0.5"
          style={{ background: 'rgba(255,255,255,0.88)' }}>
          <Star size={8} style={{ fill: '#FBBF24', color: '#FBBF24' }} />
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#2D2340' }}>{rating}</span>
        </div>
      </div>

      {/* Infos */}
      <div style={{ padding: '8px 10px 10px' }}>
        <p style={{ fontSize: '10px', color: '#B8A8C8', marginBottom: 2 }}>{product.brand}</p>
        <h3 className="line-clamp-2"
          style={{ fontSize: '11px', fontWeight: 700, color: '#2D2340', lineHeight: 1.3, marginBottom: 7, minHeight: 28 }}>
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#2D2340' }}>
            {(product.price ?? 0).toFixed(0)} DA
          </span>
          <button onClick={handleAddToCart}
            className="flex items-center gap-1 rounded-full px-2 py-1 hover:opacity-80 transition-opacity"
            style={{ background: '#9B5FC0' }}>
            <ShoppingBag size={10} color="white" />
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'white' }}>Ajouter</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard