import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Home, Sparkles, Heart, Info } from 'lucide-react'

function AdminSecretAccess() {
  const [clicks, setClicks] = useState(0)
  const [showInput, setShowInput] = useState(false)
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const handleClick = () => {
    const next = clicks + 1
    setClicks(next)
    if (next >= 3) { setShowInput(true); setClicks(0) }
  }
  const handleChange = (e) => {
    const val = e.target.value
    setValue(val)
    if (val.toLowerCase() === 'admin') {
      setShowInput(false); setValue(''); navigate('/admin/login')
    }
  }

  return (
    <div className="relative inline-block">
      <span onClick={handleClick} className="text-tb-text-light text-xs cursor-default select-none">©</span>
      {showInput && (
        <input
          autoFocus type="text" value={value} onChange={handleChange}
          onBlur={() => { setShowInput(false); setValue(''); setClicks(0) }}
          className="absolute bottom-6 right-0 w-24 bg-white border border-tb-lavender text-tb-text text-xs font-body px-2 py-1 rounded-xl outline-none shadow-soft"
          placeholder="..."
        />
      )}
    </div>
  )
}

function Footer() {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  const navItems = [
    { icon: Home,     label: 'Home',     to: '/' },
    { icon: Sparkles, label: 'Shop',     to: '/products' },
    { icon: Heart,    label: 'Wishlist', to: '/products' },
    { icon: Info,     label: 'Info',     to: '/about' },
  ]

  return (
    <>
      {/* ── Footer mini ──────────────────────── */}
      <footer className="bg-white/80 border-t border-tb-pink/20 py-8 px-6 text-center">
        <div className="max-w-md mx-auto">
          <p
            style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.4rem', fontWeight: 700 }}
            className="text-tb-text mb-2"
          >
            Tinkerbells 🌸
          </p>
          <p className="font-body text-tb-text-light text-xs mb-4">
            Clean Japanese Beauty • Cruelty-free &amp; magical
          </p>
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {['Skincare', 'Makeup', 'Body Care', 'Hair Care'].map((cat) => (
              <Link key={cat} to={`/products?category=${cat}`}
                className="font-body text-tb-text-soft text-xs hover:text-tb-purple transition-colors">
                {cat}
              </Link>
            ))}
          </div>
          <p className="font-body text-tb-text-light text-xs flex items-center justify-center gap-1">
            <AdminSecretAccess /> {new Date().getFullYear()} Tinkerbells. Made with
            <Heart size={10} className="text-tb-pink fill-tb-pink mx-0.5" /> magic
          </p>
        </div>
      </footer>

      {/* ── Bottom Navigation ─────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-tb-pink/20">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {navItems.map(({ icon: Icon, label, to }) => {
              const isActive = path === to || (to !== '/' && path.startsWith(to))
              return (
                <button
                  key={label}
                  onClick={() => navigate(to)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 ${
                    isActive ? 'text-tb-purple bg-tb-lav-soft' : 'text-tb-text-light hover:text-tb-text-soft'
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-[10px] font-body font-semibold">{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Spacer pour la bottom nav */}
      <div className="h-16" />
    </>
  )
}

export default Footer