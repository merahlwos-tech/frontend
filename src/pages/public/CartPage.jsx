// src/pages/public/CartPage.jsx
// Page panier — liste des articles + formulaire de commande

import { useNavigate } from 'react-router-dom'
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
    if (items.length === 0) {
      toast.error('Votre panier est vide')
      return
    }
    setSubmitting(true)
    try {
      const orderData = {
        customerInfo,
        items: items.map((item) => ({
          product: item.productId,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
      }
      await api.post('/orders', orderData)
      clearCart()
      navigate('/confirmation', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande. Réessayez.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-black pt-16 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="font-display text-[10rem] leading-none text-brand-gray-800 mb-6">
            0
          </div>
          <p className="font-heading font-bold text-xl text-brand-gray-400 mb-2">
            Votre panier est vide
          </p>
          <p className="text-brand-gray-600 font-body mb-8">
            Découvrez notre collection de sneakers
          </p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary inline-flex items-center gap-3"
          >
            <ShoppingBag size={16} />
            Explorer les produits
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black pt-16">

      {/* En-tête */}
      <div className="bg-brand-gray-900 border-b border-brand-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-brand-gray-500 hover:text-brand-white
                       transition-colors text-sm font-body mb-4 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Continuer les achats
          </button>
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label">Récapitulatif</p>
              <h1 className="section-title">MON PANIER</h1>
            </div>
            <span className="font-display text-3xl text-brand-gray-600">
              {items.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Articles ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-brand-gray-400 text-xs font-heading font-semibold
                             tracking-widest uppercase">
                {items.length} article{items.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={clearCart}
                className="flex items-center gap-1 text-brand-gray-600 hover:text-brand-red
                           transition-colors text-xs font-body"
              >
                <Trash2 size={12} />
                Vider le panier
              </button>
            </div>

            {items.map((item) => (
              <CartItem key={item.key} item={item} />
            ))}
          </div>

          {/* ── Résumé & commande ─────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">

              {/* Total */}
              <div className="bg-brand-gray-900 border border-brand-gray-700 p-6">
                <p className="text-brand-gray-400 text-xs font-heading font-semibold
                               tracking-widest uppercase mb-4">
                  Récapitulatif de commande
                </p>

                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.key} className="flex justify-between text-sm font-body">
                      <span className="text-brand-gray-400 truncate mr-2 flex-1">
                        {item.name} ×{item.quantity}
                      </span>
                      <span className="text-brand-gray-300 whitespace-nowrap">
                        {(item.price * item.quantity).toLocaleString('fr-DZ')} DA
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-brand-gray-700 mb-4" />

                <div className="flex items-baseline justify-between">
                  <span className="font-heading font-bold tracking-widest uppercase text-sm
                                   text-brand-gray-400">
                    Total
                  </span>
                  <span className="font-display text-3xl text-brand-white">
                    {total.toLocaleString('fr-DZ')}
                    <span className="text-base text-brand-gray-400 font-body ml-1">DA</span>
                  </span>
                </div>

                <p className="text-brand-gray-600 text-xs font-body mt-2 text-right">
                  Paiement à la livraison
                </p>
              </div>

              {/* Formulaire de commande */}
              <div className="bg-brand-gray-900 border border-brand-gray-700 p-6">
                <p className="text-brand-gray-400 text-xs font-heading font-semibold
                               tracking-widest uppercase mb-5">
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