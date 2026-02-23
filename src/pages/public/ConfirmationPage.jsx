import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, ShoppingBag, Home, X, RotateCcw } from 'lucide-react'

/* ══ TOAST ANNULATION 5s ══ */
function CancelToast({ onCancel, onDismiss }) {
  const [progress, setProgress] = useState(100)
  const ref = useRef(null)
  const DURATION = 5000

  useEffect(() => {
    const start = Date.now()
    ref.current = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / DURATION) * 100)
      setProgress(pct)
      if (pct <= 0) { clearInterval(ref.current); onDismiss() }
    }, 50)
    return () => clearInterval(ref.current)
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, width: 340, maxWidth: 'calc(100vw - 32px)',
      background: 'white', borderRadius: 16,
      boxShadow: '0 8px 32px rgba(45,35,64,0.18)',
      border: '1.5px solid rgba(249,200,212,0.5)', overflow: 'hidden',
      animation: 'slideDown 0.35s ease',
    }}>
      <div style={{ padding: '13px 15px 9px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(155,95,192,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={14} style={{ color: '#9B5FC0' }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#2D2340', lineHeight: 1 }}>Commande passée ! 🎉</p>
            <p style={{ fontSize: 11, color: '#8B7A9B', marginTop: 2 }}>Tu as 5 sec pour annuler</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={onCancel} style={{ background: 'rgba(249,200,212,0.35)', border: 'none', borderRadius: 50, padding: '5px 10px', fontSize: 11, fontWeight: 700, color: '#C4607A', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RotateCcw size={11} /> Annuler
          </button>
          <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4B0D8', padding: 4 }}>
            <X size={14} />
          </button>
        </div>
      </div>
      {/* Barre de progression */}
      <div style={{ height: 4, background: 'rgba(249,200,212,0.2)' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #9B5FC0, #E8A0B4)', transition: 'width 0.05s linear' }} />
      </div>
      <style>{`@keyframes slideDown { from { transform: translateX(-50%) translateY(-16px); opacity: 0 } to { transform: translateX(-50%) translateY(0); opacity: 1 } }`}</style>
    </div>
  )
}

/* ══ PAGE CONFIRMATION ══ */
function ConfirmationPage() {
  const [showToast, setShowToast] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [left, setLeft] = useState(false)

  // Affiche le toast dès qu'on clique sur un lien pour partir
  const handleLeave = (e) => {
    if (!left) {
      setLeft(true)
      setTimeout(() => setShowToast(true), 300)
    }
  }

  const handleCancel = () => {
    setCancelled(true)
    setShowToast(false)
    window.history.back()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden"
         style={{ background: 'linear-gradient(160deg, #FFF0F6 0%, #F5EEFF 45%, #EEF9F5 100%)' }}>

      {/* Éléments décoratifs flottants */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {[
          { s: '🌸', top: '8%',  left: '7%',  size: 22, delay: 0 },
          { s: '✨', top: '15%', left: '85%', size: 16, delay: 0.5 },
          { s: '💜', top: '70%', left: '5%',  size: 18, delay: 1 },
          { s: '✦',  top: '30%', left: '92%', size: 12, delay: 0.3 },
          { s: '🦋', top: '80%', left: '80%', size: 20, delay: 0.8 },
          { s: '⭐', top: '55%', left: '90%', size: 14, delay: 0.2 },
          { s: '✦',  top: '90%', left: '40%', size: 10, delay: 1.2 },
          { s: '🌸', top: '25%', left: '3%',  size: 14, delay: 0.6 },
        ].map((d, i) => (
          <span key={i} style={{ position: 'absolute', fontSize: d.size, top: d.top, left: d.left, opacity: 0.22, animation: `floatY 3s ease-in-out infinite`, animationDelay: `${d.delay}s` }}>
            {d.s}
          </span>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md text-center" style={{ animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>

        {/* Icône succès animée */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 28 }}>
          <div style={{
            width: 110, height: 110, borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8D6FF, #F9C8D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 12px 40px rgba(155,95,192,0.25)',
            animation: 'bounce 1s ease 0.3s',
          }}>
            <span style={{ fontSize: 54 }}>🎉</span>
          </div>
          <div style={{
            position: 'absolute', bottom: 2, right: -4,
            width: 34, height: 34, borderRadius: '50%',
            background: '#9B5FC0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 12px rgba(155,95,192,0.45)',
            animation: 'popIn 0.4s 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
          }}>
            <CheckCircle size={17} color="white" />
          </div>
        </div>

        <p style={{ fontSize: 10, fontWeight: 800, color: '#9B5FC0', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
          ✦ Commande confirmée ✦
        </p>
        <h1 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '3rem', fontWeight: 700, color: '#2D2340', lineHeight: 1.05, marginBottom: 14 }}>
          Merci ! 🌸
        </h1>
        <p style={{ fontSize: 14, color: '#7B6B8A', lineHeight: 1.8, marginBottom: 28 }}>
          Ta commande a bien été enregistrée.<br />
          Notre équipe te contactera très bientôt<br />
          pour confirmer la livraison. 💜
        </p>

        {/* Carte livraison */}
        <div style={{ background: 'white', borderRadius: 20, padding: '16px 20px', marginBottom: 24, boxShadow: '0 2px 16px rgba(155,95,192,0.09)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🚚</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#2D2340', marginBottom: 3 }}>
              Livraison dans toute l'Algérie 🇩🇿
            </p>
            <p style={{ fontSize: 12, color: '#8B7A9B' }}>
              2 à 5 jours ouvrables · Paiement à la livraison
            </p>
          </div>
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link to="/products" onClick={handleLeave}
            style={{ background: 'linear-gradient(135deg, #9B5FC0, #B896D4)', color: 'white', borderRadius: 50, padding: '14px 28px', textDecoration: 'none', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 20px rgba(155,95,192,0.30)' }}>
            <ShoppingBag size={16} /> Continuer mes achats
          </Link>
          <Link to="/" onClick={handleLeave}
            style={{ background: 'rgba(155,95,192,0.08)', color: '#9B5FC0', borderRadius: 50, padding: '13px 28px', textDecoration: 'none', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1.5px solid rgba(155,95,192,0.2)' }}>
            <Home size={16} /> Retour à l'accueil
          </Link>
        </div>
      </div>

      {/* Toast annulation */}
      {showToast && !cancelled && (
        <CancelToast onCancel={handleCancel} onDismiss={() => setShowToast(false)} />
      )}

      <style>{`
        @keyframes popIn { from { transform: scale(0.6); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes bounce { 0%,100% { transform: scale(1) } 50% { transform: scale(1.08) } }
        @keyframes floatY { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
      `}</style>
    </div>
  )
}

export default ConfirmationPage