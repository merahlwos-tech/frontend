import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X, Heart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useLang } from '../../context/LanguageContext'
import api from '../../utils/api'

const NAV_LINKS = (t) => [
  { to: '/products?category=Skincare',  label: t('cat_skincare') },
  { to: '/products?category=Makeup',    label: t('cat_makeup') },
  { to: '/products?category=Body Care', label: t('cat_body') },
  { to: '/products?category=Hair Care', label: t('cat_hair') },
  { to: '/products',                    label: t('nav_all') },
  { to: '/about',                       label: t('nav_about') },
]

// Recherche floue : tolère les fautes de frappe
function fuzzyMatch(text, query) {
  if (!query) return true
  text = text.toLowerCase()
  query = query.toLowerCase()
  // Match exact
  if (text.includes(query)) return true
  // Match flou : chaque lettre du query doit apparaître dans l'ordre
  let qi = 0
  for (let i = 0; i < text.length && qi < query.length; i++) {
    if (text[i] === query[qi]) qi++
  }
  if (qi === query.length) return true
  // Tolérance 1 faute : essaie sans chaque caractère du query
  for (let skip = 0; skip < query.length; skip++) {
    const shortened = query.slice(0, skip) + query.slice(skip + 1)
    if (text.includes(shortened)) return true
  }
  return false
}

function LangSwitcher() {
  const { lang, setLang } = useLang()
  const LANGS = ['fr', 'en', 'ar']
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {LANGS.map((code) => (
        <button key={code} onClick={() => setLang(code)}
          style={{
            padding: '3px 8px', borderRadius: 6,
            border: lang === code ? '1.5px solid #9B5FC0' : '1.5px solid transparent',
            background: lang === code ? 'rgba(155,95,192,0.1)' : 'transparent',
            cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'Nunito, sans-serif',
            color: lang === code ? '#9B5FC0' : '#8B7A9B',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            transition: 'all .15s',
          }}>
          {code}
        </button>
      ))}
    </div>
  )
}

function SearchBox({ placeholder, onNavigate }) {
  const [val, setVal] = useState('')
  const [debouncedVal, setDebouncedVal] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const boxRef = useRef(null)
  const navigate = useNavigate()

  // Charger tous les produits une seule fois
  useEffect(() => {
    api.get('/products').then(res => setAllProducts(res.data || [])).catch(() => {})
  }, [])

  // Debounce 250ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedVal(val), 250)
    return () => clearTimeout(timer)
  }, [val])

  // Calculer suggestions avec recherche floue
  useEffect(() => {
    if (!debouncedVal.trim() || debouncedVal.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    const inStock = allProducts.filter(p => {
      const stock = p.sizes?.length > 0
        ? p.sizes.reduce((s, x) => s + x.stock, 0)
        : (p.stock ?? 0)
      return stock > 0
    })
    const matches = inStock.filter(p =>
      fuzzyMatch(p.name || '', debouncedVal) ||
      fuzzyMatch(p.brand || '', debouncedVal) ||
      fuzzyMatch(p.category || '', debouncedVal) ||
      (p.tags || []).some(tag => fuzzyMatch(tag, debouncedVal))
    ).slice(0, 6)
    setSuggestions(matches)
    setOpen(matches.length > 0)
  }, [debouncedVal, allProducts])

  // Fermer si clic en dehors
  useEffect(() => {
    const handleClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (val.trim()) {
      navigate(`/products?search=${encodeURIComponent(val.trim())}`)
      setVal('')
      setSuggestions([])
      setOpen(false)
      onNavigate?.()
    }
  }

  const handleSelect = (product) => {
    navigate(`/products/${product._id}`)
    setVal('')
    setSuggestions([])
    setOpen(false)
    onNavigate?.()
  }

  return (
    <div ref={boxRef} style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
      <form onSubmit={handleSubmit}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: focused ? '#9B5FC0' : '#C4B0D8', transition: 'color .2s', zIndex: 1 }} />
        <input
          ref={inputRef}
          value={val}
          onChange={e => setVal(e.target.value)}
          onFocus={() => { setFocused(true); if (suggestions.length) setOpen(true) }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: '100%', borderRadius: 50, padding: '9px 36px 9px 34px', fontSize: 13,
            fontFamily: 'Nunito, sans-serif', outline: 'none', color: '#2D2340',
            background: 'rgba(255,255,255,0.95)',
            border: `1.5px solid ${focused ? '#9B5FC0' : 'rgba(249,200,212,0.5)'}`,
            boxShadow: focused ? '0 0 0 3px rgba(155,95,192,0.1)' : 'none',
            transition: 'all .2s',
          }}
        />
        {val && (
          <button type="button" onClick={() => { setVal(''); setSuggestions([]); setOpen(false) }}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#C4B0D8', display: 'flex', padding: 2 }}>
            <X size={13} />
          </button>
        )}
      </form>

      {/* Dropdown suggestions */}
      {open && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
          background: 'white', borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(155,95,192,0.18)',
          border: '1.5px solid rgba(249,200,212,0.4)',
          zIndex: 100,
        }}>
          {suggestions.map((p, i) => {
            const stock = p.sizes?.length > 0
              ? p.sizes.reduce((s, x) => s + x.stock, 0)
              : (p.stock ?? 0)
            return (
              <button key={p._id} onMouseDown={() => handleSelect(p)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: i < suggestions.length - 1 ? '1px solid rgba(249,200,212,0.2)' : 'none',
                  textAlign: 'left', transition: 'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(155,95,192,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                {/* Infos */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#2D2340', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize: 10, color: '#C4B0D8', fontWeight: 600 }}>{p.brand} · {p.category}</p>
                </div>
                {/* Prix */}
                <span style={{ fontSize: 12, fontWeight: 800, color: '#9B5FC0', flexShrink: 0 }}>
                  {(p.price ?? 0).toLocaleString('fr-DZ')} DA
                </span>
              </button>
            )
          })}
          {/* Voir tous les résultats */}
          {val.trim().length >= 2 && (
            <button onMouseDown={handleSubmit}
              style={{ width: '100%', padding: '9px 12px', background: 'rgba(155,95,192,0.05)', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#9B5FC0', fontFamily: 'Nunito, sans-serif' }}>
              Voir tous les résultats pour "{val}" →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function Navbar() {
  const { itemCount } = useCart()
  const { count: wishCount } = useWishlist()
  const { t } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const links = NAV_LINKS(t)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50"
        style={{ background: 'rgba(255,240,248,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(249,200,212,0.3)' }}>

        {/* ═══ MOBILE < 1024px ═══ */}
        <div className="lg:hidden" style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 6 }}>
            <LangSwitcher />
          </div>
          <div className="flex items-center justify-between h-14">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1" style={{ color: '#8B7A9B' }}>
              {menuOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
            </button>
            <Link to="/" className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
              <img src="images/logo.jpg" alt="Tinkerbells"
                style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(249,200,212,0.6)' }} />
              <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.4rem', fontWeight: 700, color: '#7B5EA7' }}>Tinkerbells</span>
            </Link>
            <div className="flex items-center gap-1">
              <Link to="/wishlist" className="relative p-1" style={{ color: '#8B7A9B' }}>
                <Heart size={19} strokeWidth={1.8} style={{ fill: wishCount > 0 ? '#E8A0B4' : 'none', color: wishCount > 0 ? '#E8A0B4' : undefined }} />
                {wishCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-tb-purple text-white text-[9px] font-bold flex items-center justify-center rounded-full">{wishCount}</span>}
              </Link>
              <button onClick={() => navigate('/cart')} className="relative p-1" style={{ color: '#8B7A9B' }}>
                <ShoppingBag size={21} strokeWidth={1.8} />
                {itemCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-tb-purple text-white text-[10px] font-bold flex items-center justify-center rounded-full">{itemCount}</span>}
              </button>
            </div>
          </div>
          <div className="pb-2.5">
            <SearchBox placeholder={t('nav_search')} onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>

        {/* ═══ PC ≥ 1024px ═══ */}
        <div className="hidden lg:block" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div className="flex items-center justify-between h-16 gap-6">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="images/logo.jpg" alt="Tinkerbells"
                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(249,200,212,0.6)', boxShadow: '0 2px 8px rgba(155,95,192,0.15)' }} />
              <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.55rem', fontWeight: 700, color: '#7B5EA7' }}>Tinkerbells</span>
            </Link>
            <div className="flex items-center gap-5">
              {links.map(({ to, label }) => (
                <Link key={to} to={to}
                  style={{ fontSize: 13, fontWeight: 600, color: '#5A4A6A', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color .15s' }}
                  onMouseEnter={e => e.target.style.color = '#9B5FC0'}
                  onMouseLeave={e => e.target.style.color = '#5A4A6A'}>
                  {label}
                </Link>
              ))}
            </div>
            <SearchBox placeholder={t('nav_search')} />
            <div className="flex items-center gap-3 flex-shrink-0">
              <LangSwitcher />
              <Link to="/wishlist" className="flex items-center gap-1.5" style={{ fontSize: 13, fontWeight: 600, color: '#5A4A6A', textDecoration: 'none' }}>
                <Heart size={18} strokeWidth={1.8} style={{ fill: wishCount > 0 ? '#E8A0B4' : 'none', color: wishCount > 0 ? '#E8A0B4' : '#5A4A6A' }} />
                {wishCount > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: '#9B5FC0' }}>{wishCount}</span>}
              </Link>
              <button onClick={() => navigate('/cart')}
                style={{ background: '#9B5FC0', color: 'white', border: 'none', borderRadius: 50, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(155,95,192,0.3)' }}>
                <ShoppingBag size={15} />
                {t('nav_cart')}
                {itemCount > 0 && <span style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 50, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{itemCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu slide mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 left-0 w-72 h-full bg-white shadow-xl pt-6 px-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: '1px solid #F0EDF5' }}>
              <img src="images/logo.jpg" alt="Tinkerbells"
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(249,200,212,0.6)' }} />
              <div>
                <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.2rem', fontWeight: 700, color: '#7B5EA7' }}>Tinkerbells</p>
                <p style={{ fontSize: 10, color: '#C4B0D8', fontWeight: 600 }}>Beauty World</p>
              </div>
            </div>
            {links.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: '1px solid #F9F0FF', fontSize: 14, fontWeight: 600, color: '#5A4A6A', textDecoration: 'none' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F9C8D4', flexShrink: 0 }} />
                {label}
              </Link>
            ))}
            <Link to="/wishlist" onClick={() => setMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: '1px solid #F9F0FF', fontSize: 14, fontWeight: 600, color: '#5A4A6A', textDecoration: 'none' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F9C8D4', flexShrink: 0 }} />
              💜 {t('nav_wishlist')} {wishCount > 0 && `(${wishCount})`}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar