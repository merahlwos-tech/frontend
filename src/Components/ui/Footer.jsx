import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Home, Info, Instagram, MapPin, Heart } from 'lucide-react'

function AdminSecretAccess() {
  const [clicks, setClicks] = useState(0)
  const [showInput, setShowInput] = useState(false)
  const [value, setValue] = useState('')
  const navigate = useNavigate()
  const handleClick = () => {
    const next = clicks + 1; setClicks(next)
    if (next >= 3) { setShowInput(true); setClicks(0) }
  }
  const handleChange = (e) => {
    const val = e.target.value; setValue(val)
    if (val.toLowerCase() === 'admin') { setShowInput(false); setValue(''); navigate('/admin/login') }
  }
  return (
    <div className="relative inline-block">
      <span onClick={handleClick} className="text-tb-text-light text-xs cursor-default select-none">©</span>
      {showInput && (
        <input autoFocus type="text" value={value} onChange={handleChange}
          onBlur={() => { setShowInput(false); setValue(''); setClicks(0) }}
          className="absolute bottom-6 right-0 w-24 bg-white border border-tb-lavender text-tb-text text-xs font-body px-2 py-1 rounded-xl outline-none shadow-soft"
          placeholder="..." />
      )}
    </div>
  )
}

function IconWand() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M17.8 6.2 19 5M12.2 6.2 11 5M12.2 11.8 11 13M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
      <path d="m8 16 5-5"/><path d="m2 22 10-10"/>
    </svg>
  )
}

function IconHeart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  )
}

function Footer() {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  const navItems = [
    { label: 'Home',     to: '/',         icon: () => <Home size={22} strokeWidth={1.8} />, exact: true  },
    { label: 'Shop',     to: '/products', icon: IconWand,                                   exact: false },
    { label: 'Wishlist', to: '/wishlist', icon: IconHeart,                                  exact: true  },
    { label: 'Info',     to: '/about',    icon: () => <Info size={22} strokeWidth={1.8} />, exact: true  },
  ]

  return (
    <>
      {/* ══════════════════════════
          FOOTER PRINCIPAL
      ══════════════════════════ */}
      <footer style={{ background: 'linear-gradient(160deg, #2D1A45 0%, #3D2060 60%, #2D1A45 100%)', color: 'white', paddingBottom: 24 }}>

        {/* Logo + slogan */}
        <div style={{ textAlign: 'center', padding: '36px 20px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <img src="/logo.jpg" alt="Tinkerbells Beauty World"
            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', border: '3px solid rgba(249,200,212,0.4)', boxShadow: '0 4px 20px rgba(155,95,192,0.25)' }} />
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.8rem', fontWeight: 700, color: '#F9C8D4', marginBottom: 6 }}>
            Tinkerbells Beauty World
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em' }}>
            Clean Korean Beauty • Cruelty-free &amp; magical
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
            <MapPin size={13} style={{ color: '#C9ADE8' }} />
            <span style={{ fontSize: 12, color: '#C9ADE8', fontWeight: 600 }}>Livraison dans toute l'Algérie 🇩🇿</span>
          </div>
        </div>

        {/* Grille de liens */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 20px' }}>

          {/* Catégories */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#F9C8D4', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
              Catégories
            </p>
            {[
              { label: '🌸 Skincare',  to: '/products?category=Skincare' },
              { label: '💄 Makeup',    to: '/products?category=Makeup' },
              { label: '🛁 Body Care', to: '/products?category=Body Care' },
              { label: '💆 Hair Care', to: '/products?category=Hair Care' },
              { label: '✨ Tout voir', to: '/products' },
            ].map(({ label, to }) => (
              <Link key={to} to={to}
                style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#F9C8D4'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}>
                {label}
              </Link>
            ))}
          </div>

          {/* Informations */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#F9C8D4', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
              Informations
            </p>
            {[
              { label: 'À propos de nous', to: '/about' },
              { label: 'Notre boutique',   to: '/products' },
              { label: 'Ma wishlist',      to: '/wishlist' },
              { label: 'Mon panier',       to: '/cart' },
            ].map(({ label, to }) => (
              <Link key={to} to={to}
                style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#F9C8D4'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}>
                {label}
              </Link>
            ))}

            {/* Instagram */}
            <a href="https://www.instagram.com/tinkerbells_beauty_world/"
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 8, padding: '8px 16px', borderRadius: 50, textDecoration: 'none', background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: 'white', fontSize: 12, fontWeight: 700 }}>
              <Instagram size={14} />
              @tinkerbells_beauty_world
            </a>
          </div>
        </div>

        {/* Bas de footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 24px 0', paddingTop: 16, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
            <AdminSecretAccess /> {new Date().getFullYear()} Tinkerbells — Tous droits réservés
          </p>
          <a href="https://www.instagram.com/cvkdev/"
            target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>
            <Instagram size={10} /> Developed by CvkDev
          </a>
        </div>
      </footer>

      {/* ══════════════════════════
          BOTTOM NAV
      ══════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50"
           style={{ background: 'rgba(255,245,252,0.96)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(249,200,212,0.3)', boxShadow: '0 -4px 24px rgba(155,95,192,0.08)' }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-around py-2.5 px-4">
            {navItems.map(({ label, to, icon: Icon, exact }) => {
              const isActive = exact ? path === to : path === to || path.startsWith(to + '/')
              return (
                <button key={label} onClick={() => navigate(to)}
                  className="flex flex-col items-center gap-1 min-w-[56px] transition-all duration-200"
                  style={{ color: isActive ? '#7B5EA7' : '#C4B0D8' }}>
                  <Icon />
                  <span className="text-[11px] font-body font-semibold">{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="h-20" />
    </>
  )
}

export default Footer