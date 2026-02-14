// src/pages/admin/AdminLoginPage.jsx
// Page de connexion admin

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Lock, Zap, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

function AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      toast.error('Identifiants requis')
      return
    }
    setLoading(true)
    try {
      await login(form.username, form.password)
      toast.success('Connexion réussie')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background décoratif */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-red" />
        <div
          className="absolute -left-20 top-1/2 -translate-y-1/2 font-display text-[20vw]
                      leading-none select-none"
          style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.03)' }}
        >
          ADMIN
        </div>
      </div>

      <div className="relative w-full max-w-md animate-slide-up">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div
            className="w-10 h-10 bg-brand-red flex items-center justify-center"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)' }}
          >
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="font-display text-3xl tracking-widest text-brand-white">SOLEKICKS</span>
        </div>

        {/* Card */}
        <div className="bg-brand-gray-900 border border-brand-gray-700 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={16} className="text-brand-red" />
            <h1 className="font-heading font-bold tracking-widest uppercase text-sm text-brand-gray-300">
              Espace Administrateur
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-brand-gray-500 text-xs font-heading font-semibold
                                 tracking-widest uppercase mb-2">
                Identifiant
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                placeholder="admin"
                autoComplete="username"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-brand-gray-500 text-xs font-heading font-semibold
                                 tracking-widest uppercase mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-500
                             hover:text-brand-white transition-colors"
                  aria-label={showPass ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Connexion...
                </>
              ) : (
                'SE CONNECTER'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-brand-gray-700 text-xs font-body mt-6">
          Accès restreint — Personnel autorisé uniquement
        </p>
      </div>
    </div>
  )
}

export default AdminLoginPage