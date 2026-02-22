import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'

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
      {/* ── Top Bar ─────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-tb-pink/20">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between h-14">

            {/* Burger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-tb-text-soft hover:text-tb-text transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} strokeWidth={1.8} />}
            </button>

            {/* Logo centré */}
            <Link to="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-tb-pink-soft border border-tb-pink flex items-center justify-center">
                <span className="text-base">🌸</span>
              </div>
              <span
                style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.25rem', fontWeight: 700 }}
                className="text-tb-text tracking-wide"
              >
                Tinkerbells
              </span>
            </Link>

            {/* Panier uniquement (pas de cloche) */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-1.5 text-tb-text-soft hover:text-tb-text transition-colors"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-tb-purple text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Barre de recherche ───────────────── */}
        <div className="max-w-md mx-auto px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-tb-text-light" />
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search for magic potions..."
              className="w-full bg-tb-lav-soft border-0 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-body text-tb-text placeholder:text-tb-text-light outline-none focus:ring-2 focus:ring-tb-lav-deep/30 transition-all"
            />
          </form>
        </div>
      </nav>

      {/* ── Menu slide ──────────────────────────── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute top-0 left-0 w-72 h-full bg-white shadow-soft-lg pt-16 px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="sf-label mb-5">Categories</p>
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 border-b border-tb-lav-soft font-body text-tb-text-soft hover:text-tb-purple transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-tb-pink" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar