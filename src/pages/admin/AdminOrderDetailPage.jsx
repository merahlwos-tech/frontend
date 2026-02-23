import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Loader2, Package } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const STATUS_LABELS  = { 'en attente': 'En attente', confirmé: 'Confirmé', 'en livraison': 'En livraison', livré: 'Livré', retour: 'Retour', annulé: 'Annulé' }
const STATUS_COLORS  = { 'en attente': '#B8A8C8', confirmé: '#7BC8E8', 'en livraison': '#F4C94A', livré: '#7BC8A0', retour: '#F4A460', annulé: '#E8A0A0' }

function AdminOrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => { toast.error('Commande introuvable'); navigate('/admin/orders') })
      .finally(() => setLoading(false))
  }, [id])

  const downloadPDF = () => {
    if (!order) return

    const date = new Date(order.createdAt).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })

    const itemsRows = order.items.map(item => `
      <tr style="border-bottom: 1px solid #F0EDF5;">
        <td style="padding: 10px 8px; font-size: 13px; color: #1A1A2E;">${item.name}${item.size && item.size !== 'null' ? ` — Taille ${item.size}` : ''}</td>
        <td style="padding: 10px 8px; font-size: 13px; color: #666; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 8px; font-size: 13px; color: #1A1A2E; text-align: right; font-weight: 700;">${(item.price * item.quantity).toLocaleString('fr-DZ')} DA</td>
      </tr>
    `).join('')

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Commande #${order._id.slice(-6).toUpperCase()}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: white; color: #1A1A2E; padding: 40px; max-width: 650px; margin: 0 auto; }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #F0EDF5; }
    .brand { font-size: 22px; font-weight: 800; color: #1A1A2E; }
    .badge { background: #F0F7EE; color: #4A8C6A; padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #AAA; margin-bottom: 12px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-item { background: #F9F8FC; border-radius: 12px; padding: 12px 16px; }
    .info-label { font-size: 10px; color: #AAA; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
    .info-value { font-size: 14px; font-weight: 700; color: #1A1A2E; }
    table { width: 100%; border-collapse: collapse; }
    .total-row { padding: 14px 8px; display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #1A1A2E; margin-top: 8px; }
    .total-label { font-size: 13px; font-weight: 700; color: #1A1A2E; }
    .total-value { font-size: 20px; font-weight: 900; color: #1A1A2E; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #F0EDF5; font-size: 11px; color: #AAA; text-align: center; }
    .status-badge { display: inline-block; padding: 4px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; background: #FFF3F0; color: #B05A40; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">🌿 Tinkerbells</div>
      <div style="font-size: 12px; color: #AAA; margin-top: 2px;">Beauty World</div>
    </div>
    <div>
      <div style="font-size: 11px; color: #AAA; text-align: right;">Commande</div>
      <div style="font-size: 18px; font-weight: 800; color: #1A1A2E;">#${order._id.slice(-6).toUpperCase()}</div>
      <div style="font-size: 11px; color: #AAA; margin-top: 2px;">${date}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Informations client</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Nom complet</div>
        <div class="info-value">${order.customerInfo.firstName} ${order.customerInfo.lastName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Téléphone</div>
        <div class="info-value">${order.customerInfo.phone}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Wilaya</div>
        <div class="info-value">${order.customerInfo.wilaya}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Commune</div>
        <div class="info-value">${order.customerInfo.commune}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Articles commandés</div>
    <table>
      <thead>
        <tr style="border-bottom: 2px solid #F0EDF5;">
          <th style="padding: 8px 8px; text-align: left; font-size: 11px; color: #AAA; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Produit</th>
          <th style="padding: 8px 8px; text-align: center; font-size: 11px; color: #AAA; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Qté</th>
          <th style="padding: 8px 8px; text-align: right; font-size: 11px; color: #AAA; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Montant</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>
    <div class="total-row">
      <span class="total-label">Total</span>
      <span class="total-value">${(order.total ?? 0).toLocaleString('fr-DZ')} DA</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Statut</div>
    <span class="status-badge">${STATUS_LABELS[order.status] || order.status}</span>
    <p style="font-size: 12px; color: #AAA; margin-top: 8px;">Paiement à la livraison · Livraison dans toute l'Algérie</p>
  </div>

  <div class="footer">
    Généré le ${new Date().toLocaleDateString('fr-FR')} · Tinkerbells Beauty World 🌿
  </div>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `commande_${order._id.slice(-6).toUpperCase()}_${order.customerInfo.lastName}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Fichier téléchargé ✓')
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={28} className="animate-spin" style={{ color: '#C4B0D8' }} />
    </div>
  )

  if (!order) return null

  const statusColor = STATUS_COLORS[order.status] || '#B8A8C8'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/orders')}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(249,200,212,0.3)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={16} style={{ color: '#7B6B8A' }} />
          </button>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#9B5FC0', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Détail commande</p>
            <h1 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.8rem', fontWeight: 700, color: '#2D2340' }}>
              #{order._id.slice(-6).toUpperCase()}
            </h1>
          </div>
        </div>
        <button onClick={downloadPDF}
          className="flex items-center gap-2 rounded-full px-5 py-3 text-white text-sm font-bold"
          style={{ background: '#9B5FC0', boxShadow: '0 4px 16px rgba(155,95,192,0.3)', fontFamily: 'Nunito, sans-serif' }}>
          <Download size={14} /> Télécharger
        </button>
      </div>

      {/* Statut + Date */}
      <div className="flex items-center gap-3 flex-wrap">
        <span style={{ padding: '6px 16px', borderRadius: 50, fontSize: 13, fontWeight: 700, background: `${statusColor}20`, color: statusColor, border: `1.5px solid ${statusColor}40` }}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
        <span style={{ fontSize: 13, color: '#C4B0D8' }}>
          {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Infos client */}
      <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 24, padding: '20px 24px', border: '1.5px solid rgba(249,200,212,0.3)' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#C4B0D8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Informations client</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Prénom', value: order.customerInfo.firstName },
            { label: 'Nom', value: order.customerInfo.lastName },
            { label: 'Téléphone', value: order.customerInfo.phone },
            { label: 'Wilaya', value: order.customerInfo.wilaya },
            { label: 'Commune', value: order.customerInfo.commune },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#F9F8FC', borderRadius: 12, padding: '10px 14px' }}>
              <p style={{ fontSize: '10px', color: '#C4B0D8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#2D2340' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 24, padding: '20px 24px', border: '1.5px solid rgba(249,200,212,0.3)' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#C4B0D8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Articles commandés</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {order.items.map((item, i) => {
            const product = item.product
            const img = product?.images?.[0] || item.image
            return (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px', background: '#F9F8FC', borderRadius: 16 }}>
                {/* Image */}
                <div style={{ width: 60, height: 60, borderRadius: 12, overflow: 'hidden', background: '#F0EDF5', flexShrink: 0 }}>
                  {img
                    ? <img src={img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={20} style={{ color: '#C4B0D8' }} /></div>}
                </div>
                {/* Infos */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#2D2340', marginBottom: 3 }}>{item.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.size && item.size !== 'null' && (
                      <span style={{ fontSize: '11px', background: 'rgba(155,95,192,0.1)', color: '#9B5FC0', padding: '2px 10px', borderRadius: 50, fontWeight: 600 }}>
                        Taille {item.size}
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: '#C4B0D8' }}>×{item.quantity}</span>
                  </div>
                </div>
                {/* Prix */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: '#2D2340' }}>{(item.price * item.quantity).toLocaleString('fr-DZ')} DA</p>
                  <p style={{ fontSize: '11px', color: '#C4B0D8' }}>{item.price.toLocaleString('fr-DZ')} DA / u</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Total */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1.5px solid rgba(249,200,212,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#8B7A9B', fontWeight: 600 }}>Total</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2D2340', fontFamily: 'Nunito, sans-serif' }}>
            {(order.total ?? 0).toLocaleString('fr-DZ')} DA
          </span>
        </div>
        <p style={{ fontSize: '11px', color: '#C4B0D8', textAlign: 'right', marginTop: 4 }}>
          🚚 Paiement à la livraison
        </p>
      </div>
    </div>
  )
}

export default AdminOrderDetailPage