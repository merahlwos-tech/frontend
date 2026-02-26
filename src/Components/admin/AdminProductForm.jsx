import { useState } from 'react'
import { Plus, Trash2, Upload, X, Loader2 } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['Skincare', 'Makeup', 'Body Care', 'Hair Care']

const EMPTY = { name: '', brand: '', category: 'Skincare', price: '', stock: '', description: '', images: [], tags: [] }

const inputStyle = (err) => ({
  width: '100%', padding: '10px 14px', borderRadius: 14, outline: 'none',
  border: `1.5px solid ${err ? '#E8A0A0' : 'rgba(249,200,212,0.5)'}`,
  background: err ? '#FFF5F5' : '#FDF8FC', color: '#2D2340',
  fontFamily: 'Nunito, sans-serif', fontSize: '13px', transition: 'all .2s',
})

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ fontSize: '12px', fontWeight: 700, color: '#7B6B8A', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '11px', color: '#E8A0A0', marginTop: 4 }}>{error}</p>}
    </div>
  )
}

function Section({ num, title, color = '#F9C8D4', children }) {
  return (
    <div className="space-y-4 pt-6" style={{ borderTop: '1px solid rgba(249,200,212,0.3)' }}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
             style={{ background: color }}>
          {num}
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#2D2340' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function AdminProductForm({ initialData, onSuccess, onCancel }) {
  const isEditing = !!initialData
  const [form, setForm] = useState(initialData ? {
    ...initialData,
    price: initialData.price.toString(),
    stock: initialData.stock?.toString() ?? '',
    images: initialData.images || [],
    tags: initialData.tags || [],
  } : EMPTY)
  const [errors, setErrors] = useState({})
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [translateLang, setTranslateLang] = useState('ar')

  const handleTranslate = async () => {
    if (!form.description.trim()) return
    setTranslating(true)
    try {
      const langMap = { ar: 'ar', fr: 'fr', en: 'en' }
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(form.description)}&langpair=auto|${langMap[translateLang]}&de=yayamehdi715@gmail.com`
      const res = await fetch(url)
      const data = await res.json()
      const translated = data.responseData?.translatedText
      if (translated) {
        setForm(f => ({ ...f, description: translated }))
        toast.success('Description traduite !')
      } else {
        toast.error('Erreur de traduction')
      }
    } catch (e) {
      toast.error('Erreur de traduction')
    } finally {
      setTranslating(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const uploadFiles = async (files) => {
    if (!files?.length) return
    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach(f => formData.append('images', f))
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      const urls = res.data.urls || res.data
      setForm(p => ({ ...p, images: [...p.images, ...(Array.isArray(urls) ? urls : [urls])] }))
      toast.success('Image(s) uploadée(s) ✨')
    } catch { toast.error("Erreur upload") }
    finally { setUploading(false) }
  }

  const removeImage = (url) => setForm(p => ({ ...p, images: p.images.filter(i => i !== url) }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nom requis'
    if (!form.brand.trim()) e.brand = 'Marque requise'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Prix invalide'
    if (form.stock === '' || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Stock requis (0 ou plus)'
    if (form.images.length === 0 && !isEditing) e.images = 'Au moins une image requise'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        sizes: [],
      }
      if (isEditing) {
        await api.put(`/products/${initialData._id}`, payload)
        toast.success('Produit mis à jour ✨')
      } else {
        await api.post('/products', payload)
        toast.success('Produit créé 🌸')
      }
      onSuccess?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0" noValidate>

      {/* Section 1 — Infos */}
      <div className="space-y-4 pb-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#F9C8D4' }}>1</div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#2D2340' }}>Informations générales</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nom du produit *" error={errors.name}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Ex: Sérum visage..."
              style={inputStyle(errors.name)}
              onFocus={e => e.target.style.borderColor = '#9B5FC0'}
              onBlur={e => e.target.style.borderColor = errors.name ? '#E8A0A0' : 'rgba(249,200,212,0.5)'} />
          </Field>
          <Field label="Marque *" error={errors.brand}>
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="Ex: Shiseido..."
              style={inputStyle(errors.brand)}
              onFocus={e => e.target.style.borderColor = '#9B5FC0'}
              onBlur={e => e.target.style.borderColor = errors.brand ? '#E8A0A0' : 'rgba(249,200,212,0.5)'} />
          </Field>
          <Field label="Catégorie">
            <select name="category" value={form.category} onChange={handleChange} style={{ ...inputStyle(false), cursor: 'pointer' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Prix (DA) *" error={errors.price}>
            <input name="price" value={form.price} onChange={handleChange} type="number" min="0" placeholder="Ex: 1500"
              style={inputStyle(errors.price)}
              onFocus={e => e.target.style.borderColor = '#9B5FC0'}
              onBlur={e => e.target.style.borderColor = errors.price ? '#E8A0A0' : 'rgba(249,200,212,0.5)'} />
          </Field>
          <Field label="Stock *" error={errors.stock}>
            <input name="stock" value={form.stock} onChange={handleChange} type="number" min="0" placeholder="Ex: 50"
              style={inputStyle(errors.stock)}
              onFocus={e => e.target.style.borderColor = '#9B5FC0'}
              onBlur={e => e.target.style.borderColor = errors.stock ? '#E8A0A0' : 'rgba(249,200,212,0.5)'} />
          </Field>
        </div>
        <Field label="Description">
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            placeholder="Décrivez le produit..." style={{ ...inputStyle(false), resize: 'none' }}
            onFocus={e => e.target.style.borderColor = '#9B5FC0'}
            onBlur={e => e.target.style.borderColor = 'rgba(249,200,212,0.5)'} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <select value={translateLang} onChange={e => setTranslateLang(e.target.value)}
              style={{ padding: '5px 10px', borderRadius: 10, border: '1.5px solid rgba(249,200,212,0.5)', background: '#FDF8FC', color: '#2D2340', fontFamily: 'Nunito, sans-serif', fontSize: 12, cursor: 'pointer', outline: 'none' }}>
              <option value="ar">→ Arabe</option>
              <option value="fr">→ Français</option>
              <option value="en">→ Anglais</option>
            </select>
            <button type="button" onClick={handleTranslate} disabled={translating || !form.description.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 10, border: 'none', background: translating || !form.description.trim() ? 'rgba(155,95,192,0.2)' : '#9B5FC0', color: translating || !form.description.trim() ? '#9B5FC0' : 'white', fontFamily: 'Nunito, sans-serif', fontSize: 12, fontWeight: 700, cursor: translating || !form.description.trim() ? 'not-allowed' : 'pointer', transition: 'all .2s' }}>
              {translating ? <Loader2 size={12} className="animate-spin" /> : '✨'}
              {translating ? 'Traduction...' : 'Traduire'}
            </button>
          </div>
        </Field>
      </div>

      {/* Section 2 — Images */}
      <Section num="2" title={`Images ${!isEditing ? '*' : ''}`} color="#C8EDE0">
        <label
          className="flex flex-col items-center justify-center gap-3 rounded-3xl cursor-pointer transition-all"
          style={{
            border: `2px dashed ${dragOver ? '#9B5FC0' : errors.images ? '#E8A0A0' : 'rgba(249,200,212,0.6)'}`,
            background: dragOver ? 'rgba(155,95,192,0.05)' : errors.images ? '#FFF5F5' : 'rgba(249,200,212,0.08)',
            padding: '32px 20px', opacity: uploading ? 0.6 : 1, pointerEvents: uploading ? 'none' : 'auto',
          }}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files) }}>
          <input type="file" accept="image/*" multiple className="hidden" onChange={e => uploadFiles(e.target.files)} />
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
               style={{ background: dragOver ? '#9B5FC0' : 'rgba(249,200,212,0.3)' }}>
            {uploading ? <Loader2 size={24} className="animate-spin" style={{ color: '#9B5FC0' }} />
              : <Upload size={24} style={{ color: dragOver ? 'white' : '#E8A0B4' }} />}
          </div>
          <div className="text-center">
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#2D2340', marginBottom: 2 }}>
              {uploading ? 'Upload en cours...' : 'Glisser-déposer vos images'}
            </p>
            <p style={{ fontSize: '12px', color: '#C4B0D8' }}>ou cliquez pour sélectionner · JPG, PNG, WebP</p>
          </div>
        </label>
        {errors.images && <p style={{ fontSize: '11px', color: '#E8A0A0' }}>{errors.images}</p>}
        {form.images.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {form.images.map((url, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden group" style={{ aspectRatio: '1/1', background: '#F8F3FC' }}>
                <img src={url} alt={`img ${i+1}`} className="w-full h-full object-cover" loading="lazy" />
                <button type="button" onClick={() => removeImage(url)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(45,35,64,0.5)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#E8A0A0' }}>
                    <X size={14} className="text-white" />
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Actions */}
      <div className="flex gap-3 pt-6" style={{ borderTop: '1px solid rgba(249,200,212,0.3)', marginTop: 24 }}>
        <button type="submit" disabled={saving || uploading}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full px-8 py-3 text-white font-body font-bold"
          style={{ background: '#9B5FC0', boxShadow: '0 4px 16px rgba(155,95,192,0.3)', opacity: saving || uploading ? 0.7 : 1 }}>
          {saving && <Loader2 size={15} className="animate-spin" />}
          {isEditing ? 'Mettre à jour ✨' : 'Créer le produit 🌸'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-6 py-3 rounded-full font-body font-bold text-sm"
            style={{ background: 'rgba(249,200,212,0.3)', color: '#7B6B8A' }}>
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}

export default AdminProductForm