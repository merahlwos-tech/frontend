import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

const CAT_COLORS = {
  'Skincare':  { bg: '#F0F7EE', color: '#4A8C6A' },
  'Makeup':    { bg: '#FFF3F0', color: '#B05A40' },
  'Body Care': { bg: '#F0EEF7', color: '#5A4A8C' },
  'Hair Care': { bg: '#EEF5F7', color: '#3A7A8C' },
}

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const imageUrl = product.images?.[0] || '/placeholder.jpg'
  const catStyle = CAT_COLORS[product.category] || { bg: '#F0EEF7', color: '#5A4A8C' }
  const hasSizes = product.sizes?.length > 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (hasSizes) {
      // Redirige vers la page produit pour choisir la taille
      navigate(`/products/${product._id}`)
      return
    }
    const stock = product.stock ?? 0
    if (stock === 0) {
      toast.error('Produit épuisé')
      return
    }
    addToCart(product, null, 1)
    toast.success('Ajouté au panier ✓', { duration: 1500 })
  }

  const stockVal = product.sizes?.length > 0
    ? product.sizes.reduce((s, x) => s + x.stock, 0)
    : (product.stock ?? 0)
  const isOutOfStock = stockVal === 0

  return (
    <Link to={`/products/${product._id}`} className="block group" style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #F0EDF5',
        transition: 'all 0.25s ease',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)' }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', background: '#FAFAFA' }}>
          <img src={imageUrl} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
            loading="lazy" />

          {/* Badge catégorie */}
          <div className="absolute top-2 left-2">
            <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: 50, background: catStyle.bg, color: catStyle.color, letterSpacing: '0.04em' }}>
              {product.category}
            </span>
          </div>

          {/* Badge épuisé */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.7)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#999', background: 'white', padding: '4px 12px', borderRadius: 50, border: '1px solid #eee' }}>
                Épuisé
              </span>
            </div>
          )}

          {/* Badge trending */}
          {(product.purchaseCount ?? 0) >= 5 && (
            <div className="absolute top-2 right-2">
              <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 8px', borderRadius: 50, background: '#FFF0E8', color: '#C46020' }}>
                🔥 Trending
              </span>
            </div>
          )}
        </div>

        {/* Infos */}
        <div style={{ padding: '10px 12px 12px' }}>
          <p style={{ fontSize: '10px', color: '#AAA', marginBottom: 2, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {product.brand}
          </p>
          <h3 className="line-clamp-2"
            style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A2E', lineHeight: 1.4, marginBottom: 8, minHeight: 32 }}>
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#1A1A2E' }}>
              {(product.price ?? 0).toLocaleString('fr-DZ')} DA
            </span>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                width: 30, height: 30, borderRadius: '50%',
                background: isOutOfStock ? '#EEE' : '#1A1A2E',
                border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isOutOfStock) e.currentTarget.style.background = '#3A3A5E' }}
              onMouseLeave={e => { if (!isOutOfStock) e.currentTarget.style.background = '#1A1A2E' }}
            >
              <ShoppingBag size={13} color={isOutOfStock ? '#BBB' : 'white'} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard