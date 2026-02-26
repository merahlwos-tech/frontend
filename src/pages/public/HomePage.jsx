import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import api from '../../utils/api'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'
import { useLang } from '../../context/LanguageContext'

const CATEGORIES = [
  { label: 'Skincare',  img: '/images/skincare.png', bg: '#F0F7EE', border: '#C8E0C8' },
  { label: 'Makeup',    img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=160&h=160&fit=crop&q=80', bg: '#FFF3F0', border: '#F0C8C0' },
  { label: 'Body Care', img: '/images/bodycare.png', bg: '#F0EEF7', border: '#C8C0E8' },
  { label: 'Hair Care', img: '/images/haircare.png', bg: '#F0F5EE', border: '#C0D8C0' },
]

function MiniProductCard({ product }) {
  const { addToCart } = useCart()
  const hasSizes = product.sizes?.length > 0
  const stockVal = hasSizes
    ? product.sizes.reduce((s, x) => s + x.stock, 0)
    : (product.stock ?? 0)
  const isOutOfStock = stockVal === 0

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return
    if (hasSizes) {
      window.location.href = `/products/${product._id}`
      return
    }
    addToCart(product, null, 1)
    toast.success('Ajouté au panier ✓', { duration: 1400 })
  }

  return (
    <Link to={`/products/${product._id}`} className="pc-mini-card" style={{ flexShrink: 0, width: 130, textDecoration: 'none', display: 'block' }}>
      <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #F0EDF5', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', aspectRatio: '1/1', background: '#FAFAFA', overflow: 'hidden' }}>
          <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          {isOutOfStock && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#999', background: 'white', padding: '3px 10px', borderRadius: 50, border: '1px solid #EEE' }}>Épuisé</span>
            </div>
          )}
        </div>
        <div style={{ padding: '8px 10px 10px' }}>
          <p style={{ fontSize: '9px', color: '#BBB', marginBottom: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{product.brand}</p>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#1A1A2E', lineHeight: 1.3, marginBottom: 7, minHeight: 28, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#1A1A2E' }}>{(product.price ?? 0).toLocaleString('fr-DZ')} DA</span>
            <button onClick={handleAdd} disabled={isOutOfStock}
              style={{ width: 26, height: 26, borderRadius: '50%', background: isOutOfStock ? '#EEE' : '#1A1A2E', border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={11} color={isOutOfStock ? '#BBB' : 'white'} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

function SectionHeader({ title, to, badge }) {
  const { t } = useLang()
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '16px', fontWeight: 800, color: '#1A1A2E' }}>{title}</span>
        {badge && <span style={{ fontSize: '9px', fontWeight: 700, background: '#FFF0E8', color: '#C46020', padding: '2px 8px', borderRadius: 50 }}>{badge}</span>}
      </div>
      <Link to={to} style={{ fontSize: '12px', color: '#888', textDecoration: 'none', fontWeight: 600 }}>{title === t("section_categories") || true ? t("see_all") : t("see_all")}</Link>
    </div>
  )
}

function HomePage() {
  const { t } = useLang()
  const [trending, setTrending] = useState([])
  const [arrivals, setArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products')
      .then((res) => {
        const all = res.data || []
        // Filtrer les produits épuisés
        const inStock = all.filter(p => {
          const stock = p.sizes?.length > 0
            ? p.sizes.reduce((s, x) => s + x.stock, 0)
            : (p.stock ?? 0)
          return stock > 0
        })
        // Trending = triés par purchaseCount desc (vrais achats)
        const sortedByPurchase = [...inStock].sort((a, b) => (b.purchaseCount ?? 0) - (a.purchaseCount ?? 0))
        setTrending(sortedByPurchase.slice(0, 10))
        // New arrivals = triés par date de création desc
        const sortedByDate = [...inStock].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setArrivals(sortedByDate.slice(0, 10))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const Skeleton = () => (
    <div style={{ display: 'flex', gap: 10, padding: '0 20px', overflow: 'hidden' }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ flexShrink: 0, width: 130, height: 195, background: 'white', borderRadius: 16, animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 16, background: '#F9F8FC' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

      {/* HERO */}
      <section style={{ padding: '16px 16px 20px' }}>
        <div className="pc-hero" style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', height: 240, background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)' }}>
          <img
            src="/images/images.jpg"
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.5 }}
            onError={e => e.target.style.display = 'none'}
          />
          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(10,10,30,0.7) 0%, rgba(10,10,30,0.3) 60%, transparent 100%)' }} />
          {/* Texte */}
          <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', maxWidth: '60%' }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{t('hero_subtitle')}</p>
            <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2rem', fontWeight: 700, color: 'white', lineHeight: 1.05, marginBottom: 8 }}>{t('hero_title')}</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.55, marginBottom: 14 }}>{t('hero_desc')}</p>
            <Link to="/products"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', color: '#1A1A2E', fontWeight: 700, fontSize: '12px', borderRadius: 50, padding: '8px 18px', textDecoration: 'none' }}>
              {t('hero_btn')}
            </Link>
          </div>
        </div>
      </section>

      {/* CATÉGORIES */}
      <section style={{ paddingBottom: 20 }}>
        <SectionHeader title={t("section_categories")} to="/products" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '0 16px' }}>
          {CATEGORIES.map(({ label, img, bg, border }) => (
            <Link key={label} to={`/products?category=${label}`}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
              <div className="pc-category-icon" style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', background: bg, border: `2px solid ${border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <img src={img} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#444', textAlign: 'center' }}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING NOW — basé sur les vrais achats */}
      <section style={{ paddingBottom: 20 }}>
        <SectionHeader title={t("section_trending")} to="/products" badge={t("section_trending_badge")} />
        {loading ? <Skeleton /> : trending.length > 0 ? (
          <div style={{ display: 'flex', gap: 10, padding: '0 20px', overflowX: 'auto', paddingBottom: 4 }}>
            {trending.map(p => <MiniProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '32px 0', color: '#BBB', fontSize: 14 }}>Aucun produit disponible</p>
        )}
      </section>

      {/* NEW ARRIVALS */}
      <section style={{ paddingBottom: 20 }}>
        <SectionHeader title={t("section_arrivals")} to="/products" />
        {!loading && arrivals.length > 0 && (
          <div style={{ display: 'flex', gap: 10, padding: '0 20px', overflowX: 'auto', paddingBottom: 4 }}>
            {arrivals.map(p => <MiniProductCard key={`a-${p._id}`} product={p} />)}
          </div>
        )}
      </section>

      {/* BANNER KOREAN BEAUTY */}
      <section style={{ padding: '0 16px 20px' }}>
        <div style={{ borderRadius: 24, padding: '32px 24px', textAlign: 'center', background: '#1A1A2E', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 12, left: 16, fontSize: 10, color: 'rgba(255,255,255,0.15)' }}>✦</div>
          <div style={{ position: 'absolute', bottom: 12, right: 20, fontSize: 8, color: 'rgba(255,255,255,0.10)' }}>✦</div>
          <p style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>{t('banner_label')}</p>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.6rem', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: 10 }}>{t('banner_title')}</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 20 }}>{t('banner_desc')}</p>
          <Link to="/about"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: 50, padding: '10px 22px', textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: 'Nunito, sans-serif' }}>
            {t('banner_btn')}
          </Link>
        </div>
      </section>

      </div>
      <style>{`
        @keyframes pulse { 0%,100% { opacity: 0.6 } 50% { opacity: 1 } }
        ::-webkit-scrollbar { display: none }
      `}</style>
    </div>
  )
}

export default HomePage