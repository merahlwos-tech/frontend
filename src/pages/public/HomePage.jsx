import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Plus } from 'lucide-react'
import api from '../../utils/api'

/* ── Catégories ───────────────────────────────────────── */
const CATEGORIES = [
  {
    label: 'Skincare',
    img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=160&h=160&fit=crop&q=80',
    bg: '#FFE8EF',
    border: '#F9C8D4',
  },
  {
    label: 'Makeup',
    img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=160&h=160&fit=crop&q=80',
    bg: '#E8DCFF',
    border: '#C9ADE8',
  },
  {
    label: 'Body Care',
    img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f35f?w=160&h=160&fit=crop&q=80',
    bg: '#9B5FC0',
    border: '#7B3FA0',
  },
  {
    label: 'Hair Care',
    img: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=160&h=160&fit=crop&q=80',
    bg: '#C8EDE0',
    border: '#A0D8C8',
  },
]

/* ── Branche florale SVG — exactement comme le design ─── */
function FloralBranch({ width = 90 }) {
  return (
    <svg width={width} height="22" viewBox="0 0 110 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tige principale courbe */}
      <path d="M2 13 C18 13 28 8 40 11 C52 14 62 9 75 11 C85 12 95 10 108 11"
            stroke="#C4A8D0" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Feuille 1 */}
      <path d="M22 11 C24 7 28 6 30 9" stroke="#C4A8D0" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M30 9 C28 11 24 12 22 11" stroke="#C4A8D0" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Feuille 2 */}
      <path d="M48 10 C50 5 55 4 57 8" stroke="#C4A8D0" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M57 8 C55 11 50 12 48 10" stroke="#C4A8D0" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Feuille 3 droite */}
      <path d="M78 10 C80 6 85 5 87 9" stroke="#C4A8D0" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M87 9 C85 12 80 13 78 10" stroke="#C4A8D0" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Petite fleur 1 */}
      <circle cx="30" cy="9" r="2" fill="none" stroke="#D4A8C0" strokeWidth="0.8"/>
      <circle cx="30" cy="9" r="0.8" fill="#D4A8C0"/>
      {/* Petite fleur 2 */}
      <circle cx="57" cy="7" r="2" fill="none" stroke="#D4A8C0" strokeWidth="0.8"/>
      <circle cx="57" cy="7" r="0.8" fill="#D4A8C0"/>
      {/* Petite fleur 3 */}
      <circle cx="87" cy="8" r="2" fill="none" stroke="#D4A8C0" strokeWidth="0.8"/>
      <circle cx="87" cy="8" r="0.8" fill="#D4A8C0"/>
    </svg>
  )
}

/* ── Carte produit ───────────────────────────────────── */
function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const img     = product.images?.[0] || '/placeholder.jpg'
  const rating  = product.rating  || (4 + Math.random()).toFixed(1)
  const reviews = product.reviews || Math.floor(40 + Math.random() * 30)

  return (
    <Link to={`/products/${product._id}`}
      className="flex-shrink-0 block" style={{ width: 150 }}>
      <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 2px 14px rgba(155,95,192,0.09)', overflow: 'hidden' }}>
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', background: '#F8F3FC' }}>
          <img src={img} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          {/* Cœur haut droite */}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.88)' }}>
            <Heart size={14}
              style={{ fill: liked ? '#E8A0B4' : 'none', color: liked ? '#E8A0B4' : '#C4B0D8', strokeWidth: 2 }} />
          </button>
          {/* Rating bas gauche */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5"
               style={{ background: 'rgba(255,255,255,0.88)' }}>
            <Star size={9} style={{ fill: '#FBBF24', color: '#FBBF24' }} />
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#2D2340' }}>{rating}</span>
            <span style={{ fontSize: '9px', color: '#B8A8C8' }}>({reviews})</span>
          </div>
        </div>
        {/* Infos */}
        <div style={{ padding: '10px 12px 12px' }}>
          <p style={{ fontSize: '11px', color: '#B8A8C8', marginBottom: 2 }}>{product.brand}</p>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#2D2340', lineHeight: 1.3, marginBottom: 8, minHeight: 30 }}
             className="line-clamp-2">
            {product.name}
          </p>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#2D2340' }}>
              ${(product.price ?? 0).toFixed(2)}
            </span>
            <button
              onClick={(e) => e.preventDefault()}
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

/* ── Titre de section avec branche florale ───────────── */
function SectionHeader({ title, to }) {
  return (
    <div className="flex items-center justify-between mb-4 px-5">
      <div className="flex items-center gap-2">
        <span style={{ fontSize: '18px', fontWeight: 900, color: '#2D2340', fontFamily: 'Nunito, sans-serif' }}>
          {title}
        </span>
        <FloralBranch width={85} />
      </div>
      <Link to={to} style={{ fontSize: '13px', fontWeight: 600, color: '#8B7A9B' }}
            className="hover:opacity-70 transition-opacity">
        See All
      </Link>
    </div>
  )
}

/* ── Page Home ───────────────────────────────────────── */
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
    <div className="flex gap-3 px-5 overflow-hidden">
      {[1,2,3].map(i => (
        <div key={i} className="flex-shrink-0 animate-pulse"
             style={{ width: 150, height: 220, background: 'rgba(255,255,255,0.6)', borderRadius: 20 }} />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen pb-4"
         style={{ background: 'linear-gradient(160deg, #FFF0F6 0%, #F5EEFF 45%, #EEF9F5 100%)' }}>

      {/* ══════════════════════════════════════════
          HERO BANNER — exactement comme le design
          fond violet/mauve, produit à droite,
          fleurs blanches, texte glassmorphism
      ══════════════════════════════════════════ */}
      <section className="px-4 pt-4 pb-5 animate-fade-up">
        <div className="relative rounded-3xl overflow-hidden"
             style={{
               height: 240,
               background: 'linear-gradient(135deg, #8B6AAE 0%, #B896D4 35%, #C8A87E 70%, #D4B896 100%)'
             }}>

          {/* Fleurs blanches haut droite */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-70"
               style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.35) 0%, transparent 60%)' }} />

          {/* Déco fleurs SVG */}
          <svg className="absolute top-2 right-2" width="120" height="100" viewBox="0 0 120 100" fill="none">
            {/* Grande fleur */}
            <circle cx="90" cy="25" r="18" fill="rgba(255,255,255,0.15)" />
            <circle cx="90" cy="25" r="12" fill="rgba(255,255,255,0.20)" />
            <circle cx="90" cy="25" r="6"  fill="rgba(255,255,255,0.30)" />
            {/* Pétales */}
            {[0,60,120,180,240,300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180
              const x = 90 + Math.cos(rad) * 16
              const y = 25 + Math.sin(rad) * 16
              return <circle key={i} cx={x} cy={y} r="5" fill="rgba(255,255,255,0.25)" />
            })}
            {/* Petite fleur */}
            <circle cx="55" cy="15" r="8"  fill="rgba(255,255,255,0.12)" />
            <circle cx="55" cy="15" r="4"  fill="rgba(255,255,255,0.18)" />
            {/* Étoile scintillante */}
            <text x="105" y="60" fontSize="16" fill="rgba(255,220,100,0.9)">✦</text>
          </svg>

          {/* Bloc texte glassmorphism gauche */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2"
               style={{
                 background: 'rgba(255,255,255,0.12)',
                 backdropFilter: 'blur(8px)',
                 borderRadius: 20,
                 border: '1px solid rgba(255,255,255,0.25)',
                 padding: '18px 20px',
                 maxWidth: '58%',
               }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: 4 }}>
              New Collection
            </p>
            <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.1rem', fontWeight: 700, color: 'white', lineHeight: 1.05, marginBottom: 6 }}>
              Fairy Glow
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.55, marginBottom: 14 }}>
              Japanese essences infused<br />with morning dew magic.
            </p>
            <Link to="/products"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'white', color: '#4A3060',
                fontWeight: 700, fontSize: '13px',
                borderRadius: 50, padding: '9px 18px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
              }}>
              Shop Now →
            </Link>
          </div>

          {/* Produit cosmétique droite */}
          <div className="absolute right-0 bottom-0 top-0 w-2/5 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop&q=85"
              alt="Glow product"
              className="w-full h-full object-cover object-left"
              style={{ opacity: 0.9 }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SHOP BY MAGIC
          +✦ Shop by Magic 〜branche florale〜  See All
      ══════════════════════════════════════════ */}
      <section className="pb-5 animate-fade-up" style={{ animationDelay: '80ms' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-5">
          <div className="flex items-center gap-2">
            {/* Étoile rose exacte du design */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v14M1 8h14M3.5 3.5l9 9M12.5 3.5l-9 9"
                    stroke="#E8A0B4" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#2D2340', fontFamily: 'Nunito, sans-serif' }}>
              Shop by Magic
            </span>
            <FloralBranch width={90} />
          </div>
          <Link to="/products" style={{ fontSize: '13px', fontWeight: 600, color: '#8B7A9B' }}
                className="hover:opacity-70 transition-opacity flex-shrink-0">
            See All
          </Link>
        </div>

        {/* Cercles catégories */}
        <div className="grid grid-cols-4 gap-1 px-5">
          {CATEGORIES.map(({ label, img, bg, border }, i) => (
            <Link key={label} to={`/products?category=${label}`}
              className="flex flex-col items-center gap-2 animate-fade-up"
              style={{ animationDelay: `${i * 55}ms` }}>
              <div className="rounded-full overflow-hidden"
                   style={{
                     width: 72, height: 72,
                     background: bg,
                     border: `2.5px solid ${border}`,
                     boxShadow: '0 2px 12px rgba(155,95,192,0.14)',
                   }}>
                <img src={img} alt={label}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#5A4A6A', textAlign: 'center' }}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRENDING NOW
      ══════════════════════════════════════════ */}
      <section className="pb-4 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <SectionHeader title="Trending Now" to="/products" />
        {loading ? <Skeleton /> : trending.length > 0 ? (
          <div className="flex gap-3 px-5 overflow-x-auto pb-2 scrollbar-hide">
            {trending.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <p className="text-center py-8" style={{ color: '#B8A8C8', fontSize: 14 }}>No products yet 🌸</p>
        )}
      </section>

      {/* ══════════════════════════════════════════
          NEW ARRIVALS
      ══════════════════════════════════════════ */}
      <section className="pb-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <SectionHeader title="New Arrivals" to="/products" />
        {loading ? <Skeleton /> : arrivals.length > 0 && (
          <div className="flex gap-3 px-5 overflow-x-auto pb-2 scrollbar-hide">
            {arrivals.map(p => <ProductCard key={`a-${p._id}`} product={p} />)}
          </div>
        )}

        {/* Banner Clean Japanese Beauty */}
        <div className="mx-5 mt-4 rounded-3xl overflow-hidden relative text-center py-8 px-5"
             style={{ background: 'linear-gradient(135deg, #EDE6FF 0%, #FFE6F2 50%, #E6FFF5 100%)', minHeight: 155 }}>
          <span className="absolute top-3 left-5 text-xs" style={{ color: '#C9ADE8', opacity: 0.8 }}>✦</span>
          <span className="absolute bottom-4 right-7 text-sm" style={{ color: '#F9C8D4', opacity: 0.8 }}>✦</span>
          {/* Lotus */}
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🪷</div>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.55rem', fontWeight: 700, color: '#5A4070' }}>
            Clean Japanese Beauty
          </p>
          <p style={{ fontSize: '13px', color: '#8B7A9B', lineHeight: 1.65, marginTop: 6 }}>
            Curated with love from Tokyo to your doorstep.<br />
            Cruelty-free and magical.
          </p>
        </div>
      </section>
    </div>
  )
}

export default HomePage