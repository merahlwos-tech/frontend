// src/pages/public/HomePage.jsx
// Page d'accueil — hero section + 6 derniers produits

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import api from '../../utils/api'
import ProductGrid from '../../Components/public/ProductGrid'

function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts((res.data || []).slice(0, 6)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-black">

        {/* Background: grand texte décoratif */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-display text-[18vw] leading-none tracking-widest text-stroke
                        opacity-5 whitespace-nowrap"
            style={{ color: 'transparent', WebkitTextStroke: '1px #fff' }}
          >
            SNEAKERS
          </span>
        </div>

        {/* Ligne rouge verticale déco */}
        <div className="absolute left-0 top-0 w-1 h-full bg-brand-red opacity-80" />

        {/* Grille de fond */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-20">
          <div className="max-w-3xl">
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="tag">Nouvelle collection</span>
              <span className="text-brand-gray-500 text-xs font-body tracking-widest">
                — ALGÉRIE 2025
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="font-display text-[4rem] sm:text-[6rem] md:text-[8rem]
                            leading-none tracking-wide text-brand-white mb-2">
              WEAR
            </h1>
            <h1 className="font-display text-[4rem] sm:text-[6rem] md:text-[8rem]
                            leading-none tracking-wide mb-2"
                style={{ color: 'transparent', WebkitTextStroke: '2px #E8001D' }}>
              YOUR
            </h1>
            <h1 className="font-display text-[4rem] sm:text-[6rem] md:text-[8rem]
                            leading-none tracking-wide text-brand-white mb-8">
              GAME
            </h1>

            {/* Sous-titre */}
            <p className="text-brand-gray-400 font-body text-lg leading-relaxed max-w-md mb-10">
              Les meilleures sneakers streetwear, livrées dans toute l'Algérie.
              Paiement à la livraison.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="btn-primary inline-flex items-center gap-3 text-center justify-center">
                Explorer la collection
                <ArrowRight size={16} />
              </Link>
              <Link to="/products?category=Homme" className="btn-secondary inline-flex items-center gap-3 justify-center">
                Homme
              </Link>
              <Link to="/products?category=Femme" className="btn-secondary inline-flex items-center gap-3 justify-center">
                Femme
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-brand-gray-500 text-xs font-heading tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-brand-gray-500 to-transparent" />
        </div>
      </section>

      {/* ── Bande catégories ─────────────────────────────────────────────── */}
      <section className="bg-brand-gray-900 border-y border-brand-gray-800 py-4 overflow-hidden">
        <div className="flex items-center gap-0">
          {['Homme', 'Femme', 'Sport', 'Nouveautés', 'Promos'].map((cat, i) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="flex items-center gap-3 px-6 py-2 border-r border-brand-gray-800
                         hover:bg-brand-red/10 transition-colors group whitespace-nowrap"
            >
              <span className="font-heading font-bold tracking-widest uppercase text-sm
                               text-brand-gray-400 group-hover:text-brand-red transition-colors">
                {cat}
              </span>
              <ChevronRight size={12} className="text-brand-gray-700 group-hover:text-brand-red" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Produits mis en avant ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label">Collection</p>
            <h2 className="section-title">DERNIERS ARRIVAGES</h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 font-heading font-semibold
                       tracking-widest uppercase text-sm text-brand-gray-400
                       hover:text-brand-red transition-colors group"
          >
            Voir tout
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>

        <ProductGrid products={products} loading={loading} />

        <div className="flex justify-center mt-10 sm:hidden">
          <Link to="/products" className="btn-secondary inline-flex items-center gap-2">
            Voir tous les produits
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Bannière livraison ────────────────────────────────────────────── */}
      <section className="bg-brand-red py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <p className="font-display text-4xl sm:text-6xl text-white tracking-widest mb-4">
            LIVRAISON DANS TOUTE L'ALGÉRIE
          </p>
          <p className="text-white/80 font-body text-lg mb-8">
            58 wilayas — Paiement à la livraison — Retour facilité
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-brand-black text-white font-heading
                       font-bold tracking-wider uppercase px-8 py-3 hover:bg-white
                       hover:text-brand-black transition-colors duration-200"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
          >
            Commander maintenant
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage