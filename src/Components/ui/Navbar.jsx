import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X, Heart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

const NAV_LINKS = [
  { to: '/products?category=Skincare',  label: 'Skincare' },
  { to: '/products?category=Makeup',    label: 'Makeup' },
  { to: '/products?category=Body Care', label: 'Body Care' },
  { to: '/products?category=Hair Care', label: 'Hair Care' },
  { to: '/products',                    label: 'Tout voir' },
  { to: '/about',                       label: 'À propos' },
]

function Navbar() {
  const { itemCount } = useCart()
  const { count: wishCount } = useWishlist()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/products?search=${searchVal}`)
      setSearchVal('')
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50"
           style={{ background: 'rgba(255,240,248,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(249,200,212,0.3)' }}>

        {/* ══ MOBILE (< 1024px) ══ */}
        <div className="lg:hidden" style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px' }}>
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-tb-text-soft hover:text-tb-text transition-colors p-1">
              {menuOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
            </button>
            <Link to="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              <img src="images/logo.jpg" alt="Tinkerbells Beauty World"
                style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(249,200,212,0.6)', boxShadow: '0 2px 8px rgba(155,95,192,0.15)' }} />
              <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.5rem', fontWeight: 700, color: '#7B5EA7' }}>Tinkerbells</span>
            </Link>
            <div className="flex items-center gap-1">
              <Link to="/wishlist" className="relative p-1 text-tb-text-soft hover:text-tb-text transition-colors">
                <Heart size={20} strokeWidth={1.8} style={{ fill: wishCount > 0 ? '#E8A0B4' : 'none', color: wishCount > 0 ? '#E8A0B4' : undefined }} />
                {wishCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-tb-purple text-white text-[9px] font-bold flex items-center justify-center rounded-full">{wishCount}</span>}
              </Link>
              <button onClick={() => navigate('/cart')} className="relative p-1 text-tb-text-soft hover:text-tb-text transition-colors">
                <ShoppingBag size={22} strokeWidth={1.8} />
                {itemCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-tb-purple text-white text-[10px] font-bold flex items-center justify-center rounded-full">{itemCount}</span>}
              </button>
            </div>
          </div>
          <div className="pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search for magic potions..."
                className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm font-body text-tb-text outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(249,200,212,0.4)', boxShadow: '0 2px 12px rgba(155,95,192,0.06)' }} />
            </form>
          </div>
        </div>

        {/* ══ PC (≥ 1024px) ══ */}
        <div className="hidden lg:block" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div className="flex items-center justify-between h-16 gap-8">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="images/logo.jpg" alt="Tinkerbells"
                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(249,200,212,0.6)', boxShadow: '0 2px 8px rgba(155,95,192,0.15)' }} />
              <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.55rem', fontWeight: 700, color: '#7B5EA7' }}>Tinkerbells</span>
            </Link>

            {/* Navigation links */}
            <div className="flex items-center gap-6">
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={label} to={to}
                  style={{ fontSize: 13, fontWeight: 600, color: '#5A4A6A', textDecoration: 'none', fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap', transition: 'color .15s' }}
                  onMouseEnter={e => e.target.style.color = '#9B5FC0'}
                  onMouseLeave={e => e.target.style.color = '#5A4A6A'}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Recherche */}
            <form onSubmit={handleSearch} className="relative flex-1" style={{ maxWidth: 280 }}>
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Rechercher..."
                className="w-full rounded-2xl pl-9 pr-4 py-2.5 text-sm font-body text-tb-text outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(249,200,212,0.4)', boxShadow: '0 2px 12px rgba(155,95,192,0.06)', fontSize: 13 }} />
            </form>

            {/* Wishlist + Panier */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link to="/wishlist" className="relative flex items-center gap-1.5"
                style={{ fontSize: 13, fontWeight: 600, color: '#5A4A6A', textDecoration: 'none', fontFamily: 'Nunito, sans-serif' }}>
                <Heart size={18} strokeWidth={1.8} style={{ fill: wishCount > 0 ? '#E8A0B4' : 'none', color: wishCount > 0 ? '#E8A0B4' : '#5A4A6A' }} />
                {wishCount > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: '#9B5FC0' }}>{wishCount}</span>}
              </Link>
              <button onClick={() => navigate('/cart')}
                className="relative flex items-center gap-2"
                style={{ background: '#9B5FC0', color: 'white', border: 'none', borderRadius: 50, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(155,95,192,0.3)' }}>
                <ShoppingBag size={16} />
                Panier
                {itemCount > 0 && <span style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 50, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{itemCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu slide mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 left-0 w-72 h-full bg-white shadow-soft-lg pt-6 px-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-tb-lav-soft">
              <img src="images/logo.jpg" alt="Tinkerbells"
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(249,200,212,0.6)' }} />
              <div>
                <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.2rem', fontWeight: 700, color: '#7B5EA7' }}>Tinkerbells</p>
                <p style={{ fontSize: 10, color: '#C4B0D8', fontWeight: 600 }}>Beauty World</p>
              </div>
            </div>
            <p className="sf-label mb-5">Navigate</p>
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={label} to={to} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 border-b border-tb-lav-soft font-body text-tb-text-soft hover:text-tb-purple transition-colors text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-tb-pink flex-shrink-0" />
                {label}
              </Link>
            ))}
            <Link to="/wishlist" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 py-3 border-b border-tb-lav-soft font-body text-tb-text-soft hover:text-tb-purple transition-colors text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-tb-pink flex-shrink-0" />
              💜 Ma Wishlist {wishCount > 0 && `(${wishCount})`}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar