import { Link } from 'react-router-dom'
import { Heart, Leaf, Sparkles, ShieldCheck } from 'lucide-react'

const VALUES = [
  { icon: Leaf,        title: 'Clean Ingredients',    desc: 'Pure, natural ingredients sourced from Japan. No harmful chemicals, no compromise.', color: '#EEF9F5', iconColor: '#6BBFA0' },
  { icon: Heart,       title: 'Cruelty-Free',         desc: '100% cruelty-free, never tested on animals. Beauty that is kind to all living beings.', color: '#FDF0F4', iconColor: '#E8A0B4' },
  { icon: Sparkles,    title: 'Japanese Magic',       desc: 'Inspired by centuries-old Japanese beauty rituals, blending tradition with modern science.', color: '#F5F0FC', iconColor: '#9B5FC0' },
  { icon: ShieldCheck, title: 'Dermatologist Tested', desc: 'Clinically tested and approved for all skin types. Safe, effective, and gentle.', color: '#FFF5E8', iconColor: '#F4A460' },
]

function AboutPage() {
  return (
    <div className="min-h-screen pb-4"
         style={{ background: 'linear-gradient(160deg, #FFF0F6 0%, #F5EEFF 45%, #EEF9F5 100%)' }}>

      {/* Hero */}
      <section className="px-5 pt-5 pb-3 animate-fade-up">
        <div className="relative rounded-3xl overflow-hidden text-center py-10 px-6"
             style={{ background: 'linear-gradient(135deg, #E8DCF5 0%, #F9C8D4 55%, #FFD8C0 100%)' }}>
          <span className="absolute top-4 left-5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>✦</span>
          <span className="absolute top-4 right-7 text-lg animate-float" style={{ color: 'rgba(255,255,255,0.4)' }}>✦</span>
          <span className="absolute bottom-5 left-10 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>✦</span>
          <div className="text-5xl mb-4">🌸</div>
          <p className="sf-label mb-2">Our Story</p>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2rem', fontWeight: 700, color: '#4A3060', lineHeight: 1.15 }} className="mb-3">
            Born from magic,<br />made with love.
          </p>
          <p style={{ fontSize: '13px', color: '#6A5080', lineHeight: 1.7 }} className="max-w-xs mx-auto">
            Tinkerbells est née d'un rêve — apporter les secrets de la beauté japonaise
            en Algérie, naturellement et avec intention.
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="px-5 py-3 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="rounded-3xl p-6" style={{ background: 'white', boxShadow: '0 2px 16px rgba(155,95,192,0.08)' }}>
          <p className="sf-label mb-2">Qui sommes-nous</p>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.35rem', fontWeight: 700, color: '#2D2340', marginBottom: 12 }}>
            Un peu de Tokyo,<br />beaucoup de passion.
          </p>
          <p style={{ fontSize: '13px', color: '#7B6B8A', lineHeight: 1.75 }} className="mb-3">
            Tinkerbells est une marque de beauté clean inspirée de la sagesse ancestrale
            des soins japonais. Nous croyons que la beauté doit être simple, honnête et
            bienveillante — pour votre peau et pour la planète.
          </p>
          <p style={{ fontSize: '13px', color: '#7B6B8A', lineHeight: 1.75 }}>
            Chaque produit est formulé avec des ingrédients comme l'extrait de saké,
            le thé vert, l'huile de camélia et des botaniques de rosée matinale —
            choisis pour leur efficacité prouvée et leur douceur. Disponibles partout
            en Algérie, livrés directement chez vous. 🇩🇿
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="px-5 py-3 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <span style={{ fontSize: '14px', color: '#C9ADE8' }}>✦</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#2D2340' }}>Nos valeurs</span>
        </div>
        <div className="flex flex-col gap-3">
          {VALUES.map(({ icon: Icon, title, desc, color, iconColor }, i) => (
            <div key={title}
              className="flex gap-4 items-start rounded-2xl p-4 animate-fade-up"
              style={{ background: 'white', boxShadow: '0 2px 12px rgba(155,95,192,0.07)', animationDelay: `${i * 60}ms` }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                   style={{ background: color }}>
                <Icon size={20} style={{ color: iconColor }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#2D2340', marginBottom: 3 }}>{title}</p>
                <p style={{ fontSize: '12px', color: '#8B7A9B', lineHeight: 1.65 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="rounded-3xl p-6 text-center relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #F5F0FC 0%, #FDF0F4 100%)' }}>
          <span className="absolute top-3 left-4 text-xs" style={{ color: '#C9ADE8' }}>✦</span>
          <span className="absolute bottom-3 right-5 text-sm" style={{ color: '#F9C8D4' }}>✦</span>
          <div className="text-3xl mb-2">🦋</div>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.3rem', fontWeight: 700, color: '#4A3060' }} className="mb-2">
            Prête à ressentir la magie ?
          </p>
          <p style={{ fontSize: '12px', color: '#8B7A9B', marginBottom: 16 }}>
            Découvrez notre gamme complète de beauté clean<br />inspirée du Japon, livrée dans toute l'Algérie.
          </p>
          <Link to="/products"
            className="inline-flex items-center gap-2 font-body font-semibold text-sm"
            style={{ background: '#9B5FC0', color: 'white', borderRadius: 50, padding: '10px 24px' }}>
            Découvrir la boutique ✨
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AboutPage