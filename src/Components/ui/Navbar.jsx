// src/components/ui/Navbar.jsx
// Barre de navigation principale — style streetwear épuré

import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, Zap } from 'lucide-react'
import { useCart } from '../../context/CartContext'

function Navbar() {
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/products', label: 'Produits' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-black/95 backdrop-blur-sm border-b border-brand-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="SOLEKICKS — Accueil"
          >
            <div className="w-8 h-8 bg-brand-red flex items-center justify-center"
                 style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)' }}>
              <Zap size={14} className="text-white fill-white" />
            </div>
            <span className="font-display text-2xl tracking-widest text-brand-white
                             group-hover:text-brand-red transition-colors duration-200">
              SOLEKICKS
            </span>
          </Link>

          {/* Liens desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `font-heading font-semibold tracking-widest uppercase text-sm transition-colors duration-200 ${
                    isActive
                      ? 'text-brand-red'
                      : 'text-brand-gray-300 hover:text-brand-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-3">
            {/* Icône panier */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-brand-gray-300 hover:text-brand-white transition-colors duration-200"
              aria-label={`Panier — ${itemCount} article${itemCount !== 1 ? 's' : ''}`}
            >
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px]
                                 bg-brand-red text-white text-[10px] font-heading font-bold
                                 flex items-center justify-center leading-none px-1 animate-pulse-red">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Menu hamburger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-brand-gray-300 hover:text-brand-white transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-brand-gray-900 border-t border-brand-gray-800 animate-slide-up">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 font-heading font-semibold tracking-widest uppercase text-sm
                   border-l-2 transition-all duration-200 ${
                    isActive
                      ? 'border-brand-red text-brand-red bg-brand-red/5'
                      : 'border-transparent text-brand-gray-300 hover:border-brand-gray-600 hover:text-brand-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar