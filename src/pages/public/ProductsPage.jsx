// src/pages/public/ProductsPage.jsx
// Liste de tous les produits avec filtres par catégorie et recherche

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import api from '../../utils/api'
import ProductGrid from '../../Components/public/ProductGrid'

const CATEGORIES = ['Tous', 'Homme', 'Femme', 'Sport']

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Catégorie depuis l'URL ou 'Tous' par défaut
  const activeCategory = searchParams.get('category') || 'Tous'

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  // Filtrage côté client
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === 'Tous' || p.category === activeCategory
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [products, activeCategory, search])

  const setCategory = (cat) => {
    if (cat === 'Tous') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', cat)
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="min-h-screen bg-brand-black">

      {/* ── En-tête page ────────────────────────────────────────────────── */}
      <div className="bg-brand-gray-900 border-b border-brand-gray-800 pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="section-label">Catalogue</p>
          <h1 className="section-title mb-2">TOUS LES PRODUITS</h1>
          <p className="text-brand-gray-500 font-body">
            {loading ? '...' : `${filtered.length} produit${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* ── Filtres & recherche ──────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-brand-black/95 backdrop-blur-sm border-b border-brand-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-4">

          {/* Filtres catégories */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal size={14} className="text-brand-gray-500" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 text-xs font-heading font-bold tracking-widest uppercase
                             transition-all duration-200 border
                             ${activeCategory === cat
                               ? 'bg-brand-red border-brand-red text-white'
                               : 'bg-transparent border-brand-gray-700 text-brand-gray-400 hover:border-brand-gray-400 hover:text-brand-white'
                             }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="flex-1 max-w-xs relative ml-auto">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-brand-gray-900 border border-brand-gray-700 text-brand-white
                         text-sm font-body pl-9 pr-9 py-2 outline-none
                         focus:border-brand-red placeholder:text-brand-gray-600 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-500
                           hover:text-brand-white transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Grille produits ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <ProductGrid
          products={filtered}
          loading={loading}
          emptyMessage="Aucun produit ne correspond à votre recherche."
        />
      </div>
    </div>
  )
}

export default ProductsPage