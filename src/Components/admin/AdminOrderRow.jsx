import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = [
  { value: 'en attente',  label: 'En attente'  },
  { value: 'confirmé',    label: 'Confirmé'    },
  { value: 'en livraison',label: 'En livraison'},
  { value: 'livré',       label: 'Livré'       },
  { value: 'retour',      label: 'Retour'      },
  { value: 'annulé',      label: 'Annulé'      },
]

const STATUS_COLORS = { 'en attente': '#B8A8C8', confirmé: '#7BC8E8', 'en livraison': '#F4C94A', livré: '#7BC8A0', retour: '#F4A460', annulé: '#E8A0A0' }
const STATUS_BG     = { 'en attente': 'rgba(184,168,200,0.15)', confirmé: 'rgba(123,200,232,0.15)', 'en livraison': 'rgba(244,201,74,0.15)', livré: 'rgba(123,200,160,0.15)', retour: 'rgba(244,164,96,0.15)', annulé: 'rgba(232,160,160,0.15)' }

function AdminOrderRow({ order, onUpdated }) {
  const [status, setStatus] = useState(order.status || 'en attente')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  const handleStatusChange = (e) => { setStatus(e.target.value); setDirty(e.target.value !== order.status) }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put(`/orders/${order._id}`, { status })
      toast.success('Statut mis à jour ✨')
      setDirty(false)
      onUpdated?.({ ...order, status })
    } catch { toast.error('Erreur mise à jour'); setStatus(order.status); setDirty(false) }
    finally { setSaving(false) }
  }

  const createdAt = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
  })

  return (
    <tr style={{ borderBottom: '1px solid rgba(249,200,212,0.2)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,200,212,0.06)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

      {/* Client */}
      <td className="px-4 py-3">
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#2D2340' }}>
          {order.customerInfo.firstName} {order.customerInfo.lastName}
        </p>
        <p style={{ fontSize: '11px', color: '#C4B0D8', marginTop: 2 }}>{order.customerInfo.phone}</p>
      </td>

      {/* Localisation */}
      <td className="px-4 py-3 hidden md:table-cell">
        <p style={{ fontSize: '13px', color: '#7B6B8A' }}>{order.customerInfo.wilaya}</p>
        <p style={{ fontSize: '11px', color: '#C4B0D8' }}>{order.customerInfo.commune}</p>
      </td>

      {/* Articles */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="space-y-0.5 max-w-[180px]">
          {order.items.map((item, i) => (
            <p key={i} style={{ fontSize: '11px', color: '#B8A8C8' }} className="truncate">
              {item.quantity}× {item.name} <span style={{ color: '#D4C0E0' }}>T{item.size}</span>
            </p>
          ))}
        </div>
      </td>

      {/* Total */}
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <span style={{ fontSize: '15px', fontWeight: 800, color: '#2D2340' }}>
          {(order.total ?? 0).toLocaleString('fr-DZ')}
          <span style={{ fontSize: '10px', color: '#C4B0D8', marginLeft: 3, fontWeight: 400 }}>DA</span>
        </span>
      </td>

      {/* Date */}
      <td className="px-4 py-3 hidden sm:table-cell whitespace-nowrap"
          style={{ fontSize: '11px', color: '#C4B0D8' }}>
        {createdAt}
      </td>

      {/* Statut */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <select value={status} onChange={handleStatusChange}
            className="rounded-full px-3 py-1.5 text-xs font-body font-bold outline-none cursor-pointer appearance-none"
            style={{
              background: STATUS_BG[status],
              color: STATUS_COLORS[status],
              border: `1.5px solid ${STATUS_COLORS[status]}40`,
              fontFamily: 'Nunito, sans-serif',
            }}>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {dirty && (
            <button onClick={handleSave} disabled={saving}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-all"
              style={{ background: '#9B5FC0', opacity: saving ? 0.7 : 1 }}>
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default AdminOrderRow