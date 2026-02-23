import { useState, useEffect } from 'react'
import { Loader2, ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import api from '../../utils/api'
import AdminOrderRow from '../../Components/admin/AdminOrderRow'
import toast from 'react-hot-toast'

const STATUS_FILTERS = ['Tous', 'en attente', 'confirmé', 'en livraison', 'livré', 'retour', 'annulé']
const STATUS_LABELS  = { 'en attente': 'En attente', confirmé: 'Confirmé', 'en livraison': 'En livraison', livré: 'Livré', retour: 'Retour', annulé: 'Annulé' }
const STATUS_COLORS  = { 'en attente': '#B8A8C8', confirmé: '#7BC8E8', 'en livraison': '#F4C94A', livré: '#7BC8A0', retour: '#F4A460', annulé: '#E8A0A0' }
const STATUS_BG      = { 'en attente': 'rgba(184,168,200,0.15)', confirmé: 'rgba(123,200,232,0.15)', 'en livraison': 'rgba(244,201,74,0.15)', livré: 'rgba(123,200,160,0.15)', retour: 'rgba(244,164,96,0.15)', annulé: 'rgba(232,160,160,0.15)' }

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')

  const fetchOrders = async () => {
    setLoading(true)
    try { const res = await api.get('/orders'); setOrders(res.data || []) }
    catch { toast.error('Erreur chargement commandes') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleUpdated = (updated) => setOrders(prev => prev.map(o => o._id === updated._id ? updated : o))

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = orders
    .filter(o => {
      const matchStatus = statusFilter === 'Tous' || o.status === statusFilter
      const matchSearch = !search ||
        `${o.customerInfo.firstName} ${o.customerInfo.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        o.customerInfo.phone.includes(search) ||
        o.customerInfo.wilaya.toLowerCase().includes(search.toLowerCase())
      return matchStatus && matchSearch
    })
    .sort((a, b) => {
      const va = sortField === 'total' ? a.total : new Date(a.createdAt)
      const vb = sortField === 'total' ? b.total : new Date(b.createdAt)
      return sortDir === 'asc' ? va - vb : vb - va
    })

  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})
  const SortIcon = ({ field }) => sortField !== field
    ? <ChevronDown size={12} style={{ opacity: 0.3 }} />
    : sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9B5FC0', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            Suivi
          </p>
          <h1 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.2rem', fontWeight: 700, color: '#2D2340' }}>
            Commandes 📦
          </h1>
        </div>
        <p style={{ fontSize: '13px', color: '#C4B0D8' }}>
          {filtered.length} / {orders.length} commande{orders.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filtres statut */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(s => {
          const isActive = statusFilter === s
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-4 py-2 rounded-full text-xs font-body font-bold transition-all"
              style={{
                background: isActive ? '#9B5FC0' : 'rgba(255,255,255,0.8)',
                color: isActive ? 'white' : (s === 'Tous' ? '#7B6B8A' : STATUS_COLORS[s]),
                border: isActive ? '1.5px solid #9B5FC0' : `1.5px solid ${s === 'Tous' ? 'rgba(249,200,212,0.4)' : STATUS_COLORS[s] + '40'}`,
                boxShadow: isActive ? '0 4px 12px rgba(155,95,192,0.25)' : 'none',
              }}>
              {s === 'Tous' ? `Tous (${orders.length})` : `${STATUS_LABELS[s]} (${counts[s] || 0})`}
            </button>
          )
        })}
      </div>

      {/* Recherche */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#C4B0D8' }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Nom, téléphone, wilaya..."
          className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(249,200,212,0.4)', color: '#2D2340', fontFamily: 'Nunito, sans-serif' }} />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#C4B0D8' }}>
            <X size={13} />
          </button>
        )}
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin" style={{ color: '#C4B0D8' }} /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl py-16 text-center"
             style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(249,200,212,0.3)' }}>
          <p style={{ fontSize: '3rem', marginBottom: 8 }}>📭</p>
          <p style={{ color: '#B8A8C8', fontSize: '14px' }}>Aucune commande trouvée</p>
        </div>
      ) : (
        <div className="rounded-3xl overflow-hidden"
             style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(249,200,212,0.3)', boxShadow: '0 2px 16px rgba(155,95,192,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(249,200,212,0.3)' }}>
                  {[
                    { label: 'Client', field: null, cls: '' },
                    { label: 'Localisation', field: null, cls: 'hidden md:table-cell' },
                    { label: 'Articles', field: null, cls: 'hidden lg:table-cell' },
                    { label: 'Total', field: 'total', cls: 'text-right' },
                    { label: 'Date', field: 'createdAt', cls: 'hidden sm:table-cell' },
                    { label: 'Statut', field: null, cls: '' },
                  ].map(({ label, field, cls }) => (
                    <th key={label}
                      className={`px-4 py-3 text-left ${cls} ${field ? 'cursor-pointer select-none' : ''}`}
                      style={{ fontSize: '11px', fontWeight: 700, color: '#C4B0D8', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                      onClick={field ? () => toggleSort(field) : undefined}>
                      <span className="flex items-center gap-1">
                        {label} {field && <SortIcon field={field} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <AdminOrderRow key={order._id} order={order} onUpdated={handleUpdated}
                    statusColors={STATUS_COLORS} statusBg={STATUS_BG} statusLabels={STATUS_LABELS} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage