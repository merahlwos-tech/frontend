import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, ShoppingBag, Home, X, RotateCcw, Loader2 } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const DELAY = 5000 // 5 secondes avant envoi

function ConfirmationPage() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(100)
  const [sent, setSent] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [sending, setSending] = useState(false)
  const timerRef = useRef(null)
  const cancelledRef = useRef(false) // ref pour éviter les closures stales

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const pendingOrder = sessionStorage.getItem('pendingOrder')
    if (!pendingOrder) {
      // Pas de commande en attente, rediriger
      navigate('/', { replace: true })
      return
    }

    // Démarrer le compte à rebours
    const start = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.max(0, 100 - (elapsed / DELAY) * 100)
      setProgress(pct)

      if (pct <= 0) {
        clearInterval(timerRef.current)
        if (!cancelledRef.current) {
          sendOrder(JSON.parse(pendingOrder))
        }
      }
    }, 50)

    return () => clearInterval(timerRef.current)
  }, [])

  const sendOrder = async (orderData) => {
    setSending(true)
    try {
      await api.post('/orders', orderData)
      sessionStorage.removeItem('pendingOrder')
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande.')
      // Remettre les données et retourner au panier
      navigate('/cart', { replace: true })
    } finally {
      setSending(false)
    }
  }

  const handleCancel = () => {
    clearInterval(timerRef.current)
    cancelledRef.current = true
    setCancelled(true)
    sessionStorage.removeItem('pendingOrder')
    toast('Commande annulée', { icon: '✓' })
    navigate('/cart', { replace: true })
  }

  // Affichage pendant le compte à rebours (commande pas encore envoyée)
  if (!sent && !cancelled) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#F9F8FC' }}>
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>

          {/* Icône + spinner */}
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
            Ta commande sera envoyée dans quelques secondes.<br />
            Tu peux encore annuler si tu le souhaites. 💚
          </p>

          {/* Barre de progression + bouton annuler */}
          <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', marginBottom: 24, border: '1px solid #F0EDF5' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E' }}>
                {sending ? 'Envoi en cours...' : 'Envoi dans quelques secondes'}
              </p>
              {!sending && (
                <button
                  onClick={handleCancel}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#FFF0F0', border: 'none', borderRadius: 50, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#CC5555', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}
                >
                  <RotateCcw size={11} /> Annuler
                </button>
              )}
              {sending && <Loader2 size={16} style={{ color: '#4A8C6A', animation: 'spin 1s linear infinite' }} />}
            </div>
            {/* Barre */}
            <div style={{ height: 6, background: '#F0F0F0', borderRadius: 50, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #4A8C6A, #7BC8A0)',
                borderRadius: 50,
                transition: 'width 0.05s linear',
              }} />
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', border: '1px solid #F0EDF5', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>🚚</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', marginBottom: 3 }}>Livraison dans toute l'Algérie 🇩🇿</p>
              <p style={{ fontSize: 12, color: '#888' }}>2 à 5 jours ouvrables · Paiement à la livraison</p>
            </div>
          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // Affichage après envoi réussi
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#F9F8FC' }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>

        <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#F0F7EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', border: '2px solid #D0E8D0' }}>
          <CheckCircle size={46} style={{ color: '#4A8C6A' }} />
        </div>

        <p style={{ fontSize: 10, fontWeight: 800, color: '#4A8C6A', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
          Commande envoyée
        </p>
        <h1 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.8rem', fontWeight: 700, color: '#1A1A2E', lineHeight: 1.05, marginBottom: 14 }}>
          C'est parti ! 🌿
        </h1>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8, marginBottom: 28 }}>
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
    </div>
  )
}

export default ConfirmationPage