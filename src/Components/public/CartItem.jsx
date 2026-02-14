// src/components/public/CartItem.jsx
// Ligne d'article dans le panier

import { Trash2 } from 'lucide-react'
import QuantitySelector from './QuantitySelector'
import { useCart } from '../../context/CartContext'

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="flex gap-4 p-4 bg-brand-gray-800 border border-brand-gray-700
                    hover:border-brand-gray-600 transition-colors duration-200 animate-slide-in">
      {/* Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-brand-gray-900 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-brand-gray-600 text-xs font-body">Pas d'image</span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
        <div>
          <p className="text-brand-gray-400 text-xs font-heading font-semibold
                        tracking-widest uppercase mb-0.5">
            {item.brand}
          </p>
          <h4 className="font-heading font-bold text-brand-white text-sm leading-tight
                         truncate">
            {item.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="tag-outline text-[10px]">Pointure {item.size}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <QuantitySelector
            value={item.quantity}
            min={1}
            max={item.maxStock}
            onChange={(qty) => updateQuantity(item.key, qty)}
          />
          <div className="flex items-center gap-4">
            <span className="font-display text-xl text-brand-white">
              {(item.price * item.quantity).toLocaleString('fr-DZ')}
              <span className="text-xs text-brand-gray-400 font-body ml-1">DA</span>
            </span>
            <button
              onClick={() => removeFromCart(item.key)}
              className="p-2 text-brand-gray-500 hover:text-brand-red transition-colors duration-200"
              aria-label="Supprimer cet article"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem