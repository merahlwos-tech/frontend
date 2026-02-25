import { useState, useCallback } from 'react'
import { ChevronDown, AlertTriangle, CheckCircle, Loader2, Truck } from 'lucide-react'
import { useDeliveryFees } from '../../hooks/useDeliveryFees'
import { useLang } from '../../context/LanguageContext'

/* ══════════════════════════════════════════════
   MODALE AVERTISSEMENT FRAUDE
══════════════════════════════════════════════ */
function FraudWarningModal({ onConfirm, onCancel, loading }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(45,35,64,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s ease' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '28px 24px', maxWidth: 380, width: '100%', boxShadow: '0 20px 60px rgba(45,35,64,0.25)', animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(249,200,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <AlertTriangle size={26} style={{ color: '#C4607A' }} />
        </div>
        <h3 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.4rem', fontWeight: 700, color: '#2D2340', textAlign: 'center', marginBottom: 12 }}>{t('fraud_title')}</h3>
        <div style={{ background: 'rgba(249,200,212,0.15)', borderRadius: 14, padding: '14px', marginBottom: 16, border: '1px solid rgba(249,200,212,0.4)' }}>
          <p style={{ fontSize: 13, color: '#5A4A6A', lineHeight: 1.7, textAlign: 'center' }}>{t('fraud_body')}</p>
        </div>
        <div style={{ background: 'rgba(232,160,160,0.1)', borderRadius: 14, padding: '12px 14px', marginBottom: 20, border: '1px solid rgba(232,160,160,0.3)' }}>
          <p style={{ fontSize: 12, color: '#8B4A5A', lineHeight: 1.65, textAlign: 'center' }}>{t('fraud_warn')}</p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={onConfirm} disabled={loading} style={{ background: '#9B5FC0', color: 'white', border: 'none', borderRadius: 50, padding: '13px', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 4px 16px rgba(155,95,192,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
            {loading ? '{t('fraud_loading')}' : '{t('fraud_ok')}'}
          </button>
          <button onClick={onCancel} disabled={loading} style={{ background: 'rgba(249,200,212,0.3)', color: '#7B6B8A', border: 'none', borderRadius: 50, padding: '12px', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' }}>{t('fraud_cancel')}</button>
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════
   FORMULAIRE DE LIVRAISON
══════════════════════════════════════════════ */
function CheckoutForm({ onSubmit, loading, orderTotal }) {
  const { t } = useLang()
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', wilayaId: '', wilayaName: '', communeId: '', communeName: '' })
  const [errors, setErrors] = useState({})
  const [showModal, setShowModal] = useState(false)

  const { wilayas, communes, deliveryFee, deliverySpeed, deliveryType, loadingFee, loadingCommunes, onWilayaChange, onCommuneChange, onDeliverySpeedChange, onDeliveryTypeChange, currentCommuneFees } = useDeliveryFees()

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = t('f_err_fn')
    if (!form.lastName.trim()) e.lastName = t('f_err_ln')
    if (!form.phone.trim()) e.phone = t('f_err_phone')
    else if (!/^(0)(5|6|7)\d{8}$/.test(form.phone.replace(/\s/g, ''))) e.phone = t('f_err_phone_inv')
    if (!form.wilayaId) e.wilaya = t('f_err_wilaya')
    if (!form.communeId) e.commune = t('f_err_commune')
    return e
  }

  const handleWilayaChange = (e) => {
    const selected = wilayas.find(w => String(w.id) === e.target.value)
    setForm(prev => ({ ...prev, wilayaId: e.target.value, wilayaName: selected?.name || '', communeId: '', communeName: '' }))
    setErrors(prev => ({ ...prev, wilaya: '', commune: '' }))
    onWilayaChange(e.target.value)
  }

  const handleCommuneChange = (e) => {
    const selected = communes.find(c => String(c.id) === e.target.value)
    setForm(prev => ({ ...prev, communeId: e.target.value, communeName: selected?.name || '' }))
    setErrors(prev => ({ ...prev, commune: '' }))
    onCommuneChange(e.target.value)
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
    onSubmit({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      wilaya: form.wilayaName,
      commune: form.communeName,
    }, deliveryFee, deliveryType, deliverySpeed)
  }

  const inputStyle = (hasErr) => ({
    width: '100%', padding: '11px 14px', borderRadius: 14, outline: 'none',
    border: `1.5px solid ${hasErr ? '#F9C8D4' : 'rgba(249,200,212,0.4)'}`,
    background: hasErr ? '#FFF8FA' : 'white', color: '#2D2340',
    fontFamily: 'Nunito, sans-serif', fontSize: '13px', transition: 'all .2s',
    boxShadow: '0 1px 6px rgba(155,95,192,0.06)',
  })

  const totalWithDelivery = orderTotal != null && deliveryFee != null ? orderTotal + deliveryFee : null

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('f_firstname')}</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder={t('f_firstname')} style={inputStyle(errors.firstName)}
              onFocus={e => e.target.style.borderColor = '#9B5FC0'}
              onBlur={e => e.target.style.borderColor = errors.firstName ? '#F9C8D4' : 'rgba(249,200,212,0.4)'} />
            {errors.firstName && <p style={{ fontSize: 11, color: '#C4607A', marginTop: 3 }}>{errors.firstName}</p>}
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('f_lastname')}</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder={t('f_lastname')} style={inputStyle(errors.lastName)}
              onFocus={e => e.target.style.borderColor = '#9B5FC0'}
              onBlur={e => e.target.style.borderColor = errors.lastName ? '#F9C8D4' : 'rgba(249,200,212,0.4)'} />
            {errors.lastName && <p style={{ fontSize: 11, color: '#C4607A', marginTop: 3 }}>{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('f_phone')}</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="0551234567" inputMode="numeric" style={inputStyle(errors.phone)}
            onFocus={e => e.target.style.borderColor = '#9B5FC0'}
            onBlur={e => e.target.style.borderColor = errors.phone ? '#F9C8D4' : 'rgba(249,200,212,0.4)'} />
          {errors.phone && <p style={{ fontSize: 11, color: '#C4607A', marginTop: 3 }}>{errors.phone}</p>}
        </div>

        {/* Wilaya */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('f_wilaya')}</label>
          <div style={{ position: 'relative' }}>
            <select value={form.wilayaId} onChange={handleWilayaChange}
              style={{ ...inputStyle(errors.wilaya), appearance: 'none', cursor: 'pointer', paddingRight: 36 }}>
              <option value="">{t('f_ph_wilaya')}</option>
              {wilayas.filter(w => w.is_deliverable).map(w => (
                <option key={w.id} value={String(w.id)}>{String(w.id).padStart(2,'0')} — {w.name}</option>
              ))}
            </select>
            <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#C4B0D8', pointerEvents: 'none' }} />
          </div>
          {errors.wilaya && <p style={{ fontSize: 11, color: '#C4607A', marginTop: 3 }}>{errors.wilaya}</p>}
        </div>

        {/* Commune */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Commune {loadingCommunes && <Loader2 size={10} style={{ display: 'inline', animation: 'spin 1s linear infinite', marginLeft: 4 }} />}
          </label>
          <div style={{ position: 'relative' }}>
            <select value={form.communeId} onChange={handleCommuneChange} disabled={!form.wilayaId || loadingCommunes}
              style={{ ...inputStyle(errors.commune), appearance: 'none', cursor: form.wilayaId ? 'pointer' : 'not-allowed', paddingRight: 36, opacity: !form.wilayaId ? 0.5 : 1 }}>
              <option value="">{loadingCommunes ? t('f_loading') : '{t('f_ph_commune')}'}</option>
              {communes.filter(c => c.is_deliverable).map(c => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#C4B0D8', pointerEvents: 'none' }} />
          </div>
          {errors.commune && <p style={{ fontSize: 11, color: '#C4607A', marginTop: 3 }}>{errors.commune}</p>}
        </div>

        {/* Options livraison */}
        {form.communeId && !loadingFee && (
          <div style={{ background: 'rgba(155,95,192,0.06)', borderRadius: 14, padding: '14px', border: '1px solid rgba(155,95,192,0.12)' }}>

            {/* {t('del_speed')} : {t('del_express')} / {t('del_eco')} */}
            <p style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{t('del_speed')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              <button type="button" onClick={() => onDeliverySpeedChange('express')}
                style={{ padding: '10px 8px', borderRadius: 12, border: `2px solid ${deliverySpeed === 'express' ? '#9B5FC0' : 'rgba(155,95,192,0.2)'}`, background: deliverySpeed === 'express' ? 'rgba(155,95,192,0.08)' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>⚡</div>
                <p style={{ fontSize: 12, fontWeight: 700, color: deliverySpeed === 'express' ? '#9B5FC0' : '#5A4A6A', marginBottom: 1 }}>{t('del_express')}</p>
                <p style={{ fontSize: 10, color: '#AAA', marginBottom: 3 }}>Livraison en {t('del_express_time')}</p>
              </button>
              <button type="button" onClick={() => onDeliverySpeedChange('economic')}
                disabled={currentCommuneFees?.economic_home == null && currentCommuneFees?.economic_desk == null}
                style={{ padding: '10px 8px', borderRadius: 12, border: `2px solid ${deliverySpeed === 'economic' ? '#9B5FC0' : 'rgba(155,95,192,0.2)'}`, background: deliverySpeed === 'economic' ? 'rgba(155,95,192,0.08)' : 'white', cursor: (currentCommuneFees?.economic_home == null && currentCommuneFees?.economic_desk == null) ? 'not-allowed' : 'pointer', textAlign: 'center', transition: 'all .15s', opacity: (currentCommuneFees?.economic_home == null && currentCommuneFees?.economic_desk == null) ? 0.4 : 1 }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>🌿</div>
                <p style={{ fontSize: 12, fontWeight: 700, color: deliverySpeed === 'economic' ? '#9B5FC0' : '#5A4A6A', marginBottom: 1 }}>{t('del_eco')}</p>
                <p style={{ fontSize: 10, color: '#AAA', marginBottom: 3 }}>
                  {(currentCommuneFees?.economic_home == null && currentCommuneFees?.economic_desk == null) ? '{t('del_na')}' : 'Livraison en {t('del_eco_time')}'}
                </p>
              </button>
            </div>

            {/* {t('del_dest')} : {t('del_home')} / {t('del_desk')} */}
            <p style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{t('del_dest')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              <button type="button" onClick={() => onDeliveryTypeChange('home')}
                style={{ padding: '10px 8px', borderRadius: 12, border: `2px solid ${deliveryType === 'home' ? '#9B5FC0' : 'rgba(155,95,192,0.2)'}`, background: deliveryType === 'home' ? 'rgba(155,95,192,0.08)' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>🏠</div>
                <p style={{ fontSize: 12, fontWeight: 700, color: deliveryType === 'home' ? '#9B5FC0' : '#5A4A6A', marginBottom: 2 }}>{t('del_home')}</p>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#2D2340' }}>
                  {deliverySpeed === 'express'
                    ? (currentCommuneFees?.express_home != null ? `${currentCommuneFees.express_home.toLocaleString('fr-DZ')} DA` : '—')
                    : (currentCommuneFees?.economic_home != null ? `${currentCommuneFees.economic_home.toLocaleString('fr-DZ')} DA` : '—')}
                </p>
              </button>
              <button type="button" onClick={() => onDeliveryTypeChange('desk')}
                style={{ padding: '10px 8px', borderRadius: 12, border: `2px solid ${deliveryType === 'desk' ? '#9B5FC0' : 'rgba(155,95,192,0.2)'}`, background: deliveryType === 'desk' ? 'rgba(155,95,192,0.08)' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>🏢</div>
                <p style={{ fontSize: 12, fontWeight: 700, color: deliveryType === 'desk' ? '#9B5FC0' : '#5A4A6A', marginBottom: 2 }}>{t('del_desk')}</p>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#2D2340' }}>
                  {deliverySpeed === 'express'
                    ? (currentCommuneFees?.express_desk != null ? `${currentCommuneFees.express_desk.toLocaleString('fr-DZ')} DA` : '—')
                    : (currentCommuneFees?.economic_desk != null ? `${currentCommuneFees.economic_desk.toLocaleString('fr-DZ')} DA` : '—')}
                </p>
              </button>
            </div>

            {/* Total */}
            {deliveryFee != null ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(155,95,192,0.2)', paddingTop: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#2D2340' }}>
                  <Truck size={13} /> {t('del_total')}
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#2D2340', fontFamily: 'Nunito, sans-serif' }}>
                  {totalWithDelivery != null ? totalWithDelivery.toLocaleString('fr-DZ') : deliveryFee.toLocaleString('fr-DZ')} DA
                </span>
              </div>
            ) : (
              <p style={{ fontSize: 12, color: '#C4607A' }}>⚠️ {t('del_unavailable')}</p>
            )}
          </div>
        )}
        {form.wilayaId && !form.communeId && !loadingFee && (
          <div style={{ background: 'rgba(155,95,192,0.04)', borderRadius: 14, padding: '12px 14px', border: '1px solid rgba(155,95,192,0.10)' }}>
            <p style={{ fontSize: 12, color: '#8B7A9B', textAlign: 'center' }}>{t('del_pick_commune')}</p>
          </div>
        )}
        {form.wilayaId && loadingFee && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8B7A9B', padding: '4px 0' }}>
            <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> {t('del_calculating')}
          </div>
        )}

        <button type="submit"
          style={{ width: '100%', background: 'linear-gradient(135deg, #9B5FC0, #B896D4)', color: 'white', border: 'none', borderRadius: 50, padding: '14px', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 4px 16px rgba(155,95,192,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          🛍️ Confirmer la commande
        </button>
      </form>

      {showModal && (
        <FraudWarningModal loading={loading} onConfirm={handleConfirm} onCancel={() => setShowModal(false)} />
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  )
}

export default CheckoutForm