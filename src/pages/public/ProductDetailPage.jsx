// src/pages/public/ProductDetailPage.jsx
// Page de détail produit — galerie, sélection pointure, ajout panier

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../utils/api'
import { useCart } from '../../context/CartContext'
import SizeSelector from '../../Components/public/SizeSelector'
import QuantitySelector from '../../Components/public/QuantitySelector'
import toast from 'react-hot-toast'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data)
        // Pré-sélectionner la première taille disponible
        const firstAvailable = res.data.sizes?.find((s) => s.stock > 0)
        if (firstAvailable) setSelectedSize(firstAvailable.size)
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center pt-16">
        <div className="w-12 h-12 border-2 border-brand-gray-700 border-t-brand-red rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) return null

  const maxStock = product.sizes?.find((s) => s.size === selectedSize)?.stock || 1
  const images = product.images?.length > 0 ? product.images : ['/placeholder.jpg']

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Veuillez sélectionner une pointure')
      return
    }
    addToCart(product, selectedSize, quantity)
    toast.success(`${product.name} (T${selectedSize}) ajouté au panier !`, {
      icon: '👟',
    })
  }

  const prevImage = () => setCurrentImage((i) => (i === 0 ? images.length - 1 : i - 1))
  const nextImage = () => setCurrentImage((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="min-h-screen bg-brand-black pt-16">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-gray-500 hover:text-brand-white
                     transition-colors text-sm font-body group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          Retour
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── Galerie d'images ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Image principale */}
            <div className="relative aspect-square bg-brand-gray-900 border border-brand-gray-800 overflow-hidden group">
              <img
                src={images[currentImage]}
                alt={`${product.name} — image ${currentImage + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Navigation galerie */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-black/80
                               flex items-center justify-center opacity-0 group-hover:opacity-100
                               transition-opacity hover:bg-brand-red"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-black/80
                               flex items-center justify-center opacity-0 group-hover:opacity-100
                               transition-opacity hover:bg-brand-red"
                    aria-label="Image suivante"
                  >
                    <ChevronRight size={18} />
                  </button>
                  {/* Compteur */}
                  <div className="absolute bottom-3 right-3 bg-brand-black/80 px-2 py-1 text-xs
                                  font-heading text-brand-gray-400">
                    {currentImage + 1} / {images.length}
                  </div>
                </>
              )}

              {/* Badge catégorie */}
              <div className="absolute top-4 left-4">
                <span className="tag">{product.category}</span>
              </div>
            </div>

            {/* Miniatures */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`aspect-square overflow-hidden border-2 transition-all duration-200
                                ${i === currentImage
                                  ? 'border-brand-red'
                                  : 'border-brand-gray-800 hover:border-brand-gray-600'
                                }`}
                  >
                    <img src={img} alt={`Miniature ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Informations produit ──────────────────────────────────────── */}
          <div className="flex flex-col gap-6 animate-slide-up">
            {/* En-tête */}
            <div>
              <p className="text-brand-red font-heading font-bold tracking-ultra uppercase text-xs mb-2">
                {product.brand}
              </p>
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-brand-white
                              leading-tight mb-4">
                {product.name}
              </h1>
              <div className="font-display text-4xl text-brand-white tracking-wide">
                {product.price.toLocaleString('fr-DZ')}
                <span className="text-lg text-brand-gray-400 font-body ml-2">DA</span>
              </div>
            </div>

            {/* Séparateur */}
            <div className="h-px bg-brand-gray-800" />

            {/* Sélecteur de taille */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-brand-gray-400 text-xs font-heading font-bold tracking-widest uppercase">
                  Pointure
                  {selectedSize && (
                    <span className="ml-2 text-brand-red">— {selectedSize}</span>
                  )}
                </p>
                <span className="text-brand-gray-600 text-xs font-body">
                  <span className="text-yellow-500">●</span> = stock faible
                </span>
              </div>
              <SizeSelector
                sizes={product.sizes || []}
                selected={selectedSize}
                onChange={(size) => {
                  setSelectedSize(size)
                  setQuantity(1)
                }}
              />
            </div>

            {/* Quantité */}
            <div>
              <p className="text-brand-gray-400 text-xs font-heading font-bold tracking-widest uppercase mb-3">
                Quantité
              </p>
              <QuantitySelector
                value={quantity}
                min={1}
                max={maxStock}
                onChange={setQuantity}
              />
              {selectedSize && (
                <p className="text-brand-gray-600 text-xs font-body mt-2">
                  {maxStock} en stock pour cette pointure
                </p>
              )}
            </div>

            {/* Bouton ajouter au panier */}
            <button
              onClick={handleAddToCart}
              className="btn-primary flex items-center justify-center gap-3 text-base py-4"
            >
              <ShoppingBag size={18} />
              AJOUTER AU PANIER
            </button>

            {/* Description */}
            {product.description && (
              <>
                <div className="h-px bg-brand-gray-800" />
                <div>
                  <p className="text-brand-gray-400 text-xs font-heading font-bold tracking-widest uppercase mb-3">
                    Description
                  </p>
                  <p className="text-brand-gray-300 font-body leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </>
            )}

            {/* Infos livraison */}
            <div className="bg-brand-gray-900 border border-brand-gray-800 p-4">
              <p className="text-brand-gray-300 text-sm font-body font-medium mb-1">
                🚚 Livraison dans toute l'Algérie
              </p>
              <p className="text-brand-gray-500 text-xs font-body">
                Paiement à la livraison — 2 à 5 jours ouvrables
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage