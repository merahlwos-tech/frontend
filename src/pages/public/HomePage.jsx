import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Plus } from 'lucide-react'
import api from '../../utils/api'

/* ══════════════════════════════════════════════════════
   BRANCHE FLORALE — exactement comme le design :
   tige qui part à gauche en courbe descendante,
   petites feuilles ovales de chaque côté,
   grande fleur 4 pétales au centre,
   petit bouton floral à droite
══════════════════════════════════════════════════════ */
function FloralBranch() {
  return (
    <svg width="105" height="28" viewBox="0 0 130 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tige principale — courbe douce qui descend légèrement */}
      <path d="M4 14 C16 14 26 17 40 18 C54 19 68 16 82 17 C94 17 108 15 126 16"
            stroke="#C4A8CC" strokeWidth="1.1" fill="none" strokeLinecap="round"/>

      {/* === Feuilles gauche === */}
      {/* Feuille haut-gauche */}
      <path d="M18 14 C19 10 24 8 25 11 C23 14 19 15 18 14Z"
            fill="none" stroke="#C4A8CC" strokeWidth="0.85" strokeLinejoin="round"/>
      {/* Feuille bas-gauche */}
      <path d="M22 17 C23 21 28 22 28 19 C26 16 22 16 22 17Z"
            fill="none" stroke="#C4A8CC" strokeWidth="0.85" strokeLinejoin="round"/>

      {/* === Grande fleur centrale 4 pétales === */}
      {/* Pétale haut */}
      <path d="M68 17 C68 13 70 10 72 10 C74 10 76 13 76 17"
            fill="none" stroke="#C4A8CC" strokeWidth="0.9" strokeLinecap="round"/>
      {/* Pétale bas */}
      <path d="M68 17 C68 21 70 24 72 24 C74 24 76 21 76 17"
            fill="none" stroke="#C4A8CC" strokeWidth="0.9" strokeLinecap="round"/>
      {/* Pétale gauche */}
      <path d="M72 17 C68 17 65 15 65 13 C65 11 68 10 72 10"
            fill="none" stroke="#C4A8CC" strokeWidth="0.9" strokeLinecap="round"/>
      {/* Pétale droit */}
      <path d="M72 17 C76 17 79 15 79 13 C79 11 76 10 72 10"
            fill="none" stroke="#C4A8CC" strokeWidth="0.9" strokeLinecap="round"/>
      {/* Centre fleur */}
      <circle cx="72" cy="17" r="2.2" fill="none" stroke="#C4A8CC" strokeWidth="0.9"/>
      <circle cx="72" cy="17" r="1"   fill="#C4A8CC"/>

      {/* === Feuilles milieu droite de la fleur === */}
      {/* Feuille haut-droite fleur */}
      <path d="M80 15 C82 11 87 10 87 13 C85 16 80 16 80 15Z"
            fill="none" stroke="#C4A8CC" strokeWidth="0.85" strokeLinejoin="round"/>
      {/* Feuille bas-droite fleur */}
      <path d="M80 19 C82 23 87 23 87 20 C85 17 80 18 80 19Z"
            fill="none" stroke="#C4A8CC" strokeWidth="0.85" strokeLinejoin="round"/>

      {/* === Petit bouton floral droite === */}
      {/* Tige courte bouton */}
      <path d="M108 16 C109 13 111 11 113 10"
            stroke="#C4A8CC" strokeWidth="0.85" fill="none" strokeLinecap="round"/>
      {/* Pétale gauche bouton */}
      <path d="M113 10 C111 8 110 6 112 5 C114 5 115 7 113 10Z"
            fill="none" stroke="#C4A8CC" strokeWidth="0.85" strokeLinejoin="round"/>
      {/* Pétale droit bouton */}
      <path d="M113 10 C115 8 116 6 118 6 C120 7 119 9 113 10Z"
            fill="none" stroke="#C4A8CC" strokeWidth="0.85" strokeLinejoin="round"/>
      {/* Feuilles bouton */}
      <path d="M109 14 C107 12 105 13 106 15 C107 16 109 15 109 14Z"
            fill="none" stroke="#C4A8CC" strokeWidth="0.8" strokeLinejoin="round"/>
      <path d="M111 16 C113 18 115 17 114 15 C113 14 111 15 111 16Z"
            fill="none" stroke="#C4A8CC" strokeWidth="0.8" strokeLinejoin="round"/>
    </svg>
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