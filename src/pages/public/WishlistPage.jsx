import { Link } from 'react-router-dom'
import { Heart, Trash2, ShoppingBag, ArrowLeft, Star } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import toast from 'react-hot-toast'

function WishlistPage() {
  const { wishlist, remove } = useWishlist()

  const handleRemove = (product) => {
    remove(product._id)
    toast(`🤍 "${product.name}" retiré`, { duration: 1800 })
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: '#FEF0F8' }}>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #FFD6E8 0%, #E8D6FF 40%, #D6E8FF 75%, #D6FFE8 100%)',
        padding: '28px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <span style={{ position: 'absolute', top: 16, right: 24, fontSize: 18, opacity: 0.4 }}>✦</span>
        <span style={{ position: 'absolute', bottom: 14, left: 32, fontSize: 11, opacity: 0.35, color: '#9B5FC0' }}>✦</span>

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link to="/products"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#8B7A9B', textDecoration: 'none', marginBottom: 12 }}>
            <ArrowLeft size={14} /> Retour aux produits
          </Link>
          <div className="flex items-center gap-3">
            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
              <Heart size={22} style={{ color: '#E8A0B4', fill: '#E8A0B4' }} />
            </div>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9B5FC0', fontWeight: 700 }}>Mes favoris</p>
              <h1 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2rem', fontWeight: 700, color: '#2D2340', lineHeight: 1.1 }}>
                Ma Wishlist
              </h1>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#8B7A9B', marginTop: 6 }}>
            {wishlist.length} produit{wishlist.length !== 1 ? 's' : ''} sauvegardé{wishlist.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* CONTENU */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div style={{ width: 90, height: 90, background: 'rgba(232,160,180,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Heart size={36} style={{ color: '#E8A0B4', opacity: 0.7 }} />
            </div>
            <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.7rem', fontWeight: 700, color: '#2D2340', marginBottom: 8 }}>
              Ta wishlist est vide
            </p>
            <p style={{ fontSize: 14, color: '#8B7A9B', marginBottom: 24, lineHeight: 1.6 }}>
              Parcours notre boutique et appuie sur 💜<br />pour sauvegarder tes produits préférés.
            </p>
            <Link to="/products"
              style={{ background: '#9B5FC0', color: 'white', textDecoration: 'none', borderRadius: 50, padding: '12px 28px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(155,95,192,0.30)' }}>
              <ShoppingBag size={16} /> Explorer les produits
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {wishlist.map((product, i) => {
                const rating  = product.rating  || (4 + Math.random()).toFixed(1)
                const reviews = product.reviews || Math.floor(40 + Math.random() * 30)
                const img     = product.images?.[0] || '/placeholder.jpg'

                return (
                  <div key={product._id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(155,95,192,0.09)', position: 'relative' }}>
                      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ aspectRatio: '3/4', background: '#F8F3FC', overflow: 'hidden', position: 'relative' }}>
                          <img src={img} alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            loading="lazy" />
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-2 py-0.5"
                            style={{ background: 'rgba(255,255,255,0.88)' }}>
                            <Star size={9} style={{ fill: '#FBBF24', color: '#FBBF24' }} />
                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#2D2340' }}>{rating}</span>
                            <span style={{ fontSize: '10px', color: '#B8A8C8' }}>({reviews})</span>
                          </div>
                        </div>
                      </Link>

                      {/* Bouton suppression */}
                      <button
                        onClick={() => handleRemove(product)}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                        style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}>
                        <Trash2 size={14} style={{ color: '#E8A0B4' }} />
                      </button>

                      <div style={{ padding: '12px 14px 14px' }}>
                        <p style={{ fontSize: '11px', color: '#B8A8C8', marginBottom: 3 }}>{product.brand}</p>
                        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                          <h3 className="line-clamp-2"
                            style={{ fontSize: '13px', fontWeight: 700, color: '#2D2340', lineHeight: 1.35, marginBottom: 10, minHeight: 36 }}>
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#2D2340' }}>
                            ${(product.price ?? 0).toFixed(2)}
                          </span>
                          <Link to={`/products/${product._id}`}
                            style={{ background: '#9B5FC0', color: 'white', borderRadius: 50, padding: '6px 12px', fontSize: 11, fontWeight: 700, fontFamily: 'Nunito, sans-serif', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <ShoppingBag size={11} /> Voir
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 text-center">
              <Link to="/products"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(155,95,192,0.10)', color: '#9B5FC0', textDecoration: 'none', borderRadius: 50, padding: '11px 24px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13, border: '1.5px solid rgba(155,95,192,0.20)' }}>
                <ArrowLeft size={14} /> Continuer mes achats
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WishlistPage