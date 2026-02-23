import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ClipboardList, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/admin',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Produits',  icon: Package },
  { to: '/admin/orders',   label: 'Commandes', icon: ClipboardList },
]

function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('À bientôt 🌸')
    navigate('/admin/login', { replace: true })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6" style={{ borderBottom: '1px solid rgba(249,200,212,0.25)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, #F9C8D4, #E8DCF5)' }}>
            <span style={{ fontSize: '1.2rem' }}>🌿</span>
          </div>
          <div>
            <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.3rem', fontWeight: 700, color: '#7B5EA7', lineHeight: 1 }}>
              Tinkerbells
            </p>
            <p style={{ fontSize: '9px', color: '#C4B0D8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-white' : 'text-[#B8A8C8] hover:text-[#7B5EA7]'
              }`
            }
            style={({ isActive }) => isActive
              ? { background: 'linear-gradient(135deg, #9B5FC0, #B896D4)', boxShadow: '0 4px 16px rgba(155,95,192,0.3)' }
              : { background: 'transparent' }
            }>
            <Icon size={16} />
            <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(249,200,212,0.25)' }}>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
          style={{ color: '#C4B0D8', fontSize: '13px', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,200,212,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#FEF0F8' }}>

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 fixed h-full z-30 flex-shrink-0"
             style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', borderRight: '1px solid rgba(249,200,212,0.3)', boxShadow: '4px 0 24px rgba(155,95,192,0.06)' }}>
        <SidebarContent />
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 bottom-0 w-60"
                 style={{ background: 'rgba(255,255,255,0.96)', borderRight: '1px solid rgba(249,200,212,0.3)' }}
                 onClick={e => e.stopPropagation()}>
            <button onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full"
              style={{ color: '#C4B0D8', background: 'rgba(249,200,212,0.2)' }}>
              <X size={16} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center justify-between px-5 py-4"
                style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(249,200,212,0.3)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: '#B8A8C8' }}>
            <Menu size={22} />
          </button>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.4rem', fontWeight: 700, color: '#7B5EA7' }}>
            Tinkerbells
          </p>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout