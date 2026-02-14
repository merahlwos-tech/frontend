// src/components/public/QuantitySelector.jsx
// Sélecteur de quantité avec boutons +/–

import { Minus, Plus } from 'lucide-react'

function QuantitySelector({ value, min = 1, max = 99, onChange }) {
  return (
    <div className="flex items-center border border-brand-gray-600 w-fit">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center text-brand-gray-300
                   hover:text-brand-white hover:bg-brand-gray-700 transition-colors
                   disabled:opacity-30 disabled:cursor-not-allowed border-r border-brand-gray-600"
        aria-label="Diminuer la quantité"
      >
        <Minus size={14} />
      </button>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10)
          if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)))
        }}
        className="w-12 h-10 bg-transparent text-center text-brand-white font-heading
                   font-bold text-sm outline-none"
        aria-label="Quantité"
      />

      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-brand-gray-300
                   hover:text-brand-white hover:bg-brand-gray-700 transition-colors
                   disabled:opacity-30 disabled:cursor-not-allowed border-l border-brand-gray-600"
        aria-label="Augmenter la quantité"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}

export default QuantitySelector