// src/Components/public/ProductGrid.jsx
import ProductCard from './ProductCard.jsx'

function ProductGrid({ products, loading, emptyMessage = 'Aucun produit trouvé.' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-brand-gray-800 border border-brand-gray-700 overflow-hidden">
            <div className="aspect-square bg-brand-gray-700 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-brand-gray-700 animate-pulse w-1/3" />
              <div className="h-4 bg-brand-gray-700 animate-pulse w-3/4" />
              <div className="h-5 bg-brand-gray-700 animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="font-display text-8xl text-brand-gray-800 leading-none mb-4">
          VIDE
        </div>
        <p className="text-brand-gray-400 font-body">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, i) => (
        <div
          key={product._id}
          className="animate-slide-up"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductGrid