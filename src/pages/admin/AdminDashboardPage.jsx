import { useState, useEffect } from 'react'
import { TrendingUp, Package, RefreshCcw, ShoppingBag, AlertTriangle, Loader2 } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, accent, color }) {
  return (
    <div className="rounded-3xl p-6 relative overflow-hidden"
         style={{
           background: accent ? 'linear-gradient(135deg, #F5EEFF, #EDE6FF)' : 'rgba(255,255,255,0.9)',
           border: accent ? '1.5px solid rgba(155,95,192,0.25)' : '1.5px solid rgba(249,200,212,0.3)',
           boxShadow: '0 2px 16px rgba(155,95,192,0.08)',
         }}>
      <div className="flex items-start justify-between">
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#B8A8C8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            {label}
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: color || '#2D2340', fontFamily: 'Nunito, sans-serif', lineHeight: 1 }}>
            {value ?? '—'}
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
             style={{ background: accent ? 'rgba(155,95,192,0.15)' : 'rgba(249,200,212,0.3)', color: accent ? '#9B5FC0' : '#E8A0B4' }}>
          <Icon size={18} />
        </div>
      </div>
      {accent && <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl" style={{ background: 'linear-gradient(90deg, #9B5FC0, #C9ADE8)' }} />}
    </div>
  )
}

function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try { const res = await api.get('/admin/stats'); setStats(res.data) }
    catch { toast.error('Erreur chargement stats') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchStats() }, [])

  const handleReset = async () => {
    setResetting(true)
    try {
      await api.post('/admin/stats/reset')
      toast.success('Réinitialisé ✨')
      setShowConfirm(false)
      await fetchStats()
    } catch { toast.error('Erreur réinitialisation') }
    finally { setResetting(false) }
  }

  const statuses = [
    { label: 'Confirmé',    count: stats?.confirmedOrders,  color: '#7BC8E8' },
    { label: 'En livraison',count: stats?.inDeliveryOrders, color: '#F4C94A' },
    { label: 'Livré',       count: stats?.deliveredOrders,  color: '#7BC8A0' },
    { label: 'Retour',      count: stats?.returnOrders,     color: '#E8A0A0' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9B5FC0', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            Vue d'ensemble
          </p>
          <h1 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.2rem', fontWeight: 700, color: '#2D2340' }}>
            Dashboard 🌸
          </h1>
        </div>
        <button onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-body font-semibold transition-all"
          style={{ background: 'rgba(255,255,255,0.8)', border: '1.5px solid rgba(249,200,212,0.5)', color: '#B8A8C8' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#9B5FC0'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(249,200,212,0.5)'}>
          <RefreshCcw size={13} /> Réinitialiser
        </button>
      </div>

      {/* Stats cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-3xl h-28 animate-pulse"
                 style={{ background: 'rgba(255,255,255,0.6)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={TrendingUp} label="Gains" accent
            value={stats?.totalRevenue != null ? `${stats.totalRevenue.toLocaleString('fr-DZ')} DA` : '—'}
            color="#9B5FC0" />
          <StatCard icon={ShoppingBag} label="Commandes" value={stats?.totalOrders} />
          <StatCard icon={Package} label="Livrées" value={stats?.deliveredOrders} color="#6BBFA0" />
          <StatCard icon={RefreshCcw} label="Retours" value={stats?.returnOrders} color="#E8A0A0" />
        </div>
      )}

      {/* Répartition */}
      {stats && !loading && (
        <div className="rounded-3xl p-6"
             style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(249,200,212,0.3)', boxShadow: '0 2px 16px rgba(155,95,192,0.06)' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#B8A8C8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
            Répartition des commandes
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statuses.map(({ label, count, color }) => (
              <div key={label} className="text-center rounded-2xl py-4"
                   style={{ background: `${color}18` }}>
                <div className="w-3 h-3 rounded-full mx-auto mb-3" style={{ background: color }} />
                <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2D2340', fontFamily: 'Nunito', lineHeight: 1 }}>
                  {count ?? 0}
                </p>
                <p style={{ fontSize: '11px', color: '#B8A8C8', marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal reset */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(45,35,64,0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-3xl p-6 w-full max-w-sm animate-fade-up"
               style={{ background: 'white', boxShadow: '0 20px 60px rgba(155,95,192,0.2)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(249,200,212,0.3)' }}>
                <AlertTriangle size={18} style={{ color: '#E8A0A0' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#2D2340' }}>Confirmer ?</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#7B6B8A', lineHeight: 1.6, marginBottom: 16 }}>
              Cette action supprimera toutes les commandes <span style={{ color: '#6BBFA0', fontWeight: 700 }}>livrées</span> et <span style={{ color: '#E8A0A0', fontWeight: 700 }}>retournées</span>. Irréversible.
            </p>
            <div className="flex gap-3">
              <button onClick={handleReset} disabled={resetting}
                className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 text-white text-sm font-body font-bold"
                style={{ background: '#9B5FC0', opacity: resetting ? 0.7 : 1 }}>
                {resetting && <Loader2 size={13} className="animate-spin" />} Confirmer
              </button>
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-full py-3 text-sm font-body font-bold"
                style={{ background: 'rgba(249,200,212,0.3)', color: '#7B6B8A' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage