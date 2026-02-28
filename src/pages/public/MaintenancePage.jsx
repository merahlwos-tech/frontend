import { useState } from 'react'

const MESSAGES = {
  fr: {
    tag: 'Site temporairement indisponible',
    title: 'Excusez-nous ! 🌸',
    body: "Vous êtes beaucoup trop nombreux — le site est en surcharge. Revenez dans quelques minutes et merci pour l'intérêt que vous portez à notre page 💜",
    sub: 'Merci pour votre patience',
    retry: 'Réessayer',
  },
  en: {
    tag: 'Temporarily unavailable',
    title: 'Sorry! 🌸',
    body: "There are too many of you — the site is overloaded. Please come back in a few minutes and thank you so much for your interest in our page 💜",
    sub: 'Thank you for your patience',
    retry: 'Try again',
  },
  ar: {
    tag: 'الموقع غير متاح مؤقتاً',
    title: 'نعتذر منكم ! 🌸',
    body: 'أنتم كثيرون جداً — الموقع مثقل حالياً. يرجى العودة بعد دقائق قليلة وشكراً جزيلاً على اهتمامكم بصفحتنا 💜',
    sub: 'شكراً على صبركم',
    retry: 'حاول مجدداً',
  },
}

export default function MaintenancePage({ onRetry }) {
  const [lang, setLang] = useState('fr')
  const m = MESSAGES[lang]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFD6E8 0%, #E8D6FF 40%, #D6E8FF 80%)',
      padding: '24px 20px', textAlign: 'center',
      direction: lang === 'ar' ? 'rtl' : 'ltr',
    }}>
      <div style={{ position: 'fixed', top: 40, left: 40, fontSize: 32, opacity: 0.2 }}>✦</div>
      <div style={{ position: 'fixed', bottom: 40, right: 40, fontSize: 28, opacity: 0.2 }}>✦</div>

      <div style={{
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
        borderRadius: 32, padding: '48px 40px', maxWidth: 480, width: '100%',
        boxShadow: '0 16px 64px rgba(155,95,192,0.15)',
        border: '1.5px solid rgba(249,200,212,0.4)',
      }}>
        <div style={{ marginBottom: 24 }}>
          <img src="/images/logo.jpg" alt="Tinkerbells"
            style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(249,200,212,0.6)', boxShadow: '0 4px 16px rgba(155,95,192,0.2)' }}
            onError={e => e.target.style.display = 'none'} />
        </div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9B5FC0', marginBottom: 12 }}>{m.tag}</p>
        <h1 style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2.4rem', fontWeight: 700, color: '#2D2340', lineHeight: 1.1, marginBottom: 16 }}>{m.title}</h1>
        <p style={{ fontSize: 15, color: '#5A4A6A', lineHeight: 1.75, marginBottom: 10, fontFamily: 'Nunito, sans-serif' }}>{m.body}</p>
        <p style={{ fontSize: 13, color: '#C4B0D8', fontWeight: 600, marginBottom: 32, fontFamily: 'Nunito, sans-serif' }}>— {m.sub} 🌿</p>
        <button onClick={onRetry}
          style={{ background: '#9B5FC0', color: 'white', border: 'none', borderRadius: 50, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 16px rgba(155,95,192,0.3)', marginBottom: 28 }}>
          {m.retry} ↺
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {['fr', 'en', 'ar'].map(l => (
            <button key={l} onClick={() => setLang(l)}
              style={{
                padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                fontFamily: 'Nunito, sans-serif', cursor: 'pointer', textTransform: 'uppercase',
                border: lang === l ? '1.5px solid #9B5FC0' : '1.5px solid rgba(155,95,192,0.2)',
                background: lang === l ? 'rgba(155,95,192,0.1)' : 'transparent',
                color: lang === l ? '#9B5FC0' : '#B8A8C8', transition: 'all .15s',
              }}>{l}</button>
          ))}
        </div>
      </div>
      <p style={{ marginTop: 24, fontFamily: 'Dancing Script, cursive', fontSize: '1.2rem', color: 'rgba(90,74,106,0.5)', fontWeight: 700 }}>Tinkerbells</p>
    </div>
  )
}