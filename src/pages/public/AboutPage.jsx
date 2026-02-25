import { useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'
import { Link } from 'react-router-dom'
import { Leaf, Heart, Sparkles, ShieldCheck } from 'lucide-react'

const VALUES = [
  { icon: Leaf,        title: 'Clean Ingredients',    desc: 'Pure, natural ingredients sourced from Korea. No harmful chemicals, no compromise.', color: '#F0F7EE', iconColor: '#4A8C6A' },
  { icon: Heart,       title: 'Cruelty-Free',         desc: '100% cruelty-free, never tested on animals. Beauty that is kind to all living beings.', color: '#FDF0F4', iconColor: '#C47A9A' },
  { icon: Sparkles,    title: 'Korean Magic',         desc: 'Inspired by centuries-old Korean beauty rituals, blending tradition with modern science.', color: '#F0EEF7', iconColor: '#6A5A9C' },
  { icon: ShieldCheck, title: 'Dermatologist Tested', desc: 'Clinically tested and approved for all skin types. Safe, effective, and gentle.', color: '#FFF5E8', iconColor: '#B07A40' },
]

function AboutPage() {
  const { t } = useLang()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 16, background: '#F9F8FC' }}>

      {/* Hero */}
      <section style={{ padding: '20px 20px 12px' }}>
        <div style={{ borderRadius: 24, overflow: 'hidden', textAlign: 'center', padding: '40px 24px 32px', background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, left: 20, fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>✦</div>
          <div style={{ position: 'absolute', top: 16, right: 24, fontSize: 8, color: 'rgba(255,255,255,0.15)' }}>✦</div>
          <img src="images/logo.jpg" alt="Tinkerbells"
            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', border: '2px solid rgba(255,255,255,0.2)' }} />
          <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{t('about_tag')}</p>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2rem', fontWeight: 700, color: 'white', lineHeight: 1.15, marginBottom: 12 }}>
            {t('about_hero_title')}
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 280, margin: '0 auto' }}>
            {t('about_hero_sub')}
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section style={{ padding: '12px 20px' }}>
        <div style={{ borderRadius: 20, padding: '24px', background: 'white', border: '1px solid #F0EDF5' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4A8C6A', fontWeight: 700, marginBottom: 8 }}>{t('about_who')}</p>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.4rem', fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>
            {t('about_subtitle')}
          </p>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.75, marginBottom: 12 }}>
            {t('about_p1')}
          </p>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.75 }}>
            {t('about_p2')}
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section style={{ padding: '12px 20px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', fontWeight: 700, marginBottom: 16 }}>{t('about_values')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {VALUES.map(({ icon: Icon, title, desc, color, iconColor }) => (
            <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', borderRadius: 16, padding: '16px', background: 'white', border: '1px solid #F0EDF5' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} style={{ color: iconColor }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>{title}</p>
                <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.65 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '12px 20px 20px' }}>
        <div style={{ borderRadius: 20, padding: '28px 24px', textAlign: 'center', background: '#1A1A2E' }}>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: 8 }}>
            Prête à découvrir la magic ?
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>
            Découvrez notre gamme complète de beauté clean<br />inspirée de la Corée, livrée dans toute l'Algérie.
          </p>
          <Link to="/products"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#1A1A2E', borderRadius: 50, padding: '11px 24px', textDecoration: 'none', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}>
            Découvrir la boutique →
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AboutPage