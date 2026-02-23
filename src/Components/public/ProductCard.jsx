import { Link } from 'react-router-dom'
import { Heart, Star, Plus } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import toast from 'react-hot-toast'

function ProductCard({ product }) {
  const { toggle, isWished } = useWishlist()
  const liked = isWished(product._id)

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

  return (
    <Link to={`/products/${product._id}`}
      className="block group"
      style={{
        background: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(155,95,192,0.09)',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(155,95,192,0.18)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(155,95,192,0.09)'
      }}>

      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: '#F8F3FC' }}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: liked ? 'rgba(232,160,180,0.95)' : 'rgba(255,255,255,0.90)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
          }}>
          <Heart
            size={15}
            style={{
              fill: liked ? 'white' : 'none',
              color: liked ? 'white' : '#C4B0D8',
              strokeWidth: 2,
              transition: 'all 0.2s',
            }}
          />
        </button>

        {/* Badge catégorie */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: catStyle.bg, color: catStyle.color }}>
            {product.category}
          </span>
        </div>

        {/* Rating */}
        <div
          className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-2 py-0.5"
          style={{ background: 'rgba(255,255,255,0.88)' }}>
          <Star size={9} style={{ fill: '#FBBF24', color: '#FBBF24' }} />
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#2D2340' }}>{rating}</span>
          <span style={{ fontSize: '10px', color: '#B8A8C8' }}>({reviews})</span>
        </div>
      </div>

      {/* Infos */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontSize: '11px', color: '#B8A8C8', marginBottom: 3 }}>{product.brand}</p>
        <h3
          className="line-clamp-2"
          style={{ fontSize: '13px', fontWeight: 700, color: '#2D2340', lineHeight: 1.35, marginBottom: 10, minHeight: 36 }}>
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#2D2340' }}>
            ${(product.price ?? 0).toFixed(2)}
          </span>
          <button
            onClick={(e) => e.preventDefault()}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{ background: '#9B5FC0' }}>
            <Plus size={14} color="white" />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard