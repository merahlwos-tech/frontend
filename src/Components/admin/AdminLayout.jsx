// src/components/admin/AdminLayout.jsx
// Layout admin avec sidebar navigation

import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ClipboardList, LogOut,
  Zap, Menu, X, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Produits', icon: Package },
  { to: '/admin/orders', label: 'Commandes', icon: ClipboardList },
]

function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Déconnecté')
    navigate('/admin/login', { replace: true })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-brand-gray-800">
        <div
          className="w-8 h-8 bg-brand-red flex items-center justify-center flex-shrink-0"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)' }}
        >
          <Zap size={14} className="text-white fill-white" />
        </div>
        <div>
          <p className="font-display text-lg tracking-widest text-brand-white leading-none">
            SOLEKICKS
          </p>
          <p className="text-brand-gray-600 text-[10px] font-heading tracking-widest uppercase mt-0.5">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-all duration-200 group
               border-l-2 ${
                isActive
                  ? 'bg-brand-red/10 border-brand-red text-brand-red'
                  : 'border-transparent text-brand-gray-400 hover:bg-brand-gray-800 hover:text-brand-white hover:border-brand-gray-600'
              }`
            }
          >
            <Icon size={16} />
            <span className="font-heading font-semibold tracking-widest uppercase text-xs flex-1">
              {label}
            </span>
            <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Déconnexion */}
      <div className="px-4 py-4 border-t border-brand-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-brand-gray-500
                     hover:text-brand-red hover:bg-brand-red/5 transition-colors
                     font-heading font-semibold tracking-widest uppercase text-xs"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-black flex">

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-gray-900 border-r border-brand-gray-800 flex-shrink-0 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-brand-gray-900 border-r border-brand-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-brand-gray-500 hover:text-white"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-brand-gray-900 border-b border-brand-gray-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-brand-gray-400 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="font-display text-xl tracking-widest text-brand-white">ADMIN</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout