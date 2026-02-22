import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Plus } from 'lucide-react'
import api from '../../utils/api'

const CATEGORIES = [
  {
    label: 'Skincare',
    img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop&q=80',
    ring: 'ring-tb-pink',
    bg: 'bg-tb-pink-soft',
  },
  {
    label: 'Makeup',
    img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200&h=200&fit=crop&q=80',
    ring: 'ring-orange-200',
    bg: 'bg-orange-50',
  },
  {
    label: 'Body Care',
    img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f35f?w=200&h=200&fit=crop&q=80',
    ring: 'ring-tb-lavender',
    bg: 'bg-tb-lav-soft',
  },
  {
    label: 'Hair Care',
    img: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=200&h=200&fit=crop&q=80',
    ring: 'ring-tb-mint',
    bg: 'bg-tb-mint-soft',
  },
]

function ProductMini({ product }) {
  const [liked, setLiked] = useState(false)
  const imageUrl = product.images?.[0] || '/placeholder.jpg'
  const rating   = product.rating  || (4 + Math.random()).toFixed(1)
  const reviews  = product.reviews || Math.floor(40 + Math.random() * 30)

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5 block relative flex-shrink-0 w-44"
    >
      <div className="relative aspect-square bg-tb-pink-soft overflow-hidden">
        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
          className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart size={13} className={liked ? 'fill-tb-pink-deep text-tb-pink-deep' : 'text-tb-text-light'} />
        </button>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-1.5 py-0.5">
          <Star size={9} className="text-amber-400 fill-amber-400" />
          <span className="text-[9px] font-body font-bold text-tb-text">{rating}</span>
          <span className="text-[9px] font-body text-tb-text-light">({reviews})</span>
        </div>
      </div>
      <div className="p-3">
        <p className="font-body font-semibold text-tb-text text-xs leading-tight mb-0.5 line-clamp-2">
          {product.name}
        </p>
        <p className="font-body text-tb-text-light text-[10px] mb-2">{product.brand}</p>
        <div className="flex items-center justify-between">
          <span className="font-body font-bold text-tb-text text-sm">
            ${(product.price ?? 0).toFixed(2)}
          </span>
          <button
            onClick={(e) => e.preventDefault()}
            className="w-6 h-6 bg-tb-purple rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <Plus size={12} className="text-white" />
          </button>
        </div>
      </div>
    </Link>
  )
}

function SectionHeader({ title, to }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h2 className="font-body font-bold text-tb-text text-base">{title}</h2>
        <span
          className="text-tb-text-light text-xs"
          style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}
        >
          ~~~~
        </span>
      </div>
      <Link to={to} className="font-body text-tb-green text-xs font-semibold hover:opacity-70">
        See All
      </Link>
    </div>
  )
}

function HomePage() {
  const [trending, setTrending] = useState([])
  const [arrivals, setArrivals] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/products')
      .then((res) => {
        const all = res.data || []
        setTrending(all.slice(0, 6))
        setArrivals(all.slice(0, 6).reverse())
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const skeleton = (
    <div className="flex gap-3 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-44 flex-shrink-0 bg-white rounded-3xl h-52 animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#FDF0F4 0%,#F5F0FC 50%,#EEF9F5 100%)' }}>

      {/* ── Hero Banner ─ photo uploadée ──── */}
      <section className="max-w-md mx-auto px-4 pt-4 pb-2 animate-fade-up">
        <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: 190 }}>
          {/* L'image que l'utilisateur a uploadée */}
          <img
            src="/hero-banner.jpg"
            alt="Tinkerbells New Collection"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Overlay dégradé léger pour le texte */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(140,100,200,0.72) 0%, rgba(140,100,200,0.35) 55%, rgba(140,100,200,0) 100%)' }}
          />
          {/* Texte */}
          <div className="relative z-10 p-5 pb-5">
            <p className="font-body text-white/80 text-[10px] tracking-widest uppercase mb-1">
              New Collection
            </p>
            <p
              style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1.1 }}
              className="text-white mb-2"
            >
              Fairy Glow
            </p>
            <p className="font-body text-white/85 text-[11px] leading-relaxed mb-3 max-w-[52%]">
              Japanese essences infused with morning dew magic.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 bg-white text-tb-text font-body font-semibold text-xs rounded-full px-4 py-2 hover:shadow-pink transition-all"
            >
              Shop Now →
            </Link>
          </div>
          <span className="absolute top-3 right-5 text-yellow-200 text-lg animate-float z-10">✦</span>
        </div>
      </section>

      {/* ── Shop by Magic ─────────────────── */}
      <section className="max-w-md mx-auto px-4 py-5 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-tb-lav-deep text-sm">✦</span>
            <h2 className="font-body font-bold text-tb-text text-base">Shop by Magic</h2>
            <span className="text-tb-text-light text-xs" style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>~~~~</span>
          </div>
          <Link to="/products" className="font-body text-tb-green text-xs font-semibold hover:opacity-70">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map(({ label, img, ring, bg }, i) => (
            <Link
              key={label}
              to={`/products?category=${label}`}
              className="flex flex-col items-center gap-2 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className={`w-16 h-16 ring-2 ring-offset-2 ${ring} ${bg} rounded-full overflow-hidden hover:scale-105 transition-transform shadow-card`}
              >
                <img src={img} alt={label} className="w-full h-full object-cover" />
              </div>
              <span className="font-body text-tb-text-soft text-[11px] font-semibold text-center leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending Now ──────────────────── */}
      <section className="max-w-md mx-auto px-4 py-3 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <SectionHeader title="Trending Now" to="/products" />
        {loading ? skeleton : trending.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {trending.map((p) => <ProductMini key={p._id} product={p} />)}
          </div>
        ) : (
          <p className="text-center font-body text-tb-text-soft text-sm py-6">No products yet 🌸</p>
        )}
      </section>

      {/* ── New Arrivals ──────────────────── */}
      <section className="max-w-md mx-auto px-4 py-3 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <SectionHeader title="New Arrivals" to="/products" />
        {loading ? skeleton : arrivals.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {arrivals.map((p) => <ProductMini key={`a-${p._id}`} product={p} />)}
          </div>
        )}

        {/* ── Banner Clean Japanese Beauty ── */}
        <div
          className="mt-4 rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg,#F5F0FC 0%,#FDF0F4 50%,#EEF9F5 100%)', minHeight: 130 }}
        >
          <div className="p-5 text-center">
            <div className="text-3xl mb-2">🦋</div>
            <p
              style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.4rem', fontWeight: 700 }}
              className="text-tb-text mb-1"
            >
              Clean Japanese Beauty
            </p>
            <p className="font-body text-tb-text-soft text-xs leading-relaxed">
              Curated with love from Tokyo to your doorstep.<br />
              Cruelty-free and magical.
            </p>
          </div>
          <span className="absolute top-3 left-4 text-tb-lav-deep text-xs">✦</span>
          <span className="absolute bottom-3 right-6 text-tb-pink text-sm">✦</span>
        </div>
      </section>

      <div className="h-4" />
    </div>
  )
}

export default HomePage