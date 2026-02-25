import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, AlertTriangle, Loader2, Search, Download } from 'lucide-react'
import api from '../../utils/api'
import AdminProductForm from '../../Components/admin/AdminProductForm'
import toast from 'react-hot-toast'

function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try { const res = await api.get('/products'); setProducts(res.data || []) }
    catch { toast.error('Erreur chargement produits') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await api.delete(`/products/${id}`)
      toast.success('Produit supprimé')
      setProducts(p => p.filter(x => x._id !== id))
      setSelected(s => { const ns = new Set(s); ns.delete(id); return ns })
    } catch { toast.error('Erreur suppression') }
    finally { setDeletingId(null); setDeleteConfirm(null) }
  }

  const handleBulkDelete = async () => {
    setBulkDeleting(true)
    try {
      await Promise.all([...selected].map(id => api.delete(`/products/${id}`)))
      setProducts(p => p.filter(x => !selected.has(x._id)))
      toast.success(`${selected.size} produit(s) supprimé(s)`)
      setSelected(new Set())
    } catch { toast.error('Erreur suppression') }
    finally { setBulkDeleting(false); setBulkDeleteConfirm(false) }
  }

  const handleFormSuccess = () => { setShowForm(false); setEditingProduct(null); fetchProducts() }
  const openCreate = () => { setEditingProduct(null); setShowForm(true) }
  const openEdit = (p) => { setEditingProduct(p); setShowForm(true) }

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase())
  )

  // Sélection
  const allIds = filtered.map(p => p._id)
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id))
  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(allIds))
  }
  const toggleOne = (id) => {
    const s = new Set(selected)
    if (s.has(id)) s.delete(id)
    else s.add(id)
    setSelected(s)
  }

  // Télécharger sélection CSV
  const downloadSelected = () => {
    const rows = products.filter(p => selected.has(p._id))
    if (!rows.length) return
    const headers = ['Nom', 'Marque', 'Catégorie', 'Prix (DA)', 'Stock', 'Achats']
    const lines = rows.map(p => {
      const stock = p.sizes?.length > 0
        ? p.sizes.reduce((s, x) => s + x.stock, 0)
        : (p.stock ?? 0)
      return [p.name, p.brand, p.category, p.price, stock, p.purchaseCount ?? 0]
    })
    const csv = [headers, ...lines].map(row => row.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `produits_${new Date().toISOString().slice(0,10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9B5FC0', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Catalogue</p>
          <h1 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.2rem', fontWeight: 700, color: '#2D2340' }}>Produits 🛍️</h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {selected.size > 0 && (
            <>
              <button onClick={downloadSelected}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold"
                style={{ background: 'rgba(123,200,160,0.15)', color: '#3A8A60', border: '1.5px solid rgba(123,200,160,0.4)' }}>
                <Download size={13} /> Télécharger ({selected.size})
              </button>
              <button onClick={() => setBulkDeleteConfirm(true)}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold"
                style={{ background: 'rgba(232,160,160,0.15)', color: '#C44A4A', border: '1.5px solid rgba(232,160,160,0.4)' }}>
                <Trash2 size={13} /> Supprimer ({selected.size})
              </button>
            </>
          )}
          <button onClick={openCreate}
            className="flex items-center gap-2 rounded-full px-5 py-3 text-white text-sm font-body font-bold"
            style={{ background: '#9B5FC0', boxShadow: '0 4px 16px rgba(155,95,192,0.3)' }}>
            <Plus size={15} /> Ajouter un produit
          </button>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#C4B0D8' }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(249,200,212,0.4)', color: '#2D2340', fontFamily: 'Nunito, sans-serif' }} />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#C4B0D8' }}>
            <X size={13} />
          </button>
        )}
      </div>

      {/* Sélectionner tout */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={allSelected} onChange={toggleAll}
            style={{ accentColor: '#9B5FC0', width: 15, height: 15, cursor: 'pointer' }} />
          <span style={{ fontSize: '12px', color: '#8B7A9B' }}>
            {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'} ({filtered.length})
          </span>
        </div>
      )}

      {/* Grid produits */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="rounded-3xl h-64 animate-pulse" style={{ background: 'rgba(255,255,255,0.7)' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl py-16 text-center"
          style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(249,200,212,0.3)' }}>
          <p style={{ fontSize: '3rem', marginBottom: 8 }}>🌸</p>
          <p style={{ color: '#B8A8C8', fontSize: '14px' }}>Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const totalStock = product.sizes?.length > 0
              ? product.sizes.reduce((s, x) => s + x.stock, 0)
              : (product.stock ?? 0)
            const isSelected = selected.has(product._id)

            return (
              <div key={product._id} className="rounded-3xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: isSelected ? '2px solid #9B5FC0' : '1.5px solid rgba(249,200,212,0.3)',
                  boxShadow: isSelected ? '0 0 0 3px rgba(155,95,192,0.15)' : '0 2px 16px rgba(155,95,192,0.07)',
                  transition: 'all 0.2s',
                }}>
                {/* Image */}
                <div className="overflow-hidden relative" style={{ height: 150, background: '#F8F3FC' }}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name}
                      className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🌸</div>
                  )}
                  {/* Checkbox en haut à gauche */}
                  <div className="absolute top-2 left-2" onClick={() => toggleOne(product._id)}>
                    <input type="checkbox" checked={isSelected} onChange={() => {}}
                      style={{ accentColor: '#9B5FC0', width: 16, height: 16, cursor: 'pointer' }} />
                  </div>
                  {/* Badge trending */}
                  {(product.purchaseCount ?? 0) >= 5 && (
                    <div className="absolute top-2 right-2">
                      <span style={{ fontSize: '9px', fontWeight: 700, background: '#FFF0E8', color: '#C46020', padding: '2px 8px', borderRadius: 50 }}>🔥 {product.purchaseCount}</span>
                    </div>
                  )}
                </div>
                {/* Infos */}
                <div className="p-4">
                  <p style={{ fontSize: '10px', color: '#C4B0D8', marginBottom: 2 }}>{product.brand}</p>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#2D2340', marginBottom: 6 }} className="line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#2D2340' }}>
                      {(product.price ?? 0).toLocaleString('fr-DZ')} DA
                    </span>
                    <span style={{ fontSize: '11px', color: totalStock === 0 ? '#E8A0A0' : totalStock <= 5 ? '#F4C94A' : '#B8A8C8' }}>
                      {totalStock === 0 ? 'Épuisé' : `${totalStock} en stock`}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-body font-bold transition-all"
                      style={{ background: 'rgba(155,95,192,0.1)', color: '#9B5FC0', border: '1.5px solid rgba(155,95,192,0.2)' }}>
                      <Edit2 size={11} /> Modifier
                    </button>
                    <button onClick={() => setDeleteConfirm(product)}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                      style={{ background: 'rgba(232,160,160,0.15)', color: '#E8A0A0', border: '1.5px solid rgba(232,160,160,0.2)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center p-4 pt-8">
            <div className="absolute inset-0" style={{ background: 'rgba(45,35,64,0.4)', backdropFilter: 'blur(8px)' }}
              onClick={() => { setShowForm(false); setEditingProduct(null) }} />
            <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden animate-fade-up"
              style={{ background: 'white', boxShadow: '0 20px 60px rgba(155,95,192,0.2)' }}>
              <div className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid rgba(249,200,212,0.3)' }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#2D2340' }}>
                  {editingProduct ? '✏️ Modifier le produit' : '✨ Nouveau produit'}
                </p>
                <button onClick={() => { setShowForm(false); setEditingProduct(null) }}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(249,200,212,0.3)', color: '#B8A8C8' }}>
                  <X size={15} />
                </button>
              </div>
              <div className="p-6">
                <AdminProductForm initialData={editingProduct} onSuccess={handleFormSuccess}
                  onCancel={() => { setShowForm(false); setEditingProduct(null) }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression individuelle */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(45,35,64,0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-3xl p-6 w-full max-w-sm animate-fade-up"
            style={{ background: 'white', boxShadow: '0 20px 60px rgba(155,95,192,0.2)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(232,160,160,0.2)' }}>
                <AlertTriangle size={18} style={{ color: '#E8A0A0' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#2D2340' }}>Supprimer ?</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#7B6B8A', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: '#2D2340' }}>{deleteConfirm.name}</span>
            </p>
            <p style={{ fontSize: '12px', color: '#C4B0D8', marginBottom: 20 }}>Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm._id)} disabled={deletingId === deleteConfirm._id}
                className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 text-white text-sm font-body font-bold"
                style={{ background: '#E8A0A0', opacity: deletingId === deleteConfirm._id ? 0.7 : 1 }}>
                {deletingId === deleteConfirm._id && <Loader2 size={13} className="animate-spin" />} Supprimer
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-full py-3 text-sm font-body font-bold"
                style={{ background: 'rgba(249,200,212,0.3)', color: '#7B6B8A' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression bulk */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(45,35,64,0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-3xl p-6 w-full max-w-sm"
            style={{ background: 'white', boxShadow: '0 20px 60px rgba(155,95,192,0.2)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#2D2340', marginBottom: 8 }}>
              Supprimer {selected.size} produit(s) ?
            </h3>
            <p style={{ fontSize: '13px', color: '#7B6B8A', marginBottom: 20 }}>Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={handleBulkDelete} disabled={bulkDeleting}
                className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 text-white text-sm font-bold"
                style={{ background: '#E8A0A0', opacity: bulkDeleting ? 0.7 : 1, fontFamily: 'Nunito, sans-serif' }}>
                {bulkDeleting && <Loader2 size={13} className="animate-spin" />} Supprimer
              </button>
              <button onClick={() => setBulkDeleteConfirm(false)}
                className="flex-1 rounded-full py-3 text-sm font-bold"
                style={{ background: 'rgba(249,200,212,0.3)', color: '#7B6B8A', fontFamily: 'Nunito, sans-serif' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProductsPage