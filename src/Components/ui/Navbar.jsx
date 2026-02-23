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
  { to: '/products',                    label: 'All Products' },
  { to: '/about',                       label: 'About Us' },
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
        <div className="max-w-lg mx-auto px-5">

          {/* Ligne principale */}
          <div className="flex items-center justify-between h-16">

            {/* Burger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="text-tb-text-soft hover:text-tb-text transition-colors p-1">
              {menuOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
            </button>

            {/* Logo centré */}
            <Link to="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              <img src="/logo.jpg" alt="Tinkerbells Beauty World"
                style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(249,200,212,0.6)', boxShadow: '0 2px 8px rgba(155,95,192,0.15)' }} />
              <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.5rem', fontWeight: 700, color: '#7B5EA7', letterSpacing: '0.01em' }}>
                Tinkerbells
              </span>
            </Link>

            {/* Wishlist + Panier */}
            <div className="flex items-center gap-1">
              <Link to="/wishlist"
                className="relative p-1 text-tb-text-soft hover:text-tb-text transition-colors">
                <Heart size={20} strokeWidth={1.8}
                  style={{ fill: wishCount > 0 ? '#E8A0B4' : 'none', color: wishCount > 0 ? '#E8A0B4' : undefined }} />
                {wishCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-tb-purple text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                    {wishCount}
                  </span>
                )}
              </Link>
              <button onClick={() => navigate('/cart')}
                className="relative p-1 text-tb-text-soft hover:text-tb-text transition-colors">
                <ShoppingBag size={22} strokeWidth={1.8} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-tb-purple text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search for magic potions..."
                className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm font-body text-tb-text outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(249,200,212,0.4)', boxShadow: '0 2px 12px rgba(155,95,192,0.06)' }}
              />
            </form>
          </div>
        </div>
      </nav>

      {/* Menu slide */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
             onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 left-0 w-72 h-full bg-white shadow-soft-lg pt-6 px-6"
               onClick={e => e.stopPropagation()}>
            {/* Logo dans le menu */}
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-tb-lav-soft">
              <img src="/logo.jpg" alt="Tinkerbells"
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