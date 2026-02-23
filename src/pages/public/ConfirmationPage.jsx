import { useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, ShoppingBag, Home, X, RotateCcw, Loader2 } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const DURATION = 5000

function ConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderId = location.state?.orderId

  const [progress, setProgress] = useState(100)
  const [showPopup, setShowPopup] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const intervalRef = useRef(null)
  const cancelledRef = useRef(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })

    if (!orderId) return // pas d'orderId = on affiche juste la page sans popup

    const start = Date.now()
    intervalRef.current = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / DURATION) * 100)
      setProgress(pct)
      if (pct <= 0) {
        clearInterval(intervalRef.current)
        if (!cancelledRef.current) setShowPopup(false)
      }
    }, 50)

    return () => clearInterval(intervalRef.current)
  }, [])

  const handleCancel = async () => {
    clearInterval(intervalRef.current)
    cancelledRef.current = true
    setCancelling(true)
    try {
      await api.delete(`/orders/${orderId}/cancel`)
      setShowPopup(false)
      toast.success('Commande annulée ✓')
      navigate('/cart', { replace: true })
    } catch {
      toast.error("Erreur lors de l'annulation")
      setCancelling(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#F9F8FC' }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>

        {/* Icône succès */}
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#F0F7EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', border: '2px solid #D0E8D0' }}>
          <CheckCircle size={46} style={{ color: '#4A8C6A' }} />
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

        <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', marginBottom: 24, border: '1px solid #F0EDF5', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🚚</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', marginBottom: 3 }}>Livraison dans toute l'Algérie 🇩🇿</p>
            <p style={{ fontSize: 12, color: '#888' }}>2 à 5 jours ouvrables · Paiement à la livraison</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link to="/products" style={{ background: '#1A1A2E', color: 'white', borderRadius: 50, padding: '13px 28px', textDecoration: 'none', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <ShoppingBag size={15} /> Continuer mes achats
          </Link>
          <Link to="/" style={{ background: 'white', color: '#555', borderRadius: 50, padding: '12px 28px', textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px solid #E8E5F0' }}>
            <Home size={15} /> Retour à l'accueil
          </Link>
        </div>
      </div>

      {/* Popup annulation flottant */}
      {showPopup && orderId && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, width: 340, maxWidth: 'calc(100vw - 32px)',
          background: 'white', borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid #F0EDF5', overflow: 'hidden',
          animation: 'slideDown 0.3s ease',
        }}>
          <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#F0F7EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={15} style={{ color: '#4A8C6A' }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>Commande passée !</p>
                <p style={{ fontSize: 11, color: '#888', marginTop: 3 }}>5 secondes pour annuler</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FFF0F0', border: 'none', borderRadius: 50, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: '#CC5555', cursor: cancelling ? 'wait' : 'pointer', fontFamily: 'Nunito, sans-serif', opacity: cancelling ? 0.7 : 1 }}
              >
                {cancelling ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <RotateCcw size={11} />}
                Annuler
              </button>
              <button onClick={() => { clearInterval(intervalRef.current); setShowPopup(false) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CCC', padding: 4, display: 'flex' }}>
                <X size={14} />
              </button>
            </div>
          </div>
          {/* Barre de progression */}
          <div style={{ height: 4, background: '#F5F5F5' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#1A1A2E', transition: 'width 0.05s linear' }} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown { from { transform: translateX(-50%) translateY(-12px); opacity: 0 } to { transform: translateX(-50%) translateY(0); opacity: 1 } }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}

export default ConfirmationPage