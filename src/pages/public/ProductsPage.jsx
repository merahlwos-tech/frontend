import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import api from '../../utils/api'
import ProductGrid from '../../Components/public/ProductGrid'

const CATEGORIES = ['Tous', 'Bébé', 'Enfants', 'Femme', 'Homme', 'Lingerie', 'Accessoires']

const CAT_EMOJIS = {
  'Tous': '🛍️', 'Bébé': '👶', 'Enfants': '🧒',
  'Femme': '👗', 'Homme': '👔', 'Lingerie': '🌸', 'Accessoires': '👜'
}

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const activeCategory = searchParams.get('category') || 'Tous'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => products.filter((p) => {
    const matchCat = activeCategory === 'Tous' || p.category === activeCategory
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  }), [products, activeCategory, search])

  const setCategory = (cat) => {
    if (cat === 'Tous') searchParams.delete('category')
    else searchParams.set('category', cat)
    setSearchParams(searchParams)
  }

  return (
    <div className="min-h-screen bg-sf-cream">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-sf-rose-soft to-sf-sage-soft pt-28 pb-12
                      border-b border-sf-beige-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <p className="sf-label mb-3">Boutique</p>
          <h1 className="font-display text-sf-text text-5xl mb-2">
            {activeCategory === 'Tous' ? 'Tous les articles' : `${CAT_EMOJIS[activeCategory]} ${activeCategory}`}
          </h1>
          <p className="font-body text-sf-text-soft text-sm">
            {loading ? '...' : `${filtered.length} article${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-sf-beige shadow-soft">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-3
                        flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs
                             font-body font-600 transition-all duration-200
                             ${activeCategory === cat
                               ? 'bg-sf-rose text-sf-text shadow-rose'
                               : 'bg-sf-beige text-sf-text-soft hover:bg-sf-rose-soft hover:text-sf-text'
                             }`}>
                <span>{CAT_EMOJIS[cat]}</span> {cat}
              </button>
            ))}
          </div>

          <div className="relative flex-shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sf-text-light" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="bg-sf-beige border border-sf-beige-dark rounded-full text-sf-text
                         font-body text-xs pl-8 pr-8 py-2 outline-none focus:border-sf-rose
                         placeholder:text-sf-text-light w-44 transition-all" />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sf-text-light
                           hover:text-sf-text">
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grille */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
        <ProductGrid products={filtered} loading={loading}
          emptyMessage="Aucun article dans cette catégorie." />
      </div>
    </div>
  )
}

export default ProductsPage