import { useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, ShoppingBag, Home, X, RotateCcw, Loader2 } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

/* ══ TOAST ANNULATION 5s ══ */
function CancelToast({ onCancel, onDismiss, cancelling }) {
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
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      border: '1px solid #F0EDF5', overflow: 'hidden',
      animation: 'slideDown 0.35s ease',
    }}>
      <div style={{ padding: '13px 15px 9px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F0F7EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={14} style={{ color: '#4A8C6A' }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>Commande passée !</p>
            <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Tu as 5 sec pour annuler</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={onCancel}
            disabled={cancelling}
            style={{ background: '#FFF0F0', border: 'none', borderRadius: 50, padding: '5px 10px', fontSize: 11, fontWeight: 700, color: '#CC5555', cursor: cancelling ? 'wait' : 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 4, opacity: cancelling ? 0.7 : 1 }}
          >
            {cancelling ? <Loader2 size={11} className="animate-spin" /> : <RotateCcw size={11} />}
            Annuler
          </button>
          <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CCC', padding: 4 }}>
            <X size={14} />
          </button>
        </div>
      </div>
      <div style={{ height: 4, background: '#F5F5F5' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#1A1A2E', transition: 'width 0.05s linear' }} />
      </div>
      <style>{`@keyframes slideDown { from { transform: translateX(-50%) translateY(-16px); opacity: 0 } to { transform: translateX(-50%) translateY(0); opacity: 1 } }`}</style>
    </div>
  )
}

function ConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderId = location.state?.orderId || sessionStorage.getItem('lastOrderId')

  const [showToast, setShowToast] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleCancel = async () => {
    if (!orderId) {
      toast.error("Impossible d'annuler : ID de commande introuvable")
      return
    }
    setCancelling(true)
    try {
      await api.put(`/orders/${orderId}`, { status: 'annulé' })
      setShowToast(false)
      toast.success('Commande annulée ✓')
      sessionStorage.removeItem('lastOrderId')
      navigate('/cart', { replace: true })
    } catch {
      toast.error("Erreur lors de l'annulation")
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#F9F8FC' }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>

        {/* Icône succès */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 28 }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#F0F7EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '2px solid #D0E8D0' }}>
            <span style={{ fontSize: 46 }}>✓</span>
          </div>
        </div>

        <p style={{ fontSize: 10, fontWeight: 800, color: '#4A8C6A', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
          Commande confirmée
        </p>
        <h1 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.8rem', fontWeight: 700, color: '#1A1A2E', lineHeight: 1.05, marginBottom: 14 }}>
          Merci ! 🌿
        </h1>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8, marginBottom: 28 }}>
          Ta commande a bien été enregistrée.<br />
          Notre équipe te contactera très bientôt<br />
          pour confirmer la livraison. 💚
        </p>

        {/* Carte livraison */}
        <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', marginBottom: 24, border: '1px solid #F0EDF5', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🚚</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', marginBottom: 3 }}>Livraison dans toute l'Algérie 🇩🇿</p>
            <p style={{ fontSize: 12, color: '#888' }}>2 à 5 jours ouvrables · Paiement à la livraison</p>
          </div>
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link to="/products" style={{ background: '#1A1A2E', color: 'white', borderRadius: 50, padding: '13px 28px', textDecoration: 'none', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <ShoppingBag size={15} /> Continuer mes achats
          </Link>
          <Link to="/" style={{ background: 'white', color: '#555', borderRadius: 50, padding: '12px 28px', textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px solid #E8E5F0' }}>
            <Home size={15} /> Retour à l'accueil
          </Link>
        </div>
      </div>

      {/* Toast annulation */}
      {showToast && (
        <CancelToast
          onCancel={handleCancel}
          onDismiss={() => setShowToast(false)}
          cancelling={cancelling}
        />
      )}
    </div>
  )
}

export default ConfirmationPage