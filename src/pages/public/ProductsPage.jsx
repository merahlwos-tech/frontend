import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, X, Heart, Sparkles } from 'lucide-react'
import api from '../../utils/api'
import ProductCard from '../../Components/public/ProductCard'
import { useWishlist } from '../../context/WishlistContext'
import { useLang } from '../../context/LanguageContext'

const CATEGORIES = [
  { label: 'Tous',      emoji: '✨', bg: '#F8F3FC', border: '#C9ADE8' },
  { label: 'Skincare',  emoji: '🌸', bg: '#FFE8EF', border: '#F9C8D4' },
  { label: 'Makeup',    emoji: '💄', bg: '#FFF0E8', border: '#F9D8C4' },
  { label: 'Body Care', emoji: '🛁', bg: '#EBE0FF', border: '#C9ADE8' },
  { label: 'Hair Care', emoji: '💆', bg: '#D6FFEE', border: '#A0D8C4' },
]

const SORT_OPTIONS = (t) => [
  { value: 'default', label: t('sort_default') },
  { value: 'price_asc', label: t('sort_price_asc') },
  { value: 'price_desc', label: t('sort_price_desc') },
  { value: 'name', label: t('sort_name') },
]


function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy]             = useState('default')
  const activeCategory = searchParams.get('category') || 'Tous'
  const { count: wishCount } = useWishlist()
  const { t } = useLang()
  const SORT_OPTIONS_T = [
    { value: 'default', label: t('sort_default') },
    { value: 'price_asc', label: t('sort_price_asc') },
    { value: 'price_desc', label: t('sort_price_desc') },
    { value: 'name', label: t('sort_name') },
  ]

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat    = activeCategory === 'Tous' || p.category === activeCategory
      const matchSearch = !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
    if (sortBy === 'price_asc')  list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    if (sortBy === 'price_desc') list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    if (sortBy === 'name')       list = [...list].sort((a, b) => a.name?.localeCompare(b.name))
    return list
  }, [products, activeCategory, search, sortBy])

  const setCategory = (cat) => {
    if (cat === 'Tous') searchParams.delete('category')
    else searchParams.set('category', cat)
    setSearchParams(searchParams)
  }

  const activeCat = CATEGORIES.find(c => c.label === activeCategory) || CATEGORIES[0]

  const Skeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse" style={{ background: 'white', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ aspectRatio: '3/4', background: '#F0EBF8' }} />
          <div style={{ padding: '12px 14px 14px' }}>
            <div style={{ height: 10, background: '#F0EBF8', borderRadius: 99, width: '40%', marginBottom: 8 }} />
            <div style={{ height: 13, background: '#F0EBF8', borderRadius: 99, width: '80%', marginBottom: 6 }} />
            <div style={{ height: 13, background: '#F0EBF8', borderRadius: 99, width: '50%' }} />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen pb-12" style={{ background: '#FEF0F8' }}>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #FFD6E8 0%, #E8D6FF 40%, #D6E8FF 75%, #D6FFE8 100%)',
        padding: '28px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <span style={{ position: 'absolute', top: 16, right: 24, fontSize: 18, opacity: 0.4 }}>✦</span>
        <span style={{ position: 'absolute', bottom: 14, left: 32, fontSize: 11, opacity: 0.35, color: '#9B5FC0' }}>✦</span>

        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9B5FC0', fontWeight: 700, marginBottom: 6 }}>
              Notre boutique
            </p>
            <h1 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.2rem', fontWeight: 700, color: '#2D2340', lineHeight: 1.1, marginBottom: 6 }}>
              {activeCategory === 'Tous' ? 'All Products' : activeCategory}
            </h1>
            <p style={{ fontSize: 13, color: '#8B7A9B' }}>
              {loading ? '...' : `${filtered.length} produit${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <Link to="/wishlist"
            style={{ background: 'rgba(255,255,255,0.75)', borderRadius: 16, padding: '10px 14px', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(249,200,212,0.5)', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <Heart size={22} style={{ color: '#E8A0B4', fill: wishCount > 0 ? '#E8A0B4' : 'none' }} />
              {wishCount > 0 && (
                <span style={{ position: 'absolute', top: -8, right: -10, background: '#9B5FC0', color: 'white', fontSize: 9, fontWeight: 800, borderRadius: 99, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {wishCount}
                </span>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#5A4A6A' }}>Wishlist</span>
          </Link>
        </div>
      </section>

      {/* FILTRES STICKY */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(254,240,248,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(249,200,212,0.3)', padding: '12px 16px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#C4B0D8' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for magic potions..."
                style={{ width: '100%', borderRadius: 50, padding: '9px 36px 9px 34px', fontSize: 13, fontFamily: 'Nunito, sans-serif', background: 'white', border: '1.5px solid rgba(249,200,212,0.5)', outline: 'none', color: '#2D2340', boxShadow: '0 2px 10px rgba(155,95,192,0.07)' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#C4B0D8', display: 'flex' }}>
                  <X size={13} />
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ borderRadius: 50, padding: '9px 14px', fontSize: 12, fontFamily: 'Nunito, sans-serif', background: 'white', border: '1.5px solid rgba(249,200,212,0.5)', color: '#5A4A6A', outline: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: '0 2px 10px rgba(155,95,192,0.07)' }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.label
              return (
                <button key={cat.label}
                  onClick={() => setCategory(cat.label)}
                  className="flex-shrink-0 flex items-center gap-1.5 transition-all duration-200"
                  style={{ padding: '7px 14px', borderRadius: 50, fontSize: 12, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', background: isActive ? '#9B5FC0' : 'white', color: isActive ? 'white' : '#5A4A6A', border: isActive ? '1.5px solid #9B5FC0' : `1.5px solid ${cat.border}`, boxShadow: isActive ? '0 4px 16px rgba(155,95,192,0.30)' : '0 1px 6px rgba(155,95,192,0.06)', transform: isActive ? 'scale(1.03)' : 'scale(1)' }}>
                  <span>{cat.emoji}</span>
                  <span>{cat.label === 'Tous' ? t('cat_all') : cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* GRILLE */}
      <div className="pc-products-page" style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 0' }}>

        {activeCategory !== 'Tous' && (
          <div className="flex items-center gap-3 mb-5 animate-fade-up"
            style={{ background: activeCat.bg, borderRadius: 16, padding: '12px 16px', border: `1.5px solid ${activeCat.border}` }}>
            <span style={{ fontSize: 22 }}>{activeCat.emoji}</span>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9B5FC0', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{t('products_cat_label')}</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#2D2340' }}>{activeCategory}</p>
            </div>
            <button onClick={() => setCategory('Tous')}
              style={{ marginLeft: 'auto', background: 'rgba(155,95,192,0.12)', border: 'none', borderRadius: 50, padding: '4px 10px', fontSize: 12, color: '#9B5FC0', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Nunito, sans-serif' }}>
              <X size={11} /> Tout voir
            </button>
          </div>
        )}

        {loading ? <Skeleton /> : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div style={{ width: 80, height: 80, background: 'rgba(155,95,192,0.10)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 32 }}>
              🌸
            </div>
            <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.6rem', fontWeight: 700, color: '#2D2340', marginBottom: 8 }}>
              {t('products_empty')}
            </p>
            <p style={{ fontSize: 14, color: '#8B7A9B' }}>Essaie une autre catégorie ou efface ta recherche.</p>
            <button onClick={() => { setSearch(''); setCategory('Tous') }}
              style={{ marginTop: 20, background: '#9B5FC0', color: 'white', border: 'none', borderRadius: 50, padding: '10px 24px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {t('products_see_all')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {filtered.map((product, i) => (
              <div key={product._id} className="animate-fade-up" style={{ animationDelay: `${i * 45}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="mt-12 rounded-3xl relative text-center"
            style={{ background: 'linear-gradient(135deg, #FFD6E8 0%, #E8D6FF 30%, #D6E8FF 60%, #D6FFE8 100%)', padding: '32px 20px 28px', overflow: 'hidden' }}>
            <span style={{ position: 'absolute', top: 14, left: 20, fontSize: 11, color: '#C9ADE8', opacity: 0.6 }}>✦</span>
            <span style={{ position: 'absolute', top: 12, right: 22, fontSize: 9, color: '#F9C8D4', opacity: 0.6 }}>✦</span>
            <Sparkles size={28} style={{ color: '#9B5FC0', margin: '0 auto 12px', opacity: 0.7, display: 'block' }} />
            <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.5rem', fontWeight: 700, color: '#4A3070', marginBottom: 8 }}>
              Clean Japanese Beauty
            </p>
            <p style={{ fontSize: 13, color: '#7A6888', lineHeight: 1.65 }}>
              Curated with love from Tokyo to your doorstep.<br />Cruelty-free and magical.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage