// src/Components/public/SizeSelector.jsx
function SizeSelector({ sizes = [], selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(({ size, stock }) => {
        const isSelected = selected === size
        const outOfStock = stock === 0

        return (
          <button
            key={size}
            onClick={() => !outOfStock && onChange(size)}
            disabled={outOfStock}
            className={`
              relative min-w-[52px] h-12 px-3 font-heading font-bold text-sm
              transition-all duration-200 border-2 uppercase tracking-wider
              ${isSelected
                ? 'bg-brand-red border-brand-red text-white shadow-brutal-red'
                : outOfStock
                  ? 'bg-transparent border-brand-gray-700 text-brand-gray-600 cursor-not-allowed line-through'
                  : 'bg-transparent border-brand-gray-600 text-brand-gray-300 hover:border-brand-white hover:text-brand-white'
              }
            `}
          >
            {size}
            {!outOfStock && stock <= 3 && !isSelected && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default SizeSelector