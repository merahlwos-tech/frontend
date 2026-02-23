import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Plus } from 'lucide-react'
import api from '../../utils/api'

/* ══════════════════════════════════════════════════════
   BRANCHE FLORALE — image exacte encodée en base64
══════════════════════════════════════════════════════ */
function FloralBranch() {
  return (
    <img
      src="data:image/png;base64,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"
      alt=""
      style={{ width: 110, height: 32, objectFit: 'contain', opacity: 0.85 }}
    />
  )
}

/* ══════════════════════════════════════════════════════
   ICÔNE +✦ exacte du design
══════════════════════════════════════════════════════ */
function MagicStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8h12" stroke="#E8A0B4" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="#E8A0B4" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  )
}

/* ══════════════════════════════════════════════════════
   CATÉGORIES
══════════════════════════════════════════════════════ */
const CATEGORIES = [
  { label: 'Skincare',  img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=160&h=160&fit=crop&q=80', bg: '#FFE8EF', border: '#F9C8D4' },
  { label: 'Makeup',    img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=160&h=160&fit=crop&q=80', bg: '#EBE0FF', border: '#C9ADE8' },
  { label: 'Body Care', img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f35f?w=160&h=160&fit=crop&q=80', bg: '#9B5FC0', border: '#7B3FA0' },
  { label: 'Hair Care', img: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=160&h=160&fit=crop&q=80', bg: '#C8EDE0', border: '#A0D8C8' },
]

/* ══════════════════════════════════════════════════════
   CARTE PRODUIT
══════════════════════════════════════════════════════ */
function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const img     = product.images?.[0] || '/placeholder.jpg'
  const rating  = product.rating  || (4 + Math.random()).toFixed(1)
  const reviews = product.reviews || Math.floor(40 + Math.random() * 30)

  return (
    <Link to={`/products/${product._id}`} className="flex-shrink-0 block" style={{ width: 128 }}>
      <div style={{ background: 'white', borderRadius: 18, boxShadow: '0 2px 12px rgba(155,95,192,0.09)', overflow: 'hidden' }}>
        <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', background: '#F8F3FC' }}>
          <img src={img} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          <button onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.88)' }}>
            <Heart size={12} style={{ fill: liked ? '#E8A0B4' : 'none', color: liked ? '#E8A0B4' : '#C4B0D8', strokeWidth: 2 }} />
          </button>
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 rounded-full px-1.5 py-0.5"
               style={{ background: 'rgba(255,255,255,0.88)' }}>
            <Star size={8} style={{ fill: '#FBBF24', color: '#FBBF24' }} />
            <span style={{ fontSize: '8px', fontWeight: 700, color: '#2D2340' }}>{rating}</span>
            <span style={{ fontSize: '8px', color: '#B8A8C8' }}>({reviews})</span>
          </div>
        </div>
        <div style={{ padding: '8px 10px 10px' }}>
          <p style={{ fontSize: '10px', color: '#B8A8C8', marginBottom: 2 }}>{product.brand}</p>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#2D2340', lineHeight: 1.3, marginBottom: 6, minHeight: 28 }}
             className="line-clamp-2">{product.name}</p>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#2D2340' }}>
              ${(product.price ?? 0).toFixed(2)}
            </span>
            <button onClick={(e) => e.preventDefault()}
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: '#9B5FC0' }}>
              <Plus size={12} color="white" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ══════════════════════════════════════════════════════
   EN-TÊTE DE SECTION
══════════════════════════════════════════════════════ */
function SectionHeader({ title, to }) {
  return (
    <div className="flex items-center justify-between mb-3 px-5">
      <div className="flex items-center gap-2">
        <span style={{ fontSize: '18px', fontWeight: 900, color: '#2D2340' }}>{title}</span>
        <FloralBranch />
      </div>
      <Link to={to} style={{ fontSize: '13px', fontWeight: 600, color: '#8B7A9B' }}
            className="hover:opacity-70 flex-shrink-0">See All</Link>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   PAGE HOME
══════════════════════════════════════════════════════ */
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

  const Skeleton = () => (
    <div className="flex gap-2.5 px-5 overflow-hidden">
      {[1,2,3,4].map(i => (
        <div key={i} className="flex-shrink-0 animate-pulse"
             style={{ width: 128, height: 195, background: 'rgba(255,255,255,0.7)', borderRadius: 18 }} />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen pb-4" style={{ background: '#FEF0F8' }}>

      {/* ════════════════════════════════════════
          HERO — photo plein container, texte par-dessus
      ════════════════════════════════════════ */}
      <section className="px-4 pt-4 pb-5 animate-fade-up">
        <div className="relative rounded-3xl overflow-hidden" style={{ height: 248 }}>

          {/* Photo plein container — AUCUN texte alternatif visible */}
          <img
            src="/hero-banner.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ display: 'block' }}
            onError={(e) => {
              // Si l'image ne charge pas, fond dégradé de remplacement
              e.target.style.display = 'none'
              e.target.parentElement.style.background =
                'linear-gradient(135deg, #8B6AAE 0%, #B896D4 40%, #C8A87E 80%, #D4B896 100%)'
            }}
          />

          {/* Overlay gauche pour lisibilité du texte */}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(110deg, rgba(80,40,130,0.55) 0%, rgba(80,40,130,0.25) 52%, transparent 100%)' }} />

          {/* Bloc texte glassmorphism — posé par-dessus la photo */}
          <div className="absolute"
               style={{
                 left: 16,
                 top: '50%',
                 transform: 'translateY(-50%)',
                 background: 'rgba(255,255,255,0.13)',
                 backdropFilter: 'blur(10px)',
                 WebkitBackdropFilter: 'blur(10px)',
                 borderRadius: 18,
                 border: '1px solid rgba(255,255,255,0.30)',
                 padding: '16px 18px',
                 maxWidth: '57%',
               }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.80)', marginBottom: 4 }}>
              New Collection
            </p>
            <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2rem', fontWeight: 700, color: 'white', lineHeight: 1.05, marginBottom: 6 }}>
              Fairy Glow
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.55, marginBottom: 13 }}>
              Japanese essences infused<br />with morning dew magic.
            </p>
            <Link to="/products"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'white', color: '#3D2060',
                fontWeight: 700, fontSize: '12px',
                borderRadius: 50, padding: '8px 16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
                whiteSpace: 'nowrap',
              }}>
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SHOP BY MAGIC
      ════════════════════════════════════════ */}
      <section className="pb-5 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center justify-between mb-4 px-5">
          <div className="flex items-center gap-1.5">
            <MagicStar />
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#2D2340' }}>Shop by Magic</span>
            <FloralBranch />
          </div>
          <Link to="/products" style={{ fontSize: '13px', fontWeight: 600, color: '#8B7A9B' }}
                className="hover:opacity-70 flex-shrink-0">See All</Link>
        </div>
        <div className="grid grid-cols-4 gap-1 px-5">
          {CATEGORIES.map(({ label, img, bg, border }, i) => (
            <Link key={label} to={`/products?category=${label}`}
              className="flex flex-col items-center gap-2 animate-fade-up"
              style={{ animationDelay: `${i * 55}ms` }}>
              <div className="rounded-full overflow-hidden"
                   style={{ width: 72, height: 72, background: bg, border: `2.5px solid ${border}`, boxShadow: '0 2px 10px rgba(155,95,192,0.13)' }}>
                <img src={img} alt={label} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#5A4A6A', textAlign: 'center' }}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          TRENDING NOW
      ════════════════════════════════════════ */}
      <section className="pb-4 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <SectionHeader title="Trending Now" to="/products" />
        {loading ? <Skeleton /> : trending.length > 0 ? (
          <div className="flex gap-2.5 px-5 overflow-x-auto pb-2 scrollbar-hide">
            {trending.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <p className="text-center py-8" style={{ color: '#B8A8C8', fontSize: 14 }}>No products yet 🌸</p>
        )}
      </section>

      {/* ════════════════════════════════════════
          NEW ARRIVALS
      ════════════════════════════════════════ */}
      <section className="pb-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <SectionHeader title="New Arrivals" to="/products" />
        {!loading && arrivals.length > 0 && (
          <div className="flex gap-2.5 px-5 overflow-x-auto pb-2 scrollbar-hide">
            {arrivals.map(p => <ProductCard key={`a-${p._id}`} product={p} />)}
          </div>
        )}

        {/* ── Clean Japanese Beauty ── */}
        <div className="mx-5 mt-4 rounded-3xl overflow-hidden relative text-center"
             style={{
               background: 'linear-gradient(135deg, #FFD6E8 0%, #E8D6FF 28%, #D6EEFF 55%, #D6FFE8 78%, #FFF0D6 100%)',
               padding: '32px 20px 28px',
             }}>
          <span className="absolute top-3 left-5" style={{ fontSize: 11, color: '#C9ADE8', opacity: 0.7 }}>✦</span>
          <span className="absolute top-3 right-6" style={{ fontSize: 9, color: '#F9C8D4', opacity: 0.7 }}>✦</span>
          <svg className="mx-auto mb-3" width="34" height="34" viewBox="0 0 36 36" fill="none">
            <path d="M18 30 C18 30 6 22 6 14 C6 9 10 6 14 8 C15.5 8.5 17 10 18 12 C19 10 20.5 8.5 22 8 C26 6 30 9 30 14 C30 22 18 30 18 30Z"
                  fill="#9B5FC0" opacity="0.85"/>
            <path d="M18 30 C18 30 11 24 10 18 C13 19 16 22 18 26 C20 22 23 19 26 18 C25 24 18 30 18 30Z"
                  fill="#7B3FA0" opacity="0.7"/>
            <path d="M18 12 C18 12 16 8 18 5 C20 8 18 12 18 12Z" fill="#C9ADE8"/>
          </svg>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.55rem', fontWeight: 700, color: '#4A3070', lineHeight: 1.1, marginBottom: 8 }}>
            Clean Japanese Beauty
          </p>
          <p style={{ fontSize: '13px', color: '#7A6888', lineHeight: 1.65 }}>
            Curated with love from Tokyo to your doorstep.<br />
            Cruelty-free and magical.
          </p>
        </div>
      </section>
    </div>
  )
}

export default HomePage