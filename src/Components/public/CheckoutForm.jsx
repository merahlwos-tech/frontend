import { useState, useCallback } from 'react'
import { ChevronDown, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import wilayas from '../../data/wilayas'

/* ══════════════════════════════════════════════
   MODALE AVERTISSEMENT FRAUDE
══════════════════════════════════════════════ */
function FraudWarningModal({ onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(45,35,64,0.55)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: '28px 24px',
        maxWidth: 380, width: '100%',
        boxShadow: '0 20px 60px rgba(45,35,64,0.25)',
        animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}>
        {/* Icône */}
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(249,200,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <AlertTriangle size={26} style={{ color: '#C4607A' }} />
        </div>

        <h3 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.4rem', fontWeight: 700, color: '#2D2340', textAlign: 'center', marginBottom: 12 }}>
          Confirmer ta commande
        </h3>

        <div style={{ background: 'rgba(249,200,212,0.15)', borderRadius: 14, padding: '14px', marginBottom: 16, border: '1px solid rgba(249,200,212,0.4)' }}>
          <p style={{ fontSize: 13, color: '#5A4A6A', lineHeight: 1.7, textAlign: 'center' }}>
            En confirmant, tu attestes que les informations fournies sont <strong>exactes et sincères</strong>.
          </p>
        </div>

        <div style={{ background: 'rgba(232,160,160,0.1)', borderRadius: 14, padding: '12px 14px', marginBottom: 20, border: '1px solid rgba(232,160,160,0.3)' }}>
          <p style={{ fontSize: 12, color: '#8B4A5A', lineHeight: 1.65, textAlign: 'center' }}>
            ⚠️ Les commandes <strong>mensongères ou frauduleuses</strong> causent un préjudice réel au vendeur. Nous nous réservons le droit de signaler tout abus.
          </p>
        </div>

        <div className="flex flex-col gap-3">
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
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════
   FORMULAIRE DE LIVRAISON
══════════════════════════════════════════════ */
function CheckoutForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', wilaya: '', commune: '' })
  const [errors, setErrors] = useState({})
  const [showModal, setShowModal] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Prénom requis'
    if (!form.lastName.trim()) e.lastName = 'Nom requis'
    if (!form.phone.trim()) e.phone = 'Téléphone requis'
    else if (!/^(0)(5|6|7)\d{8}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Numéro invalide (ex: 0551234567)'
    if (!form.wilaya) e.wilaya = 'Wilaya requise'
    if (!form.commune.trim()) e.commune = 'Commune requise'
    return e
  }

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setShowModal(true)
  }

  const handleConfirm = () => {
    onSubmit(form)
  }

  const inputStyle = (hasErr) => ({
    width: '100%', padding: '11px 14px', borderRadius: 14, outline: 'none',
    border: `1.5px solid ${hasErr ? '#F9C8D4' : 'rgba(249,200,212,0.4)'}`,
    background: hasErr ? '#FFF8FA' : 'white', color: '#2D2340',
    fontFamily: 'Nunito, sans-serif', fontSize: '13px', transition: 'all .2s',
    boxShadow: '0 1px 6px rgba(155,95,192,0.06)',
  })

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prénom</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
              placeholder="Amina" style={inputStyle(errors.firstName)}
              onFocus={e => e.target.style.borderColor = '#9B5FC0'}
              onBlur={e => e.target.style.borderColor = errors.firstName ? '#F9C8D4' : 'rgba(249,200,212,0.4)'} />
            {errors.firstName && <p style={{ fontSize: 11, color: '#C4607A', marginTop: 3 }}>{errors.firstName}</p>}
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nom</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
              placeholder="Benali" style={inputStyle(errors.lastName)}
              onFocus={e => e.target.style.borderColor = '#9B5FC0'}
              onBlur={e => e.target.style.borderColor = errors.lastName ? '#F9C8D4' : 'rgba(249,200,212,0.4)'} />
            {errors.lastName && <p style={{ fontSize: 11, color: '#C4607A', marginTop: 3 }}>{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Téléphone</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange}
            placeholder="0551234567" inputMode="numeric" style={inputStyle(errors.phone)}
            onFocus={e => e.target.style.borderColor = '#9B5FC0'}
            onBlur={e => e.target.style.borderColor = errors.phone ? '#F9C8D4' : 'rgba(249,200,212,0.4)'} />
          {errors.phone && <p style={{ fontSize: 11, color: '#C4607A', marginTop: 3 }}>{errors.phone}</p>}
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Wilaya</label>
          <div style={{ position: 'relative' }}>
            <select name="wilaya" value={form.wilaya} onChange={handleChange}
              style={{ ...inputStyle(errors.wilaya), appearance: 'none', cursor: 'pointer', paddingRight: 36 }}>
              <option value="">Sélectionner une wilaya</option>
              {wilayas.map(w => <option key={w.code} value={w.name}>{w.code} — {w.name}</option>)}
            </select>
            <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#C4B0D8', pointerEvents: 'none' }} />
          </div>
          {errors.wilaya && <p style={{ fontSize: 11, color: '#C4607A', marginTop: 3 }}>{errors.wilaya}</p>}
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Commune</label>
          <input type="text" name="commune" value={form.commune} onChange={handleChange}
            placeholder="Votre commune" style={inputStyle(errors.commune)}
            onFocus={e => e.target.style.borderColor = '#9B5FC0'}
            onBlur={e => e.target.style.borderColor = errors.commune ? '#F9C8D4' : 'rgba(249,200,212,0.4)'} />
          {errors.commune && <p style={{ fontSize: 11, color: '#C4607A', marginTop: 3 }}>{errors.commune}</p>}
        </div>

        <button type="submit"
          style={{ width: '100%', background: 'linear-gradient(135deg, #9B5FC0, #B896D4)', color: 'white', border: 'none', borderRadius: 50, padding: '14px', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 4px 16px rgba(155,95,192,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          🛍️ Confirmer la commande
        </button>
      </form>

      {showModal && (
        <FraudWarningModal
          loading={loading}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  )
}

export default CheckoutForm