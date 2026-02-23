import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, AlertTriangle, Loader2, Search } from 'lucide-react'
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
    } catch { toast.error('Erreur suppression') }
    finally { setDeletingId(null); setDeleteConfirm(null) }
  }

  const handleFormSuccess = () => { setShowForm(false); setEditingProduct(null); fetchProducts() }
  const openCreate = () => { setEditingProduct(null); setShowForm(true) }
  const openEdit = (p) => { setEditingProduct(p); setShowForm(true) }

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9B5FC0', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            Catalogue
          </p>
          <h1 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.2rem', fontWeight: 700, color: '#2D2340' }}>
            Produits 🛍️
          </h1>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 rounded-full px-5 py-3 text-white text-sm font-body font-bold"
          style={{ background: '#9B5FC0', boxShadow: '0 4px 16px rgba(155,95,192,0.3)' }}>
          <Plus size={15} /> Ajouter un produit
        </button>
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
            const totalStock = product.sizes?.reduce((s, x) => s + x.stock, 0) || 0
            return (
              <div key={product._id} className="rounded-3xl overflow-hidden group"
                   style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(249,200,212,0.3)', boxShadow: '0 2px 16px rgba(155,95,192,0.07)' }}>
                {/* Image */}
                <div className="overflow-hidden" style={{ height: 150, background: '#F8F3FC' }}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🌸</div>
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
                      {totalStock === 0 ? 'Épuisé' : `${totalStock} stock`}
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

      {/* Modal suppression */}
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
    </div>
  )
}

export default AdminProductsPage