import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react'
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
    if (!form.username || !form.password) { toast.error('Identifiants requis'); return }
    setLoading(true)
    try {
      await login(form.username, form.password)
      toast.success('Bienvenue ✨')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants incorrects')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'linear-gradient(160deg, #FFF0F6 0%, #F5EEFF 50%, #EEF9F5 100%)' }}>

      {/* Déco flottante */}
      <span className="fixed top-10 left-10 text-4xl opacity-20 animate-float">🌸</span>
      <span className="fixed bottom-16 right-12 text-3xl opacity-15 animate-float" style={{ animationDelay: '1.5s' }}>✦</span>
      <span className="fixed top-1/3 right-8 text-2xl opacity-10 animate-float" style={{ animationDelay: '0.8s' }}>🪷</span>

      <div className="w-full max-w-sm animate-fade-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #F9C8D4, #E8DCF5)', boxShadow: '0 4px 20px rgba(155,95,192,0.2)' }}>
            <span style={{ fontSize: '1.8rem' }}>🌿</span>
          </div>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2rem', fontWeight: 700, color: '#7B5EA7' }}>
            Tinkerbells
          </p>
          <p style={{ fontSize: '11px', color: '#B8A8C8', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
            Espace Administrateur
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8"
             style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', boxShadow: '0 8px 40px rgba(155,95,192,0.12)', border: '1.5px solid rgba(249,200,212,0.4)' }}>

          <div className="flex items-center gap-2 mb-6">
            <Lock size={14} style={{ color: '#9B5FC0' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#9B5FC0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Connexion
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#7B6B8A', display: 'block', marginBottom: 6 }}>
                Identifiant
              </label>
              <input
                type="text" value={form.username}
                onChange={(e) => setForm(p => ({ ...p, username: e.target.value }))}
                placeholder="admin" autoComplete="username"
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: '#FDF5F8', border: '1.5px solid rgba(249,200,212,0.5)', color: '#2D2340',
                         fontFamily: 'Nunito, sans-serif' }}
                onFocus={e => e.target.style.borderColor = '#9B5FC0'}
                onBlur={e => e.target.style.borderColor = 'rgba(249,200,212,0.5)'}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#7B6B8A', display: 'block', marginBottom: 6 }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full rounded-2xl px-4 py-3 pr-12 text-sm outline-none transition-all"
                  style={{ background: '#FDF5F8', border: '1.5px solid rgba(249,200,212,0.5)', color: '#2D2340',
                           fontFamily: 'Nunito, sans-serif' }}
                  onFocus={e => e.target.style.borderColor = '#9B5FC0'}
                  onBlur={e => e.target.style.borderColor = 'rgba(249,200,212,0.5)'}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#C4B0D8' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-full py-3 mt-2 font-body font-bold text-sm text-white transition-all"
              style={{ background: '#9B5FC0', boxShadow: '0 4px 16px rgba(155,95,192,0.35)', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><Loader2 size={14} className="animate-spin" /> Connexion...</> : 'Se connecter ✨'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5" style={{ fontSize: '11px', color: '#C4B0D8' }}>
          Accès restreint — Personnel autorisé uniquement
        </p>
      </div>
    </div>
  )
}

export default AdminLoginPage