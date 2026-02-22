import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Heart, Plus } from 'lucide-react'
import api from '../../utils/api'

/* ── Catégories style Tinkerbells ─────────────────────── */
const CATEGORIES = [
  { label: 'Skincare',  emoji: '🌸', color: 'bg-tb-pink-soft',  ring: 'ring-tb-pink' },
  { label: 'Makeup',    emoji: '💄', color: 'bg-tb-peach/30',   ring: 'ring-tb-peach' },
  { label: 'Body Care', emoji: '🧴', color: 'bg-tb-lav-soft',   ring: 'ring-tb-lavender' },
  { label: 'Hair Care', emoji: '💆', color: 'bg-tb-mint-soft',  ring: 'ring-tb-mint' },
]

/* ── Étoiles ─────────────────────────────────────────── */
function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={10}
          className={i < count ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

/* ── Carte produit compacte ──────────────────────────── */
function ProductMini({ product }) {
  const [liked, setLiked] = useState(false)
  const imageUrl = product.images?.[0] || '/placeholder.jpg'
  const rating = product.rating || (4 + Math.random()).toFixed(1)
  const reviews = product.reviews || Math.floor(40 + Math.random() * 30)

  return (
    <Link to={`/products/${product._id}`}
      className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-soft-lg
                 transition-all duration-300 hover:-translate-y-0.5 block relative flex-shrink-0 w-44">
      {/* Image */}
      <div className="relative aspect-square bg-tb-pink-soft overflow-hidden">
        <img src={imageUrl} alt={product.name}
          className="w-full h-full object-cover" loading="lazy" />
        {/* Wishlist */}
        <button onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
          className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm
                     rounded-full flex items-center justify-center shadow-sm
                     hover:scale-110 transition-transform">
          <Heart size={13} className={liked ? 'fill-tb-pink-deep text-tb-pink-deep' : 'text-tb-text-light'} />
        </button>
        {/* Rating */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/80
                        backdrop-blur-sm rounded-full px-1.5 py-0.5">
          <Star size={9} className="text-amber-400 fill-amber-400" />
          <span className="text-[9px] font-body font-bold text-tb-text">{rating}</span>
          <span className="text-[9px] font-body text-tb-text-light">({reviews})</span>
        </div>
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="font-body font-semibold text-tb-text text-xs leading-tight mb-0.5 line-clamp-2">
          {product.name}
        </p>
        <p className="font-body text-tb-text-light text-[10px] mb-2">{product.brand}</p>
        <div className="flex items-center justify-between">
          <span className="font-body font-bold text-tb-text text-sm">
            ${(product.price ?? 0).toFixed(2)}
          </span>
          <button onClick={(e) => e.preventDefault()}
            className="w-6 h-6 bg-tb-purple rounded-full flex items-center justify-center
                       hover:opacity-80 transition-opacity">
            <Plus size={12} className="text-white" />
          </button>
        </div>
      </div>
    </Link>
  )
}

/* ── Page principale ─────────────────────────────────── */
function HomePage() {
  const [products, setProducts]         = useState([])
  const [trending, setTrending]         = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    api.get('/products')
      .then((res) => {
        const all = res.data || []
        setProducts(all.slice(0, 8))
        setTrending(all.slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen" style={{background:'linear-gradient(160deg,#FDF0F4 0%,#F5F0FC 50%,#EEF9F5 100%)'}}>

      {/* ── Hero Banner ───────────────────────── */}
      <section className="max-w-md mx-auto px-4 pt-4 pb-2 animate-fade-up">
        <div className="relative rounded-3xl overflow-hidden"
             style={{background:'linear-gradient(135deg, #C8B5E8 0%, #E8D0F0 40%, #F0C8A8 100%)', minHeight:180}}>
          {/* Contenu */}
          <div className="p-5 pb-4 z-10 relative">
            <p className="font-body text-white/80 text-[10px] tracking-widest uppercase mb-1">
              New Collection
            </p>
            <p style={{fontFamily:'Dancing Script, cursive', fontSize:'1.75rem', fontWeight:700, lineHeight:1.1}}
               className="text-white mb-1.5">
              Fairy Glow
            </p>
            <p className="font-body text-white/80 text-xs leading-relaxed mb-3 max-w-[55%]">
              Japanese essences infused with morning dew magic.
            </p>
            <Link to="/products"
              className="inline-flex items-center gap-1.5 bg-white text-tb-text
                         font-body font-semibold text-xs rounded-full px-4 py-2
                         hover:shadow-pink transition-all">
              Shop Now →
            </Link>
          </div>
          {/* Déco florale */}
          <div className="absolute right-0 top-0 bottom-0 w-2/5 flex items-center justify-center opacity-20">
            <span style={{fontSize:'6rem'}}>🌸</span>
          </div>
          {/* Étoiles déco */}
          <span className="absolute top-3 right-4 text-yellow-300 text-xl animate-float">✦</span>
          <span className="absolute bottom-4 right-12 text-white/50 text-xs">✦</span>
        </div>
      </section>

      {/* ── Shop by Magic (Catégories) ─────────── */}
      <section className="max-w-md mx-auto px-4 py-5 animate-fade-up" style={{animationDelay:'80ms'}}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-tb-lav-deep text-sm">✦</span>
            <h2 className="font-body font-bold text-tb-text text-base">Shop by Magic</h2>
            <span className="text-tb-text-light text-xs" style={{fontFamily:'Georgia,serif',fontStyle:'italic'}}>
              ~~~~
            </span>
          </div>
          <Link to="/products" className="font-body text-tb-green text-xs font-semibold hover:opacity-70">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map(({ label, emoji, color, ring }, i) => (
            <Link key={label} to={`/products?category=${label}`}
              className="flex flex-col items-center gap-2 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`w-16 h-16 ${color} ring-2 ring-offset-1 ${ring}
                               rounded-full flex items-center justify-center
                               hover:scale-105 transition-transform shadow-card`}>
                <span style={{fontSize:'1.5rem'}}>{emoji}</span>
              </div>
              <span className="font-body text-tb-text-soft text-[11px] font-semibold text-center">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending Now ──────────────────────── */}
      <section className="max-w-md mx-auto px-4 py-3 animate-fade-up" style={{animationDelay:'140ms'}}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-body font-bold text-tb-text text-base">Trending Now</h2>
            <span className="text-tb-text-light text-xs" style={{fontFamily:'Georgia,serif',fontStyle:'italic'}}>
              ~~~~
            </span>
          </div>
          <Link to="/products" className="font-body text-tb-green text-xs font-semibold hover:opacity-70">
            See All
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-3 overflow-hidden">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-44 flex-shrink-0 bg-white rounded-3xl h-52 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {products.map((product) => (
              <ProductMini key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl">🌸</span>
            <p className="font-body text-tb-text-soft text-sm mt-2">No products yet</p>
          </div>
        )}
      </section>

      {/* ── Trending Now 2 + Banner Clean Beauty ─ */}
      <section className="max-w-md mx-auto px-4 py-3 animate-fade-up" style={{animationDelay:'200ms'}}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-body font-bold text-tb-text text-base">Trending Now</h2>
            <span className="text-tb-text-light text-xs" style={{fontFamily:'Georgia,serif',fontStyle:'italic'}}>
              ~~~~
            </span>
          </div>
          <Link to="/products" className="font-body text-tb-green text-xs font-semibold hover:opacity-70">
            See All
          </Link>
        </div>

        {!loading && trending.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {trending.map((product) => (
              <ProductMini key={`t-${product._id}`} product={product} />
            ))}
          </div>
        )}

        {/* ── Banner Clean Japanese Beauty ──── */}
        <div className="mt-4 rounded-3xl overflow-hidden relative"
             style={{background:'linear-gradient(135deg,#F5F0FC 0%,#FDF0F4 50%,#EEF9F5 100%)', minHeight:130}}>
          <div className="p-5 text-center">
            <div className="text-3xl mb-2">🦋</div>
            <p style={{fontFamily:'Dancing Script, cursive', fontSize:'1.4rem', fontWeight:700}}
               className="text-tb-text mb-1">
              Clean Japanese Beauty
            </p>
            <p className="font-body text-tb-text-soft text-xs leading-relaxed">
              Curated with love from Tokyo to your doorstep.<br/>
              Cruelty-free and magical.
            </p>
          </div>
          {/* Étoiles déco */}
          <span className="absolute top-3 left-4 text-tb-lav-deep text-xs">✦</span>
          <span className="absolute bottom-3 right-6 text-tb-pink text-sm">✦</span>
        </div>
      </section>

      {/* Spacer bas */}
      <div className="h-4" />
    </div>
  )
}

export default HomePage