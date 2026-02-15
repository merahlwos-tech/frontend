// src/components/public/ProductCard.jsx
// Carte produit avec design streetwear et effets de survol

import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

function ProductCard({ product }) {
  const hasStock = product.sizes?.some((s) => s.stock > 0)
  const imageUrl = product.images?.[0] || '/placeholder.jpg'

  return (
    <Link to={`/products/${product._id}`} className="card-product block group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-brand-gray-900">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500
                     group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/20
                        transition-all duration-300" />

        {/* Icône "voir" */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-brand-red flex items-center
                        justify-center opacity-0 group-hover:opacity-100 transition-all
                        duration-300 translate-x-2 group-hover:translate-x-0">
          <ArrowUpRight size={14} className="text-white" />
        </div>

        {/* Badge catégorie */}
        <div className="absolute top-3 left-3">
          <span className="tag text-[10px]">{product.category}</span>
        </div>

        {/* Badge rupture */}
        {!hasStock && (
  <Link
    to={`/products?category=${product.category}`}
    onClick={(e) => e.stopPropagation()}
    className="absolute inset-0 bg-brand-black/60 flex flex-col items-center
               justify-center gap-2 group/out"
  >
    <span className="font-heading font-bold tracking-widest uppercase text-xs
                     text-brand-gray-300 border border-brand-gray-600 px-3 py-1">
      Épuisé
    </span>
    <span className="text-brand-red text-xs font-heading font-semibold tracking-wider
                     uppercase opacity-0 group-hover/out:opacity-100 transition-opacity
                     underline">
      Voir articles similaires →
    </span>
  </Link>
)}
      </div>

      {/* Infos produit */}
      <div className="p-4 border-t border-brand-gray-700 group-hover:border-brand-red
                      transition-colors duration-300">
        <p className="text-brand-gray-400 text-xs font-heading font-semibold tracking-widest
                      uppercase mb-1">
          {product.brand}
        </p>
        <h3 className="font-heading font-bold text-brand-white text-base leading-tight mb-3
                       group-hover:text-brand-red transition-colors duration-200 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl text-brand-white tracking-wide">
            {product.price.toLocaleString('fr-DZ')}
            <span className="text-sm text-brand-gray-400 font-body ml-1">DA</span>
          </span>
          <span className="text-brand-gray-500 text-xs font-body">
            {product.sizes?.length || 0} pointures
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard