import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import api from '../../utils/api'
import ProductGrid from '../../Components/public/ProductGrid'

const CATEGORIES = [
  { label: 'Bébé', emoji: '👶', desc: 'Douceur & confort', color: 'bg-sf-rose-soft', border: 'hover:border-sf-rose' },
  { label: 'Enfants', emoji: '🧒', desc: 'Fun & tendance', color: 'bg-sf-sage-soft', border: 'hover:border-sf-sage' },
  { label: 'Femme', emoji: '👗', desc: 'Élégance au quotidien', color: 'bg-purple-50', border: 'hover:border-purple-300' },
  { label: 'Homme', emoji: '👔', desc: 'Style & sobriété', color: 'bg-blue-50', border: 'hover:border-blue-300' },
  { label: 'Lingerie', emoji: '🌸', desc: 'Douceur & raffinement', color: 'bg-pink-50', border: 'hover:border-pink-300' },
  { label: 'Accessoires', emoji: '👜', desc: 'Complétez le look', color: 'bg-amber-50', border: 'hover:border-amber-300' },
]

const TESTIMONIALS = [
  { name: 'Sara B.', text: 'Qualité exceptionnelle pour les vêtements bébé, très doux et bien coupés. Je recommande !', stars: 5 },
  { name: 'Nadia K.', text: 'Livraison rapide, emballage soigné. Les vêtements correspondent parfaitement aux photos.', stars: 5 },
  { name: 'Meriem A.', text: 'Super boutique ! J\'ai commandé pour toute la famille, tout le monde est ravi.', stars: 5 },
]

function HomePage() {
  const [products, setProducts] = useState([])
  const [babyProducts, setBabyProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products')
      .then((res) => {
        const all = res.data || []
        setProducts(all.slice(0, 8))
        setBabyProducts(all.filter((p) => p.category === 'Bébé').slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-sf-cream">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Image background */}
        <div className="absolute inset-0">
          <img
            src="/hero-family.jpg"
            alt="Famille heureuse"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-sf-cream/95 via-sf-cream/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-sf-rose-soft/90 backdrop-blur-sm
                            border border-sf-rose/30 rounded-full px-4 py-2 mb-6 animate-fade-up">
              <span className="text-lg">✨</span>
              <span className="font-body text-sf-rose-dark text-sm font-semibold">
                Nouvelle collection disponible
              </span>
            </div>

            <h1 className="font-display text-sf-text leading-tight mb-6 animate-fade-up"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', animationDelay: '100ms' }}>
              Mode pour toute la famille,{' '}
              <span className="text-sf-rose-dark italic">du plus petit</span>{' '}
              au plus grand.
            </h1>

            <p className="font-body text-sf-text-soft text-lg leading-relaxed max-w-lg mb-8
                          animate-fade-up"
               style={{ animationDelay: '200ms' }}>
              Des vêtements doux, élégants et confortables pour toute la famille.
              Livrés partout en Algérie, paiement à la livraison.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up"
                 style={{ animationDelay: '300ms' }}>
              <Link to="/products" className="btn-primary text-base px-10 py-4">
                Découvrir la collection
                <ArrowRight size={16} />
              </Link>
              <Link to="/products?category=Bébé" className="btn-secondary text-base px-10 py-4">
                Collection bébé 👶
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 animate-fade-up"
                 style={{ animationDelay: '400ms' }}>
              {[
                { val: '500+', label: 'Clients satisfaits' },
                { val: '58', label: 'Wilayas livrées' },
                { val: '100%', label: 'Paiement livraison' },
              ].map(({ val, label }) => (
                <div key={label}>
                  <p className="font-display text-sf-text text-2xl">{val}</p>
                  <p className="font-body text-sf-text-soft text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Catégories ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-20">
        <div className="text-center mb-12">
          <p className="sf-label mb-3">Collections</p>
          <h2 className="font-display text-sf-text text-4xl md:text-5xl">
            Toutes les catégories
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(({ label, emoji, desc, color, border }, i) => (
            <Link key={label} to={`/products?category=${label}`}
              className={`${color} rounded-2xl p-5 text-center border-2 border-transparent
                          ${border} transition-all duration-300 hover:shadow-soft
                          hover:-translate-y-1 animate-fade-up`}
              style={{ animationDelay: `${i * 80}ms` }}>
              <span className="text-4xl block mb-3">{emoji}</span>
              <p className="font-display text-sf-text text-lg mb-1">{label}</p>
              <p className="font-body text-sf-text-soft text-xs">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Idées cadeaux naissance ──────────────────────────────────────── */}
      {babyProducts.length > 0 && (
        <section className="bg-sf-rose-soft py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="sf-label mb-3">💝 Idées cadeaux</p>
                <h2 className="font-display text-sf-text text-4xl md:text-5xl">
                  Collection Naissance
                </h2>
                <p className="font-body text-sf-text-soft mt-2">
                  Des pièces douces et délicates pour accueillir bébé
                </p>
              </div>
              <Link to="/products?category=Bébé"
                className="hidden sm:flex items-center gap-2 font-body text-sf-rose-dark
                           text-sm font-semibold hover:text-sf-text transition-colors group">
                Voir tout
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {babyProducts.map((product, i) => (
                <div key={product._id} className="relative animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}>
                  {i === 0 && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="badge">⭐ Best Seller</span>
                    </div>
                  )}
                  <Link to={`/products/${product._id}`}
                    className="card-product block">
                    <div className="aspect-square bg-sf-beige overflow-hidden rounded-t-2xl">
                      <img src={product.images?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500
                                   group-hover:scale-105" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-display text-sf-text text-base leading-tight mb-1">
                        {product.name}
                      </h3>
                      <p className="font-body font-bold text-sf-rose-dark text-sm">
                        {(product.price ?? 0).toLocaleString('fr-DZ')} DA
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Nouveautés ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="sf-label mb-3">Sélection</p>
            <h2 className="font-display text-sf-text text-4xl md:text-5xl">
              Dernières nouveautés
            </h2>
          </div>
          <Link to="/products"
            className="hidden sm:flex items-center gap-2 font-body text-sf-text-soft
                       text-sm hover:text-sf-rose transition-colors group">
            Voir tout
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <ProductGrid products={products} loading={loading} />
      </section>

      {/* ── Looks complets / Idées cadeaux ───────────────────────────────── */}
      <section className="bg-sf-sage-soft py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <p className="sf-label mb-3">Inspirations</p>
            <h2 className="font-display text-sf-text text-4xl md:text-5xl">
              Looks & Idées cadeaux
            </h2>
            <p className="font-body text-sf-text-soft mt-3 max-w-lg mx-auto">
              Des ensembles coordonnés et idées cadeaux pour toute la famille
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Look Bébé Printemps', desc: 'Body + Salopette + Chaussons', emoji: '🌸', color: 'bg-sf-rose-soft', tag: 'look-bebe-printemps' },
              { title: 'Look Femme Casual', desc: 'Haut + Pantalon + Sac', emoji: '🌿', color: 'bg-sf-sage-soft', tag: 'look-femme-casual' },
              { title: 'Idées de cadeaux', desc: 'Sélection spéciale cadeaux', emoji: '🎁', color: 'bg-amber-50', tag: 'idees-de-cadeaux' },
            ].map(({ title, desc, emoji, color, tag }, i) => (
              <Link key={title} to={`/tag/${tag}`}
                className={`${color} rounded-2xl p-8 text-center border border-sf-beige-dark
                             hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1
                             animate-fade-up block`}
                style={{ animationDelay: `${i * 100}ms` }}>
                <span className="text-6xl block mb-6">{emoji}</span>
                <h3 className="font-display text-sf-text text-2xl mb-2">{title}</h3>
                <p className="font-body text-sf-text-soft text-sm mb-6">{desc}</p>
                <span className="inline-flex items-center gap-2 bg-sf-sage text-white
                                 font-body font-semibold rounded-full px-6 py-2.5 text-sm
                                 hover:bg-sf-sage-dark transition-colors">
                  Découvrir
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Avis clients ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-20">
        <div className="text-center mb-12">
          <p className="sf-label mb-3">Témoignages</p>
          <h2 className="font-display text-sf-text text-4xl md:text-5xl">
            Nos clients adorent
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, text, stars }, i) => (
            <div key={name}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg
                         transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: stars }).map((_, j) => (
                  <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="font-body text-sf-text-soft text-sm leading-relaxed mb-4 italic">
                "{text}"
              </p>
              <p className="font-body font-bold text-sf-text text-sm">— {name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────────── */}
      <section className="bg-sf-rose py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-display text-sf-text text-4xl md:text-5xl mb-4">
            Toute la famille habillée 👨‍👩‍👧‍👦
          </p>
          <p className="font-body text-sf-text-soft mb-8">
            Livraison dans les 58 wilayas · Paiement à la livraison
          </p>
          <Link to="/products" className="btn-primary bg-sf-text text-white text-base px-10 py-4
                                          hover:bg-sf-brown hover:shadow-soft-lg">
            Découvrir tous les articles
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage