import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight, Heart, Minus, Plus } from 'lucide-react'
import api from '../../utils/api'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import toast from 'react-hot-toast'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, cartItems } = useCart()
  const { toggle, isWished } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FEF0F8' }}>
      <div className="w-10 h-10 rounded-full animate-spin"
        style={{ border: '3px solid rgba(249,200,212,0.3)', borderTopColor: '#9B5FC0' }} />
    </div>
  )

  if (!product) return null

  const liked = isWished(product._id)
  const images = product.images?.length > 0 ? product.images : ['/placeholder.jpg']

  // Compteur panier
  const cartQty = cartItems?.reduce((acc, item) => {
    return item._id === product._id || item.product?._id === product._id
      ? acc + (item.quantity || 1) : acc
  }, 0) || 0

  const handleAddToCart = () => {
    addToCart(product, null, quantity)
    toast.success(`🛍️ ${product.name} ajouté au panier !`)
  }

  const handleWishlist = () => {
    const wasLiked = isWished(product._id)
    toggle(product)
    if (!wasLiked) toast.success('💜 Ajouté à ta wishlist !', { duration: 2000 })
    else toast('🤍 Retiré de ta wishlist', { duration: 1500 })
  }

  const CAT_COLORS = {
    'Skincare':  { bg: '#FFE8EF', color: '#C4607A' },
    'Makeup':    { bg: '#FFF0E8', color: '#C46020' },
    'Body Care': { bg: '#EBE0FF', color: '#7B3FA0' },
    'Hair Care': { bg: '#D6FFEE', color: '#2A8A60' },
  }
  const catStyle = CAT_COLORS[product.category] || { bg: '#EBE0FF', color: '#7B3FA0' }

  return (
    <div className="min-h-screen pb-12" style={{ background: '#FEF0F8' }}>

      {/* Back */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 16px 0' }}>
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 transition-colors"
          style={{ fontSize: 13, fontWeight: 700, color: '#8B7A9B', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
          <ArrowLeft size={15} /> Retour
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Galerie ── */}
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden group" style={{ aspectRatio: '1/1', background: '#F8F3FC', borderRadius: 24 }}>
              <img src={images[currentImage]} alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

              {images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage(i => i === 0 ? images.length - 1 : i - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(255,255,255,0.90)', boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}>
                    <ChevronLeft size={16} style={{ color: '#5A4A6A' }} />
                  </button>
                  <button onClick={() => setCurrentImage(i => i === images.length - 1 ? 0 : i + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(255,255,255,0.90)', boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}>
                    <ChevronRight size={16} style={{ color: '#5A4A6A' }} />
                  </button>
                </>
              )}

              {/* Badge catégorie */}
              <div className="absolute top-3 left-3">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{ background: catStyle.bg, color: catStyle.color }}>
                  {product.category}
                </span>
              </div>

              {/* Wishlist */}
              <button onClick={handleWishlist}
                className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ background: liked ? 'rgba(232,160,180,0.95)' : 'rgba(255,255,255,0.90)', boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}>
                <Heart size={17} style={{ fill: liked ? 'white' : 'none', color: liked ? 'white' : '#C4B0D8', strokeWidth: 2 }} />
              </button>

              {/* Compteur panier badge */}
              {cartQty > 0 && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ background: '#9B5FC0', boxShadow: '0 2px 10px rgba(155,95,192,0.35)' }}>
                  <ShoppingBag size={11} color="white" />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'white' }}>
                    {cartQty} dans le panier
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)}
                    style={{ aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', border: `2px solid ${i === currentImage ? '#9B5FC0' : 'transparent'}`, transition: 'border 0.2s', padding: 0, background: 'none', cursor: 'pointer' }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Infos produit ── */}
          <div className="flex flex-col gap-5 animate-fade-up">

            {/* Titre + Prix */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9B5FC0', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                {product.brand}
              </p>
              <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#2D2340', lineHeight: 1.25, marginBottom: 12 }}>
                {product.name}
              </h1>
              <div className="flex items-baseline gap-2">
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#2D2340' }}>
                  {(product.price ?? 0).toFixed(0)}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#8B7A9B' }}>DA</span>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(249,200,212,0.4)' }} />

            {/* Quantité */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
                Quantité
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center" style={{ background: 'white', borderRadius: 50, border: '1.5px solid rgba(249,200,212,0.5)', boxShadow: '0 2px 10px rgba(155,95,192,0.07)' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:opacity-70"
                    style={{ color: '#9B5FC0', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ width: 36, textAlign: 'center', fontSize: 16, fontWeight: 800, color: '#2D2340' }}>
                    {quantity}
                  </span>
                  <button onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:opacity-70"
                    style={{ color: '#9B5FC0', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Plus size={14} />
                  </button>
                </div>

                {/* Total ligne */}
                <div style={{ background: 'rgba(155,95,192,0.08)', borderRadius: 12, padding: '8px 14px' }}>
                  <p style={{ fontSize: 10, color: '#9B5FC0', fontWeight: 700 }}>Total</p>
                  <p style={{ fontSize: 15, fontWeight: 900, color: '#2D2340' }}>
                    {((product.price ?? 0) * quantity).toFixed(0)} DA
                  </p>
                </div>
              </div>

              {/* Info panier actuel */}
              {cartQty > 0 && (
                <p style={{ fontSize: 12, color: '#9B5FC0', fontWeight: 600, marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ShoppingBag size={12} /> {cartQty} déjà dans ton panier
                </p>
              )}
            </div>

            {/* Bouton ajouter */}
            <button onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-body font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #9B5FC0, #B896D4)', boxShadow: '0 4px 20px rgba(155,95,192,0.35)', fontSize: 15, fontFamily: 'Nunito, sans-serif', border: 'none', cursor: 'pointer' }}>
              <ShoppingBag size={18} />
              Ajouter au panier — {((product.price ?? 0) * quantity).toFixed(0)} DA
            </button>

            {/* Description */}
            {product.description && (
              <>
                <div style={{ height: 1, background: 'rgba(249,200,212,0.4)' }} />
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#8B7A9B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                    Description
                  </p>
                  <p style={{ fontSize: 13, color: '#7B6B8A', lineHeight: 1.75 }}>
                    {product.description}
                  </p>
                </div>
              </>
            )}

            {/* Livraison */}
            <div className="flex items-start gap-3 rounded-2xl p-4"
              style={{ background: 'rgba(155,95,192,0.07)', border: '1px solid rgba(155,95,192,0.12)' }}>
              <span style={{ fontSize: 22 }}>🚚</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#2D2340', marginBottom: 2 }}>
                  Livraison dans toute l'Algérie 🇩🇿
                </p>
                <p style={{ fontSize: 12, color: '#8B7A9B' }}>
                  Paiement à la livraison · 2 à 5 jours ouvrables
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage