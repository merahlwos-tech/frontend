import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X, Heart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useLang } from '../../context/LanguageContext'

const NAV_LINKS = (t) => [
  { to: '/products?category=Skincare',  label: t('cat_skincare') },
  { to: '/products?category=Makeup',    label: t('cat_makeup') },
  { to: '/products?category=Body Care', label: t('cat_body') },
  { to: '/products?category=Hair Care', label: t('cat_hair') },
  { to: '/products',                    label: t('nav_all') },
  { to: '/about',                       label: t('nav_about') },
]

function LangSwitcher() {
  const { lang, setLang } = useLang()
  const LANGS = [
    { code: 'fr', flag: '🇫🇷' },
    { code: 'en', flag: '🇬🇧' },
    { code: 'ar', flag: '🇩🇿' },
  ]
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {LANGS.map(({ code, flag }) => (
        <button key={code} onClick={() => setLang(code)}
          title={code.toUpperCase()}
          style={{
            width: 30, height: 30, borderRadius: '50%', border: lang === code ? '2px solid #9B5FC0' : '2px solid transparent',
            background: lang === code ? 'rgba(155,95,192,0.1)' : 'transparent',
            cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .15s', padding: 0,
          }}>
          {flag}
        </button>
      ))}
    </div>
  )
}

function Navbar() {
  const { itemCount } = useCart()
  const { count: wishCount } = useWishlist()
  const { t } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) { navigate(`/products?search=${searchVal}`); setSearchVal('') }
  }

  const links = NAV_LINKS(t)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50"
        style={{ background: 'rgba(255,240,248,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(249,200,212,0.3)' }}>

        {/* ═══ MOBILE < 1024px ═══ */}
        <div className="lg:hidden" style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px' }}>
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
            <form onSubmit={handleSearch} className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder={t('nav_search')}
                className="w-full rounded-2xl pl-10 pr-4 py-2.5 text-sm font-body text-tb-text outline-none"
                style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(249,200,212,0.4)', fontSize: 13 }} />
            </form>
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
            <form onSubmit={handleSearch} className="relative flex-1" style={{ maxWidth: 260 }}>
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder={t('nav_search')}
                className="w-full rounded-2xl pl-8 pr-4 py-2 text-sm font-body outline-none"
                style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(249,200,212,0.4)', fontSize: 13, color: '#2D2340' }} />
            </form>
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

      {/* Sélecteur langue — mobile (bouton flottant) */}
      <div className="lg:hidden" style={{ position: 'fixed', bottom: 80, right: 12, zIndex: 998 }}>
        <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 50, padding: '6px 8px', boxShadow: '0 4px 16px rgba(155,95,192,0.18)', border: '1px solid rgba(249,200,212,0.4)', display: 'flex', gap: 2 }}>
          <LangSwitcher />
        </div>
      </div>

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