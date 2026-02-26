import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight, Heart, Minus, Plus, Zap, AlertTriangle, CheckCircle, Loader2, X, RotateCcw } from 'lucide-react'
import api from '../../utils/api'
import { useDeliveryFees } from '../../hooks/useDeliveryFees'
import { useLang } from '../../context/LanguageContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { ChevronDown } from 'lucide-react'
import wilayas from '../../data/wilayas'
import toast from 'react-hot-toast'

/* ══════════════════════════════════════════════
   MODALE AVERTISSEMENT FRAUDE
══════════════════════════════════════════════ */
function FraudWarningModal({ onConfirm, onCancel, loading, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(45,35,64,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0', animation: 'fadeIn 0.2s ease' }}>
      <div style={{ background: 'white', borderRadius: '24px 24px 0 0', padding: '24px 20px 32px', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 -8px 40px rgba(45,35,64,0.20)', animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
        <div style={{ width: 36, height: 4, background: 'rgba(200,180,220,0.4)', borderRadius: 99, margin: '0 auto 20px' }} />

        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(249,200,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <AlertTriangle size={24} style={{ color: '#C4607A' }} />
        </div>
        <h3 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.4rem', fontWeight: 700, color: '#2D2340', textAlign: 'center', marginBottom: 12 }}>
          Confirmer ta commande
        </h3>
        <div style={{ background: 'rgba(249,200,212,0.15)', borderRadius: 14, padding: '12px', marginBottom: 12, border: '1px solid rgba(249,200,212,0.4)' }}>
          <p style={{ fontSize: 13, color: '#5A4A6A', lineHeight: 1.7, textAlign: 'center' }}>
            En confirmant, tu attestes que les informations fournies sont <strong>exactes et sincères</strong>.
          </p>
        </div>
        <div style={{ background: 'rgba(232,160,160,0.1)', borderRadius: 14, padding: '12px', marginBottom: 20, border: '1px solid rgba(232,160,160,0.3)' }}>
          <p style={{ fontSize: 12, color: '#8B4A5A', lineHeight: 1.65, textAlign: 'center' }}>
            ⚠️ Les commandes <strong>mensongères ou frauduleuses</strong> causent un préjudice réel au vendeur. Tout abus peut être signalé.
          </p>
        </div>

        {children}

        <div className="flex flex-col gap-3" style={{ marginTop: 16 }}>
          <button onClick={onConfirm} disabled={loading}
            style={{ background: '#9B5FC0', color: 'white', border: 'none', borderRadius: 50, padding: '13px', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 4px 16px rgba(155,95,192,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
            {loading ? 'Traitement...' : 'Oui, confirmer ma commande'}
          </button>
          <button onClick={onCancel} disabled={loading}
            style={{ background: 'rgba(249,200,212,0.3)', color: '#7B6B8A', border: 'none', borderRadius: 50, padding: '12px', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' }}>
            Annuler
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════
   TOAST D'ANNULATION 5 secondes
══════════════════════════════════════════════ */
function CancelToast({ onCancel, onDismiss }) {
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef(null)
  const DURATION = 5000

  useEffect(() => {
    const start = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100)
      setProgress(remaining)
      if (remaining <= 0) { clearInterval(intervalRef.current); onDismiss() }
    }, 50)
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, width: 340, maxWidth: 'calc(100vw - 32px)', background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(45,35,64,0.18)', border: '1.5px solid rgba(249,200,212,0.5)', overflow: 'hidden', animation: 'slideDown 0.35s ease' }}>
      <div style={{ padding: '14px 16px 10px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
          <div className="flex items-center gap-2">
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(155,95,192,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={14} style={{ color: '#9B5FC0' }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#2D2340', lineHeight: 1 }}>Commande passée ! 🎉</p>
              <p style={{ fontSize: 11, color: '#8B7A9B', marginTop: 2 }}>5 secondes pour annuler</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onCancel} style={{ background: 'rgba(249,200,212,0.3)', border: 'none', borderRadius: 50, padding: '5px 10px', fontSize: 11, fontWeight: 700, color: '#C4607A', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
              <RotateCcw size={11} /> Annuler
            </button>
            <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4B0D8', padding: 4 }}>
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
      <div style={{ height: 4, background: 'rgba(249,200,212,0.25)' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #9B5FC0, #E8A0B4)', borderRadius: 2, transition: 'width 0.05s linear' }} />
      </div>
      <style>{`@keyframes slideDown { from { transform: translateX(-50%) translateY(-20px); opacity: 0 } to { transform: translateX(-50%) translateY(0); opacity: 1 } }`}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════
   FORMULAIRE ACHAT DIRECT (bottom sheet)
══════════════════════════════════════════════ */
function DirectBuySheet({ product, quantity, onClose, onSuccess }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', wilayaId: '', wilayaName: '', communeId: '', communeName: '' })
  const [errors, setErrors] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { t } = useLang()
  const { wilayas, communes, deliveryFee, deliverySpeed, deliveryType, loadingFee, loadingCommunes, onWilayaChange, onCommuneChange, onDeliverySpeedChange, onDeliveryTypeChange, currentCommuneFees } = useDeliveryFees()

  const productTotal = product.price * quantity
  const totalWithDelivery = deliveryFee != null ? productTotal + deliveryFee : null

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Prénom requis'
    if (!form.lastName.trim()) e.lastName = 'Nom requis'
    if (!form.phone.trim()) e.phone = 'Téléphone requis'
    else if (!/^(0)(5|6|7)\d{8}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Numéro invalide'
    if (!form.wilayaId) e.wilaya = 'Wilaya requise'
    if (!form.communeId) e.commune = 'Commune requise'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleWilayaChange = (e) => {
    const selected = wilayas.find(w => String(w.id) === e.target.value)
    setForm(p => ({ ...p, wilayaId: e.target.value, wilayaName: selected?.name || '', communeId: '', communeName: '' }))
    setErrors(p => ({ ...p, wilaya: '', commune: '' }))
    onWilayaChange(e.target.value)
  }

  const handleCommuneChange = (e) => {
    const selected = communes.find(c => String(c.id) === e.target.value)
    setForm(p => ({ ...p, communeId: e.target.value, communeName: selected?.name || '' }))
    setErrors(p => ({ ...p, commune: '' }))
    onCommuneChange(e.target.value)
  }

  const handleSubmitForm = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setShowModal(true)
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      const finalTotal = productTotal + (deliveryFee || 0)
      const res = await api.post('/orders', {
        customerInfo: { firstName: form.firstName, lastName: form.lastName, phone: form.phone, wilaya: form.wilayaName, commune: form.communeName },
        items: [{ product: product._id, name: product.name, quantity, price: product.price }],
        total: finalTotal,
        deliveryFee: deliveryFee || 0,
        deliveryType: deliveryType || 'home',
        deliverySpeed: deliverySpeed || 'express',
      })
      onSuccess(res.data?._id || res.data?.id)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande.')
      setSubmitting(false)
      setShowModal(false)
    }
  }

  const iStyle = (err) => ({ width: '100%', padding: '10px 13px', borderRadius: 12, outline: 'none', border: `1.5px solid ${err ? '#F9C8D4' : 'rgba(249,200,212,0.4)'}`, background: 'white', color: '#2D2340', fontFamily: 'Nunito, sans-serif', fontSize: '13px', boxShadow: '0 1px 4px rgba(155,95,192,0.05)' })

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(45,35,64,0.4)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 901, background: 'white', borderRadius: '24px 24px 0 0', padding: '20px 20px 36px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 -8px 40px rgba(45,35,64,0.15)', animation: 'slideUp 0.3s ease' }}>
        <div style={{ width: 36, height: 4, background: 'rgba(200,180,220,0.4)', borderRadius: 99, margin: '0 auto 18px' }} />

        {/* Résumé commande */}
        <div className="flex items-center gap-3" style={{ background: 'rgba(155,95,192,0.06)', borderRadius: 14, padding: '12px', marginBottom: 18 }}>
          {product.images?.[0] && <img src={product.images[0]} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} loading="lazy" />}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#2D2340', marginBottom: 2 }}>{product.name}</p>
            <p style={{ fontSize: 12, color: '#9B5FC0', fontWeight: 700 }}>Qté : {quantity} · {(product.price * quantity).toFixed(0)} DA</p>
          </div>
          <div style={{ background: '#9B5FC0', color: 'white', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>
            {t('direct_buy_label')}
          </div>
        </div>

        <p style={{ fontSize: 12, fontWeight: 700, color: '#8B7A9B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>{t('delivery_info')}</p>

        <form onSubmit={handleSubmitForm} className="space-y-3" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Prénom *" style={iStyle(errors.firstName)} />
              {errors.firstName && <p style={{ fontSize: 10, color: '#C4607A', marginTop: 2 }}>{errors.firstName}</p>}
            </div>
            <div>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Nom *" style={iStyle(errors.lastName)} />
              {errors.lastName && <p style={{ fontSize: 10, color: '#C4607A', marginTop: 2 }}>{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Téléphone * (ex: 0551234567)" inputMode="numeric" style={iStyle(errors.phone)} />
            {errors.phone && <p style={{ fontSize: 10, color: '#C4607A', marginTop: 2 }}>{errors.phone}</p>}
          </div>
          {/* Wilaya */}
          <div style={{ position: 'relative' }}>
            <select value={form.wilayaId} onChange={handleWilayaChange} style={{ ...iStyle(errors.wilaya), appearance: 'none', paddingRight: 32, cursor: 'pointer' }}>
              <option value="">Wilaya *</option>
              {wilayas.filter(w => w.is_deliverable).map(w => (
                <option key={w.id} value={String(w.id)}>{String(w.id).padStart(2,'0')} — {w.name}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#C4B0D8', pointerEvents: 'none' }} />
            {errors.wilaya && <p style={{ fontSize: 10, color: '#C4607A', marginTop: 2 }}>{errors.wilaya}</p>}
          </div>
          {/* Commune */}
          <div style={{ position: 'relative' }}>
            <select value={form.communeId} onChange={handleCommuneChange} disabled={!form.wilayaId || loadingCommunes}
              style={{ ...iStyle(errors.commune), appearance: 'none', paddingRight: 32, cursor: form.wilayaId ? 'pointer' : 'not-allowed', opacity: !form.wilayaId ? 0.5 : 1 }}>
              <option value="">{loadingCommunes ? 'Chargement...' : 'Commune *'}</option>
              {communes.filter(c => c.is_deliverable).map(c => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#C4B0D8', pointerEvents: 'none' }} />
            {errors.commune && <p style={{ fontSize: 10, color: '#C4607A', marginTop: 2 }}>{errors.commune}</p>}
          </div>
          {/* Options livraison */}
          {form.communeId && !loadingFee && (
            <div style={{ background: 'rgba(155,95,192,0.06)', borderRadius: 12, padding: '12px', border: '1px solid rgba(155,95,192,0.12)' }}>

              {/* {t('del_speed')} */}
              <p style={{ fontSize: 10, fontWeight: 700, color: '#8B7A9B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{t('del_speed')}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
                <button type="button" onClick={() => onDeliverySpeedChange('express')}
                  style={{ padding: '8px 6px', borderRadius: 10, border: `2px solid ${deliverySpeed === 'express' ? '#9B5FC0' : 'rgba(155,95,192,0.2)'}`, background: deliverySpeed === 'express' ? 'rgba(155,95,192,0.08)' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, marginBottom: 1 }}>⚡</div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: deliverySpeed === 'express' ? '#9B5FC0' : '#5A4A6A' }}>{t('del_express')}</p>
                  <p style={{ fontSize: 9, color: '#AAA' }}>{t('del_express_time')}</p>
                </button>
                <button type="button" onClick={() => onDeliverySpeedChange('economic')}
                  disabled={currentCommuneFees?.economic_home == null && currentCommuneFees?.economic_desk == null}
                  style={{ padding: '8px 6px', borderRadius: 10, border: `2px solid ${deliverySpeed === 'economic' ? '#9B5FC0' : 'rgba(155,95,192,0.2)'}`, background: deliverySpeed === 'economic' ? 'rgba(155,95,192,0.08)' : 'white', cursor: (currentCommuneFees?.economic_home == null && currentCommuneFees?.economic_desk == null) ? 'not-allowed' : 'pointer', textAlign: 'center', opacity: (currentCommuneFees?.economic_home == null && currentCommuneFees?.economic_desk == null) ? 0.4 : 1 }}>
                  <div style={{ fontSize: 14, marginBottom: 1 }}>🌿</div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: deliverySpeed === 'economic' ? '#9B5FC0' : '#5A4A6A' }}>{t('del_eco')}</p>
                  <p style={{ fontSize: 9, color: '#AAA' }}>{(currentCommuneFees?.economic_home == null && currentCommuneFees?.economic_desk == null) ? t('del_na') : t('del_eco_time')}</p>
                </button>
              </div>

              {/* {t('del_dest')} */}
              <p style={{ fontSize: 10, fontWeight: 700, color: '#8B7A9B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{t('del_dest')}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
                <button type="button" onClick={() => onDeliveryTypeChange('home')}
                  style={{ padding: '8px 6px', borderRadius: 10, border: `2px solid ${deliveryType === 'home' ? '#9B5FC0' : 'rgba(155,95,192,0.2)'}`, background: deliveryType === 'home' ? 'rgba(155,95,192,0.08)' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, marginBottom: 1 }}>🏠</div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: deliveryType === 'home' ? '#9B5FC0' : '#5A4A6A', marginBottom: 1 }}>{t('del_home')}</p>
                  <p style={{ fontSize: 10, fontWeight: 800, color: '#2D2340' }}>
                    {deliverySpeed === 'express'
                      ? (currentCommuneFees?.express_home != null ? `${currentCommuneFees.express_home.toLocaleString('fr-DZ')} DA` : '—')
                      : (currentCommuneFees?.economic_home != null ? `${currentCommuneFees.economic_home.toLocaleString('fr-DZ')} DA` : '—')}
                  </p>
                </button>
                <button type="button" onClick={() => onDeliveryTypeChange('desk')}
                  style={{ padding: '8px 6px', borderRadius: 10, border: `2px solid ${deliveryType === 'desk' ? '#9B5FC0' : 'rgba(155,95,192,0.2)'}`, background: deliveryType === 'desk' ? 'rgba(155,95,192,0.08)' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, marginBottom: 1 }}>🏢</div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: deliveryType === 'desk' ? '#9B5FC0' : '#5A4A6A', marginBottom: 1 }}>{t('del_desk')}</p>
                  <p style={{ fontSize: 10, fontWeight: 800, color: '#2D2340' }}>
                    {deliverySpeed === 'express'
                      ? (currentCommuneFees?.express_desk != null ? `${currentCommuneFees.express_desk.toLocaleString('fr-DZ')} DA` : '—')
                      : (currentCommuneFees?.economic_desk != null ? `${currentCommuneFees.economic_desk.toLocaleString('fr-DZ')} DA` : '—')}
                  </p>
                </button>
              </div>

              {deliveryFee != null ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(155,95,192,0.2)', paddingTop: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#2D2340' }}>{t('del_total')}</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#2D2340' }}>{(totalWithDelivery ?? productTotal).toLocaleString('fr-DZ')} DA</span>
                </div>
              ) : (
                <p style={{ fontSize: 11, color: '#C4607A' }}>⚠️ Option non disponible ici</p>
              )}
            </div>
          )}
          {form.wilayaId && !form.communeId && !loadingFee && (
            <p style={{ fontSize: 11, color: '#8B7A9B', textAlign: 'center' }}>{t('del_pick_commune')}</p>
          )}
          {form.wilayaId && loadingFee && (
            <p style={{ fontSize: 11, color: '#8B7A9B' }}>{t('del_calculating')}</p>
          )}
          <button type="submit"
            style={{ width: '100%', background: 'linear-gradient(135deg, #9B5FC0, #B896D4)', color: 'white', border: 'none', borderRadius: 50, padding: '14px', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 4px 16px rgba(155,95,192,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
            <Zap size={15} /> {t('direct_buy_btn')}
          </button>
        </form>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>

      {showModal && (
        <FraudWarningModal loading={submitting} onConfirm={handleConfirm} onCancel={() => setShowModal(false)}>
          <div style={{ background: 'rgba(155,95,192,0.06)', borderRadius: 14, padding: '10px 14px', border: '1px solid rgba(155,95,192,0.15)', marginBottom: 4 }}>
            <p style={{ fontSize: 12, color: '#5A4A6A', textAlign: 'center' }}>
              📦 <strong>{product.name}</strong> × {quantity}<br />
              <span style={{ color: '#9B5FC0', fontWeight: 700 }}>Produit : {productTotal.toLocaleString('fr-DZ')} DA</span><br/>
              {deliveryFee != null && <><span style={{ color: '#8B7A9B' }}>Livraison : {deliveryFee.toLocaleString('fr-DZ')} DA</span><br/></>}
              <span style={{ color: '#2D2340', fontWeight: 900, fontSize: 14 }}>Total : {(totalWithDelivery ?? productTotal).toLocaleString('fr-DZ')} DA</span>
            </p>
          </div>
        </FraudWarningModal>
      )}
    </>
  )
}

/* ══════════════════════════════════════════════
   PAGE DÉTAIL PRODUIT
══════════════════════════════════════════════ */
function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, cartItems } = useCart()
  const { toggle, isWished } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { t, lang } = useLang()
  const [currentImage, setCurrentImage] = useState(0)
  const [showDirectBuy, setShowDirectBuy] = useState(false)
  const [showCancelToast, setShowCancelToast] = useState(false)
  const lastOrderRef = useRef(null)

  useEffect(() => { window.scrollTo(0, 0) }, [id])
  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FEF0F8' }}>
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '3px solid rgba(249,200,212,0.3)', borderTopColor: '#9B5FC0' }} />
    </div>
  )
  if (!product) return null

  const liked = isWished(product._id)
  const images = product.images?.length > 0 ? product.images : ['/placeholder.jpg']
  const cartQty = cartItems?.reduce((acc, item) => item._id === product._id || item.product?._id === product._id || item.productId === product._id ? acc + (item.quantity || 1) : acc, 0) || 0

  const CAT_COLORS = { 'Skincare': { bg: '#FFE8EF', color: '#C4607A' }, 'Makeup': { bg: '#FFF0E8', color: '#C46020' }, 'Body Care': { bg: '#EBE0FF', color: '#7B3FA0' }, 'Hair Care': { bg: '#D6FFEE', color: '#2A8A60' } }
  const catStyle = CAT_COLORS[product.category] || { bg: '#EBE0FF', color: '#7B3FA0' }

  const handleAddToCart = () => {
    addToCart(product, null, quantity)
    toast.success(`🛍️ ${product.name} ajouté au panier !`)
  }

  const handleDirectBuySuccess = (orderId) => {
    setShowDirectBuy(false)
    sessionStorage.setItem('cancelOrderId', orderId || '')
    navigate('/confirmation', { replace: true, state: { orderId } })
  }

  const handleCartOrder = async (customerInfo) => {
    // Géré depuis CartPage, ici juste pour compatibilité
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: '#FEF0F8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 16px 0' }}>
        <button onClick={() => navigate(-1)} style={{ fontSize: 13, fontWeight: 700, color: '#8B7A9B', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={15} /> Retour
        </button>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Galerie */}
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden group" style={{ aspectRatio: '1/1', background: '#F8F3FC', borderRadius: 24 }}>
              <img src={images[currentImage]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              {images.length > 1 && (<>
                <button onClick={() => setCurrentImage(i => i === 0 ? images.length - 1 : i - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(255,255,255,0.90)', border: 'none', cursor: 'pointer' }}><ChevronLeft size={16} style={{ color: '#5A4A6A' }} /></button>
                <button onClick={() => setCurrentImage(i => i === images.length - 1 ? 0 : i + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(255,255,255,0.90)', border: 'none', cursor: 'pointer' }}><ChevronRight size={16} style={{ color: '#5A4A6A' }} /></button>
              </>)}
              <div className="absolute top-3 left-3"><span className="text-[11px] font-bold px-3 py-1 rounded-full" style={{ background: catStyle.bg, color: catStyle.color }}>{product.category}</span></div>
              <button onClick={() => { const was = isWished(product._id); toggle(product); if (!was) toast.success(t('toast_wish_add'), { duration: 2000 }); else toast(t('toast_wish_rm'), { duration: 1500 }) }} className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: liked ? 'rgba(232,160,180,0.95)' : 'rgba(255,255,255,0.90)', border: 'none', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}>
                <Heart size={17} style={{ fill: liked ? 'white' : 'none', color: liked ? 'white' : '#C4B0D8', strokeWidth: 2 }} />
              </button>
              {cartQty > 0 && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: '#9B5FC0' }}>
                  <ShoppingBag size={11} color="white" />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'white' }}>{cartQty} dans le panier</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)} style={{ aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', border: `2px solid ${i === currentImage ? '#9B5FC0' : 'transparent'}`, padding: 0, background: 'none', cursor: 'pointer' }}>
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="flex flex-col gap-5 animate-fade-up">
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9B5FC0', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{product.brand}</p>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2D2340', lineHeight: 1.25, marginBottom: 12, fontFamily: 'Nunito, sans-serif' }}>{product.name}</h1>
              <div className="flex items-baseline gap-2">
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#2D2340' }}>{(product.price ?? 0).toFixed(0)}</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#8B7A9B' }}>DA</span>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(249,200,212,0.4)' }} />

            {/* Quantité */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>{t('qty')}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center" style={{ background: 'white', borderRadius: 50, border: '1.5px solid rgba(249,200,212,0.5)', boxShadow: '0 2px 10px rgba(155,95,192,0.07)' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#9B5FC0' }}><Minus size={14} /></button>
                  <span style={{ width: 36, textAlign: 'center', fontSize: 16, fontWeight: 800, color: '#2D2340' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#9B5FC0' }}><Plus size={14} /></button>
                </div>
                <div style={{ background: 'rgba(155,95,192,0.08)', borderRadius: 12, padding: '8px 14px' }}>
                  <p style={{ fontSize: 10, color: '#9B5FC0', fontWeight: 700 }}>Total</p>
                  <p style={{ fontSize: 15, fontWeight: 900, color: '#2D2340' }}>{((product.price ?? 0) * quantity).toFixed(0)} DA</p>
                </div>
              </div>
              {cartQty > 0 && <p style={{ fontSize: 12, color: '#9B5FC0', fontWeight: 600, marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}><ShoppingBag size={12} /> {cartQty} déjà dans ton panier</p>}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-3">
              {/* Acheter directement */}
              <button onClick={() => setShowDirectBuy(true)}
                className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #C4607A, #E8A0B4)', boxShadow: '0 4px 20px rgba(196,96,122,0.35)', fontSize: 15, fontFamily: 'Nunito, sans-serif', border: 'none', cursor: 'pointer' }}>
                <Zap size={18} fill="white" />
                Acheter maintenant
              </button>

              {/* Ajouter au panier */}
              <button onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold transition-all hover:opacity-90"
                style={{ background: 'white', color: '#9B5FC0', border: '1.5px solid rgba(155,95,192,0.3)', fontSize: 15, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 2px 10px rgba(155,95,192,0.08)' }}>
                <ShoppingBag size={18} />
                Ajouter au panier
              </button>
            </div>

            {(product.description?.en || product.description) && (
              <>
                <div style={{ height: 1, background: 'rgba(249,200,212,0.4)' }} />
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{t('description')}</p>
                  <p style={{ fontSize: 13, color: '#7B6B8A', lineHeight: 1.75 }}>{typeof product.description === 'object' ? (product.description[lang] || product.description.en) : product.description}</p>
                </div>
              </>
            )}

            <div className="flex items-start gap-3 rounded-2xl p-4" style={{ background: 'rgba(155,95,192,0.07)', border: '1px solid rgba(155,95,192,0.12)' }}>
              <span style={{ fontSize: 22 }}>🚚</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#2D2340', marginBottom: 2 }}>Livraison dans toute l'Algérie 🇩🇿</p>
                <p style={{ fontSize: 12, color: '#8B7A9B' }}>Paiement à la livraison · 2 à 5 jours ouvrables</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom sheet achat direct */}
      {showDirectBuy && (
        <DirectBuySheet
          product={product}
          quantity={quantity}
          onClose={() => setShowDirectBuy(false)}
          onSuccess={handleDirectBuySuccess}
        />
      )}

      {/* Toast annulation */}
      {showCancelToast && (
        <CancelToast
          onCancel={() => { setShowCancelToast(false); toast('Commande annulée', { icon: '↩️' }) }}
          onDismiss={() => setShowCancelToast(false)}
        />
      )}
    </div>
  )
}

export default ProductDetailPage