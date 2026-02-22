import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Plus } from 'lucide-react'

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const imageUrl = product.images?.[0] || '/placeholder.jpg'
  const rating   = product.rating  || (4 + Math.random()).toFixed(1)
  const reviews  = product.reviews || Math.floor(40 + Math.random() * 30)

  const CAT_COLORS = {
    'Skincare':   'bg-tb-pink-soft text-tb-pink-deep',
    'Makeup':     'bg-orange-50 text-orange-400',
    'Body Care':  'bg-tb-lav-soft text-tb-purple',
    'Hair Care':  'bg-tb-mint-soft text-tb-green',
  }
  const catClass = CAT_COLORS[product.category] || 'bg-tb-lav-soft text-tb-purple'

  return (
    <Link to={`/products/${product._id}`}
      className="card-product block group">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-tb-pink-soft overflow-hidden">
        <img src={imageUrl} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy" />
        {/* Wishlist */}
        <button onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full
                     flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
          <Heart size={15} className={liked ? 'fill-tb-pink-deep text-tb-pink-deep' : 'text-tb-text-light'} />
        </button>
        {/* Badge catégorie */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-body font-bold px-2.5 py-1 rounded-full ${catClass}`}>
            {product.category}
          </span>
        </div>
        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1
                        bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5">
          <Star size={10} className="text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-body font-bold text-tb-text">{rating}</span>
          <span className="text-[10px] font-body text-tb-text-light">({reviews})</span>
        </div>
      </div>

      {/* Infos */}
      <div className="p-3">
        <p className="font-body text-tb-text-light text-[11px] mb-0.5">{product.brand}</p>
        <h3 className="font-body font-semibold text-tb-text text-sm leading-snug mb-2
                       group-hover:text-tb-purple transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-body font-bold text-tb-text text-base">
            ${(product.price ?? 0).toFixed(2)}
          </span>
          <button onClick={(e) => e.preventDefault()}
            className="w-7 h-7 bg-tb-purple rounded-full flex items-center justify-center
                       hover:opacity-80 transition-opacity">
            <Plus size={14} className="text-white" />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard