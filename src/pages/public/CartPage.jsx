import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import CartItem from '../../Components/public/CartItem'
import CheckoutForm from '../../Components/public/CheckoutForm'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { useState } from 'react'

function CartPage() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleOrder = async (customerInfo) => {
    if (items.length === 0) { toast.error('Votre panier est vide'); return }
    setSubmitting(true)
    try {
      const res = await api.post('/orders', {
        customerInfo,
        items: items.map(item => ({
          product: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
      })
      clearCart()
      const newOrderId = res.data._id || res.data.id || res.data?.order?._id
      sessionStorage.setItem('lastOrderId', newOrderId || '')
      navigate('/confirmation', { replace: true, state: { orderId: newOrderId } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center px-5"
         style={{ background: 'linear-gradient(160deg, #FFF0F6 0%, #F5EEFF 45%, #EEF9F5 100%)' }}>
      <div className="text-center">
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #F9C8D4, #E8D6FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 40 }}>
          🛒
        </div>
        <h2 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2rem', fontWeight: 700, color: '#2D2340', marginBottom: 8 }}>
          Panier vide
        </h2>
        <p style={{ fontSize: 14, color: '#8B7A9B', marginBottom: 24 }}>Découvrez notre belle sélection ✨</p>
        <Link to="/products"
          style={{ background: '#9B5FC0', color: 'white', borderRadius: 50, padding: '12px 28px', textDecoration: 'none', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(155,95,192,0.30)' }}>
          <ShoppingBag size={16} /> Découvrir la boutique
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FFF0F6 0%, #F5EEFF 60%, #EEF9F5 100%)' }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(249,200,212,0.3)', padding: '14px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <button onClick={() => navigate('/products')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#8B7A9B', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', marginBottom: 10 }}>
            <ArrowLeft size={14} /> Continuer mes achats
          </button>
          <h1 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.8rem', fontWeight: 700, color: '#2D2340' }}>
            Mon panier 🛍️
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Articles */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
              <p style={{ fontSize: 13, color: '#8B7A9B', fontWeight: 600 }}>
                {items.length} article{items.length !== 1 ? 's' : ''}
              </p>
              <button onClick={clearCart}
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#C4B0D8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}>
                <Trash2 size={12} /> Vider le panier
              </button>
            </div>
            {items.map(item => <CartItem key={item.key} item={item} />)}
          </div>

          {/* Résumé + Formulaire */}
          <div className="lg:col-span-2">
            <div style={{ position: 'sticky', top: 100 }}>

              {/* Total */}
              <div style={{ background: 'white', borderRadius: 20, padding: '20px', marginBottom: 16, boxShadow: '0 2px 16px rgba(155,95,192,0.08)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>
                  Récapitulatif
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {items.map(item => (
                    <div key={item.key} className="flex justify-between" style={{ fontSize: 13 }}>
                      <span style={{ color: '#8B7A9B', flex: 1, marginRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name} ×{item.quantity}
                      </span>
                      <span style={{ color: '#2D2340', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {(item.price * item.quantity).toLocaleString('fr-DZ')} DA
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: 'rgba(249,200,212,0.4)', marginBottom: 14 }} />
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: 13, color: '#8B7A9B', fontWeight: 600 }}>Total</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2D2340', fontFamily: 'Nunito, sans-serif' }}>
                    {total.toLocaleString('fr-DZ')} DA
                  </span>
                </div>
                <p style={{ fontSize: 11, color: '#C4B0D8', textAlign: 'right', marginTop: 4 }}>
                  Paiement à la livraison 🚚
                </p>
              </div>

              {/* Formulaire avec modale fraude intégrée */}
              <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 2px 16px rgba(155,95,192,0.08)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
                  Informations de livraison
                </p>
                <CheckoutForm onSubmit={handleOrder} loading={submitting} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage