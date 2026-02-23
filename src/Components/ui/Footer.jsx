import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Home, Info } from 'lucide-react'

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
      <path d="m8 16 5-5"/>
      <path d="m2 22 10-10"/>
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
      {/* Mini footer */}
      <footer className="py-6 px-6 text-center" style={{ background: 'rgba(255,240,248,0.6)' }}>
        <div className="max-w-lg mx-auto">
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.2rem', fontWeight: 700, color: '#7B5EA7' }} className="mb-1">
            Tinkerbells 🌸
          </p>
          <p className="font-body text-tb-text-light text-xs">
            Clean Japanese Beauty • Cruelty-free &amp; magical
          </p>
          <p className="font-body text-tb-text-light text-xs mt-3 flex items-center justify-center gap-1">
            <AdminSecretAccess /> {new Date().getFullYear()} Tinkerbells
          </p>
        </div>
      </footer>

      {/* Bottom Navigation */}
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