import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div style={{
      display: 'flex', gap: 14, padding: '14px 16px',
      background: 'white', borderRadius: 16,
      border: '1px solid #F0EDF5',
      boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
    }}>
      {/* Image */}
      <div style={{ width: 76, height: 90, borderRadius: 12, overflow: 'hidden', background: '#FAFAFA', flexShrink: 0 }}>
        {item.image
          ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> loading="lazy"
          : <div style={{ width: '100%', height: '100%' }} />}
      </div>

      {/* Infos */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '10px', color: '#AAA', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>
            {item.brand}
          </p>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A2E', lineHeight: 1.3, marginBottom: 5 }}>
            {item.name}
          </p>
          {item.size && (
            <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, color: '#6A5A8C', background: '#F5F0FF', padding: '2px 10px', borderRadius: 50, marginBottom: 4 }}>
              Taille : {item.size}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          {/* Quantité */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#F5F5F5', borderRadius: 50, padding: '2px' }}>
            <button
              onClick={() => updateQuantity(item.key, item.quantity - 1)}
              disabled={item.quantity <= 1}
              style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: item.quantity <= 1 ? 'transparent' : 'white', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: item.quantity <= 1 ? 'none' : '0 1px 4px rgba(0,0,0,0.10)', transition: 'all 0.15s' }}
            >
              <Minus size={11} color={item.quantity <= 1 ? '#CCC' : '#1A1A2E'} />
            </button>
            <span style={{ minWidth: 28, textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#1A1A2E' }}>
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.key, item.quantity + 1)}
              disabled={item.quantity >= item.maxStock}
              style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: item.quantity >= item.maxStock ? 'transparent' : 'white', cursor: item.quantity >= item.maxStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: item.quantity >= item.maxStock ? 'none' : '0 1px 4px rgba(0,0,0,0.10)', transition: 'all 0.15s' }}
            >
              <Plus size={11} color={item.quantity >= item.maxStock ? '#CCC' : '#1A1A2E'} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#1A1A2E' }}>
              {(item.price * item.quantity).toLocaleString('fr-DZ')} DA
            </span>
            <button
              onClick={() => removeFromCart(item.key)}
              style={{ padding: 6, border: 'none', background: '#FFF0F0', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FFE0E0'}
              onMouseLeave={e => e.currentTarget.style.background = '#FFF0F0'}
            >
              <Trash2 size={13} color="#CC5555" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem