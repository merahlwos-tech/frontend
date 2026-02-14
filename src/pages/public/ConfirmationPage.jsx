// src/pages/public/ConfirmationPage.jsx
// Page de confirmation de commande après validation

import { Link } from 'react-router-dom'
import { CheckCircle2, ShoppingBag, Home } from 'lucide-react'

function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-brand-black pt-16 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center animate-slide-up">

        {/* Icône succès */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/30
                            flex items-center justify-center">
              <CheckCircle2 size={48} className="text-emerald-400" />
            </div>
            {/* Déco corners */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-brand-red" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-brand-red" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-brand-red" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-brand-red" />
          </div>
        </div>

        {/* Titre */}
        <p className="section-label justify-center flex">Commande validée</p>
        <h1 className="font-display text-5xl sm:text-6xl text-brand-white tracking-wide mb-4">
          MERCI !
        </h1>

        {/* Message */}
        <div className="bg-brand-gray-900 border border-brand-gray-800 p-6 mb-8 text-left">
          <p className="text-brand-white font-body mb-3">
            Votre commande a bien été enregistrée. 🎉
          </p>
          <p className="text-brand-gray-400 font-body text-sm leading-relaxed mb-3">
            Notre équipe va vous contacter dans les plus brefs délais pour confirmer
            les détails de votre livraison.
          </p>
          <p className="text-brand-gray-500 font-body text-sm">
            Livraison estimée : <span className="text-brand-gray-300">2 à 5 jours ouvrables</span>
          </p>
        </div>

        {/* Étapes */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { step: '01', label: 'Commande reçue', done: true },
            { step: '02', label: 'Confirmation', done: false },
            { step: '03', label: 'Livraison', done: false },
          ].map(({ step, label, done }) => (
            <div
              key={step}
              className={`p-3 border text-center ${
                done
                  ? 'border-brand-red bg-brand-red/5'
                  : 'border-brand-gray-800'
              }`}
            >
              <p className={`font-display text-2xl mb-1 ${done ? 'text-brand-red' : 'text-brand-gray-700'}`}>
                {step}
              </p>
              <p className={`text-xs font-heading font-semibold tracking-wider uppercase ${
                done ? 'text-brand-gray-300' : 'text-brand-gray-600'
              }`}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products" className="btn-primary inline-flex items-center justify-center gap-3">
            <ShoppingBag size={16} />
            Continuer les achats
          </Link>
          <Link to="/" className="btn-secondary inline-flex items-center justify-center gap-3">
            <Home size={16} />
            Accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage