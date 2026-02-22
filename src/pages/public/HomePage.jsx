import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Plus } from 'lucide-react'
import api from '../../utils/api'

/* ── Catégories avec vraies photos Unsplash ──────────── */
const CATEGORIES = [
  {
    label: 'Skincare',
    img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=160&h=160&fit=crop&q=80',
    bg: 'rgba(255,220,235,0.6)',
    border: '#F9C8D4',
  },
  {
    label: 'Makeup',
    img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=160&h=160&fit=crop&q=80',
    bg: 'rgba(200,160,230,0.55)',
    border: '#C9ADE8',
  },
  {
    label: 'Body Care',
    img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f35f?w=160&h=160&fit=crop&q=80',
    bg: 'rgba(180,215,230,0.55)',
    border: '#A8D8E8',
  },
  {
    label: 'Hair Care',
    img: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=160&h=160&fit=crop&q=80',
    bg: 'rgba(160,210,200,0.55)',
    border: '#C8EDE0',
  },
]

/* ── Carte produit ───────────────────────────────────── */
function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const img     = product.images?.[0] || '/placeholder.jpg'
  const rating  = product.rating  || (4 + Math.random()).toFixed(1)
  const reviews = product.reviews || Math.floor(40 + Math.random() * 30)

  return (
    <Link to={`/products/${product._id}`}
      className="flex-shrink-0 block"
      style={{ width: 155 }}>
      <div className="rounded-3xl overflow-hidden"
           style={{ background: 'white', boxShadow: '0 2px 16px rgba(155,95,192,0.09)' }}>
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', background: '#FDF5F8' }}>
          <img src={img} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          {/* Cœur */}
          <button onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.85)' }}>
            <Heart size={14}
              style={{ fill: liked ? '#E8A0B4' : 'none', color: liked ? '#E8A0B4' : '#C4B0D8', strokeWidth: 2 }} />
          </button>
          {/* Rating */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5"
               style={{ background: 'rgba(255,255,255,0.85)' }}>
            <Star size={9} style={{ fill: '#FBBF24', color: '#FBBF24' }} />
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#2D2340' }}>{rating}</span>
            <span style={{ fontSize: '9px', color: '#B8A8C8' }}>({reviews})</span>
          </div>
        </div>
        {/* Infos */}
        <div className="p-3">
          <p style={{ fontSize: '11px', color: '#B8A8C8', marginBottom: 2 }}>{product.brand}</p>
          <p className="font-body font-semibold line-clamp-2"
             style={{ fontSize: '12px', color: '#2D2340', lineHeight: 1.3, marginBottom: 8, minHeight: 30 }}>
            {product.name}
          </p>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#2D2340' }}>
              ${(product.price ?? 0).toFixed(2)}
            </span>
            <button onClick={(e) => e.preventDefault()}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: '#9B5FC0' }}>
              <Plus size={14} color="white" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

function SectionTitle({ title, to }) {
  return (
    <div className="flex items-center justify-between mb-4 px-5">
      <div className="flex items-center gap-2">
        <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '18px', fontWeight: 800, color: '#2D2340' }}>
          {title}
        </span>
        {/* Branche florale décorative */}
        <svg width="60" height="18" viewBox="0 0 80 20" fill="none" style={{ opacity: 0.4 }}>
          <path d="M2 10 Q20 2 40 10 Q60 18 78 10" stroke="#9B8FA8" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M15 10 Q20 5 25 8" stroke="#9B8FA8" strokeWidth="1" fill="none" strokeLinecap="round"/>
          <path d="M40 10 Q45 4 50 7" stroke="#9B8FA8" strokeWidth="1" fill="none" strokeLinecap="round"/>
          <path d="M60 10 Q65 15 70 12" stroke="#9B8FA8" strokeWidth="1" fill="none" strokeLinecap="round"/>
          <circle cx="25" cy="7" r="1.5" fill="#C9ADE8" opacity="0.6"/>
          <circle cx="50" cy="6" r="1.5" fill="#C9ADE8" opacity="0.6"/>
          <circle cx="70" cy="11" r="1.5" fill="#C9ADE8" opacity="0.6"/>
        </svg>
      </div>
      <Link to={to}
        style={{ fontSize: '13px', fontWeight: 600, color: '#7B6B8A' }}
        className="hover:text-tb-purple transition-colors">
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
        setTrending(all.slice(0, 8))
        setArrivals([...all].reverse().slice(0, 8))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const SkeletonRow = () => (
    <div className="flex gap-3 px-5 overflow-hidden">
      {[1,2,3].map(i => (
        <div key={i} className="flex-shrink-0 rounded-3xl bg-white/60 animate-pulse" style={{ width: 155, height: 220 }} />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen pb-4"
         style={{ background: 'linear-gradient(160deg, #FFF0F6 0%, #F5EEFF 45%, #EEF9F5 100%)' }}>

      {/* ── Hero Banner ─────────────────────── */}
      <section className="px-5 pt-5 pb-2 animate-fade-up">
        <div className="relative rounded-3xl overflow-hidden" style={{ height: 230 }}>
          {/* Photo uploadée */}
          <img src="/hero-banner.jpg" alt="Fairy Glow"
               className="absolute inset-0 w-full h-full object-cover object-center" />
          {/* Overlay gauche pour le texte */}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(100deg, rgba(120,80,180,0.68) 0%, rgba(120,80,180,0.38) 55%, transparent 100%)' }} />
          {/* Texte */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-center" style={{ maxWidth: '58%' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
              New Collection
            </p>
            <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2rem', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: 8 }}>
              Fairy Glow
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, marginBottom: 16 }}>
              Japanese essences infused with morning dew magic.
            </p>
            <Link to="/products"
              className="inline-flex items-center gap-2"
              style={{ background: 'white', color: '#2D2340', fontWeight: 700, fontSize: '13px', borderRadius: 50, padding: '10px 20px', width: 'fit-content', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
              Shop Now →
            </Link>
          </div>
          {/* Étoile déco */}
          <span className="absolute top-5 right-6 text-yellow-200 text-2xl animate-float" style={{ zIndex: 10 }}>✦</span>
        </div>
      </section>

      {/* ── Shop by Magic ───────────────────── */}
      <section className="pt-5 pb-3 animate-fade-up" style={{ animationDelay: '80ms' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-5">
          <div className="flex items-center gap-2">
            {/* Petite étoile rose */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12M3 3l8 8M11 3l-8 8" stroke="#E8A0B4" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#2D2340' }}>Shop by Magic</span>
            {/* Branche florale */}
            <svg width="70" height="18" viewBox="0 0 90 20" fill="none" style={{ opacity: 0.4 }}>
              <path d="M2 10 Q25 2 45 10 Q65 18 88 10" stroke="#9B8FA8" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              <path d="M20 10 Q25 4 30 7" stroke="#9B8FA8" strokeWidth="1" fill="none" strokeLinecap="round"/>
              <path d="M45 10 Q50 3 55 6" stroke="#9B8FA8" strokeWidth="1" fill="none" strokeLinecap="round"/>
              <path d="M68 10 Q73 16 78 13" stroke="#9B8FA8" strokeWidth="1" fill="none" strokeLinecap="round"/>
              <circle cx="30" cy="7" r="1.5" fill="#C9ADE8" opacity="0.7"/>
              <circle cx="55" cy="6" r="1.5" fill="#F9C8D4" opacity="0.7"/>
              <circle cx="78" cy="12" r="1.5" fill="#C9ADE8" opacity="0.7"/>
            </svg>
          </div>
          <Link to="/products" style={{ fontSize: '13px', fontWeight: 600, color: '#7B6B8A' }}>See All</Link>
        </div>

        {/* Cercles catégories */}
        <div className="grid grid-cols-4 gap-2 px-5">
          {CATEGORIES.map(({ label, img, bg, border }, i) => (
            <Link key={label} to={`/products?category=${label}`}
              className="flex flex-col items-center gap-2 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="rounded-full overflow-hidden"
                   style={{ width: 72, height: 72, background: bg, border: `2.5px solid ${border}`, boxShadow: '0 2px 12px rgba(155,95,192,0.12)' }}>
                <img src={img} alt={label} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#5A4A6A', textAlign: 'center' }}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending Now ────────────────────── */}
      <section className="py-3 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <SectionTitle title="Trending Now" to="/products" />
        {loading ? <SkeletonRow /> : trending.length > 0 ? (
          <div className="flex gap-3 px-5 overflow-x-auto pb-2 scrollbar-hide">
            {trending.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <p className="text-center text-sm py-6" style={{ color: '#B8A8C8' }}>No products yet 🌸</p>
        )}
      </section>

      {/* ── New Arrivals ────────────────────── */}
      <section className="py-3 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <SectionTitle title="New Arrivals" to="/products" />
        {loading ? <SkeletonRow /> : arrivals.length > 0 && (
          <div className="flex gap-3 px-5 overflow-x-auto pb-2 scrollbar-hide">
            {arrivals.map(p => <ProductCard key={`a-${p._id}`} product={p} />)}
          </div>
        )}

        {/* Banner Clean Japanese Beauty */}
        <div className="mx-5 mt-4 rounded-3xl overflow-hidden relative py-8 px-6 text-center"
             style={{ background: 'linear-gradient(135deg, #F0EAFF 0%, #FFE8F0 50%, #E8F8F0 100%)', minHeight: 160 }}>
          <span className="absolute top-3 left-5 text-xs" style={{ color: '#C9ADE8' }}>✦</span>
          <span className="absolute bottom-3 right-7 text-sm" style={{ color: '#F9C8D4' }}>✦</span>
          {/* Lotus icon */}
          <div className="text-3xl mb-2">🪷</div>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.5rem', fontWeight: 700, color: '#5A4A6A' }} className="mb-2">
            Clean Japanese Beauty
          </p>
          <p style={{ fontSize: '13px', color: '#8B7A9B', lineHeight: 1.6 }}>
            Curated with love from Tokyo to your doorstep.<br />
            Cruelty-free and magical.
          </p>
        </div>
      </section>
    </div>
  )
}

export default HomePage