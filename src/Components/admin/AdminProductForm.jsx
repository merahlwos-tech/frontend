// src/components/admin/AdminProductForm.jsx
// Formulaire produit admin : création et modification avec tailles dynamiques et upload images

import { useState } from 'react'
import { Plus, Trash2, Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['Homme', 'Femme', 'Sport']

const EMPTY_PRODUCT = {
  name: '',
  brand: '',
  category: 'Homme',
  price: '',
  description: '',
  sizes: [{ size: '', stock: '' }],
  images: [],
}

function AdminProductForm({ initialData, onSuccess, onCancel }) {
  const isEditing = !!initialData
  const [form, setForm] = useState(
    initialData
      ? {
          ...initialData,
          price: initialData.price.toString(),
          sizes: initialData.sizes?.length > 0
            ? initialData.sizes.map((s) => ({ size: s.size.toString(), stock: s.stock.toString() }))
            : [{ size: '', stock: '' }],
          images: initialData.images || [],
        }
      : EMPTY_PRODUCT
  )
  const [errors, setErrors] = useState({})
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  // ── Champs texte ─────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  // ── Gestion des tailles ───────────────────────────────────────────────────
  const addSize = () =>
    setForm((p) => ({ ...p, sizes: [...p.sizes, { size: '', stock: '' }] }))

  const removeSize = (i) =>
    setForm((p) => ({ ...p, sizes: p.sizes.filter((_, idx) => idx !== i) }))

  const updateSize = (i, field, value) =>
    setForm((p) => ({
      ...p,
      sizes: p.sizes.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    }))

  // ── Upload d'images ───────────────────────────────────────────────────────
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((f) => formData.append('images', f))
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const urls = res.data.urls || res.data
      setForm((p) => ({ ...p, images: [...p.images, ...(Array.isArray(urls) ? urls : [urls])] }))
      toast.success(`${Array.isArray(urls) ? urls.length : 1} image(s) uploadée(s)`)
    } catch {
      toast.error("Erreur lors de l'upload des images")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (url) =>
    setForm((p) => ({ ...p, images: p.images.filter((i) => i !== url) }))

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nom requis'
    if (!form.brand.trim()) e.brand = 'Marque requise'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = 'Prix invalide'
    if (form.images.length === 0 && !isEditing) e.images = 'Au moins une image requise'
    const sizesValid = form.sizes.every(
      (s) => s.size.toString().trim() !== '' && !isNaN(Number(s.stock)) && Number(s.stock) >= 0
    )
    if (!sizesValid) e.sizes = 'Toutes les pointures doivent avoir un stock valide'
    return e
  }

  // ── Soumission ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        sizes: form.sizes
          .filter((s) => s.size.toString().trim() !== '')
          .map((s) => ({ size: s.size, stock: Number(s.stock) })),
      }
      if (isEditing) {
        await api.put(`/products/${initialData._id}`, payload)
        toast.success('Produit mis à jour')
      } else {
        await api.post('/products', payload)
        toast.success('Produit créé')
      }
      onSuccess?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>

      {/* Infos de base */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-brand-gray-400 text-xs font-heading font-semibold
                             tracking-widest uppercase mb-2">Nom du produit *</label>
          <input
            name="name" value={form.name} onChange={handleChange}
            placeholder="Air Max 90..."
            className={`input-field ${errors.name ? 'border-brand-red' : ''}`}
          />
          {errors.name && <p className="text-brand-red text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-brand-gray-400 text-xs font-heading font-semibold
                             tracking-widest uppercase mb-2">Marque *</label>
          <input
            name="brand" value={form.brand} onChange={handleChange}
            placeholder="Nike, Adidas..."
            className={`input-field ${errors.brand ? 'border-brand-red' : ''}`}
          />
          {errors.brand && <p className="text-brand-red text-xs mt-1">{errors.brand}</p>}
        </div>
        <div>
          <label className="block text-brand-gray-400 text-xs font-heading font-semibold
                             tracking-widest uppercase mb-2">Catégorie *</label>
          <div className="relative">
            <select
              name="category" value={form.category} onChange={handleChange}
              className="select-field"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-brand-gray-400 text-xs font-heading font-semibold
                             tracking-widest uppercase mb-2">Prix (DA) *</label>
          <input
            name="price" value={form.price} onChange={handleChange}
            type="number" min="0" placeholder="8500"
            className={`input-field ${errors.price ? 'border-brand-red' : ''}`}
          />
          {errors.price && <p className="text-brand-red text-xs mt-1">{errors.price}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-brand-gray-400 text-xs font-heading font-semibold
                           tracking-widest uppercase mb-2">Description</label>
        <textarea
          name="description" value={form.description} onChange={handleChange}
          rows={3} placeholder="Description du produit..."
          className="input-field resize-none"
        />
      </div>

      {/* Tailles & stocks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-brand-gray-400 text-xs font-heading font-semibold
                            tracking-widest uppercase">
            Pointures & Stocks *
          </label>
          <button type="button" onClick={addSize}
            className="flex items-center gap-1 text-xs font-heading font-semibold
                       tracking-wider uppercase text-brand-red hover:text-white transition-colors">
            <Plus size={12} /> Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {form.sizes.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={s.size} onChange={(e) => updateSize(i, 'size', e.target.value)}
                placeholder="Pointure (ex: 42)"
                className="input-field w-40 text-sm"
              />
              <input
                type="number" min="0" value={s.stock}
                onChange={(e) => updateSize(i, 'stock', e.target.value)}
                placeholder="Stock"
                className="input-field w-28 text-sm"
              />
              <button
                type="button" onClick={() => removeSize(i)}
                className="p-2 text-brand-gray-600 hover:text-brand-red transition-colors"
                aria-label="Supprimer cette taille"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        {errors.sizes && <p className="text-brand-red text-xs mt-1">{errors.sizes}</p>}
      </div>

      {/* Upload images */}
      <div>
        <label className="block text-brand-gray-400 text-xs font-heading font-semibold
                           tracking-widest uppercase mb-3">
          Images {!isEditing && '*'}
        </label>

        {/* Zone de drop */}
        <label
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed
                       p-8 cursor-pointer transition-all duration-200
                       ${dragOver
                         ? 'border-brand-red bg-brand-red/5'
                         : 'border-brand-gray-600 hover:border-brand-gray-400 bg-brand-gray-900'
                       }
                       ${errors.images ? 'border-brand-red' : ''}
                       ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            uploadFiles(e.dataTransfer.files)
          }}
        >
          <input
            type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => uploadFiles(e.target.files)}
          />
          {uploading ? (
            <Loader2 size={24} className="text-brand-red animate-spin" />
          ) : (
            <Upload size={24} className="text-brand-gray-500" />
          )}
          <div className="text-center">
            <p className="text-brand-gray-300 text-sm font-body">
              {uploading ? 'Upload en cours...' : 'Glisser-déposer ou cliquer pour sélectionner'}
            </p>
            <p className="text-brand-gray-600 text-xs mt-1">JPG, PNG, WebP</p>
          </div>
        </label>
        {errors.images && <p className="text-brand-red text-xs mt-1">{errors.images}</p>}

        {/* Aperçu des images */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
            {form.images.map((url, i) => (
              <div key={i} className="relative aspect-square bg-brand-gray-900 group">
                <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button" onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 w-5 h-5 bg-brand-red flex items-center
                             justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Supprimer l'image"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving || uploading} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 size={14} className="animate-spin" /> : null}
          {isEditing ? 'METTRE À JOUR' : 'CRÉER LE PRODUIT'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}

export default AdminProductForm