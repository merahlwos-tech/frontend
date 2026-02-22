import { Link } from 'react-router-dom'
import { Heart, Leaf, Sparkles, ShieldCheck } from 'lucide-react'

const VALUES = [
  {
    icon: Leaf,
    title: 'Clean Ingredients',
    desc: 'Every product is formulated with pure, natural ingredients sourced from Japan. No harmful chemicals, ever.',
    color: 'bg-tb-mint-soft text-tb-green',
  },
  {
    icon: Heart,
    title: 'Cruelty-Free',
    desc: 'We love all living beings. All Tinkerbells products are 100% cruelty-free and never tested on animals.',
    color: 'bg-tb-pink-soft text-tb-pink-deep',
  },
  {
    icon: Sparkles,
    title: 'Japanese Magic',
    desc: 'Inspired by centuries-old Japanese beauty rituals, our formulas blend tradition with modern science.',
    color: 'bg-tb-lav-soft text-tb-purple',
  },
  {
    icon: ShieldCheck,
    title: 'Dermatologist Tested',
    desc: 'Safe for all skin types. Every formula is clinically tested and approved by dermatologists.',
    color: 'bg-orange-50 text-orange-400',
  },
]

const TEAM = [
  { name: 'Yuki Tanaka', role: 'Founder & Formulator', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&q=80' },
  { name: 'Mia Laurent', role: 'Head of Skincare', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&q=80' },
  { name: 'Sora Kim', role: 'Beauty Specialist', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80' },
]

function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#FDF0F4 0%,#F5F0FC 50%,#EEF9F5 100%)' }}>

      {/* ── Hero ──────────────────────────────── */}
      <section className="max-w-md mx-auto px-4 pt-6 pb-2 animate-fade-up">
        <div
          className="relative rounded-3xl overflow-hidden text-center py-10 px-6"
          style={{ background: 'linear-gradient(135deg, #E8DCF5 0%, #F9C8D4 50%, #FFD8C0 100%)' }}
        >
          <span className="absolute top-4 left-5 text-white/40 text-lg">✦</span>
          <span className="absolute top-4 right-6 text-white/40 text-sm animate-float">✦</span>
          <span className="absolute bottom-4 left-10 text-white/30 text-xs">✦</span>

          <div className="text-4xl mb-3">🌸</div>
          <p className="sf-label mb-2">Our Story</p>
          <p
            style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2rem', fontWeight: 700, lineHeight: 1.1 }}
            className="text-tb-text mb-3"
          >
            Born from magic,<br />made with love.
          </p>
          <p className="font-body text-tb-text-soft text-sm leading-relaxed max-w-xs mx-auto">
            Tinkerbells was born in Tokyo from a dream — to bring the secrets
            of Japanese beauty to the world, naturally and mindfully.
          </p>
        </div>
      </section>

      {/* ── Notre histoire ────────────────────── */}
      <section className="max-w-md mx-auto px-4 py-6 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="bg-white rounded-3xl p-6 shadow-card">
          <p className="sf-label mb-2">Who we are</p>
          <p
            style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.4rem', fontWeight: 700 }}
            className="text-tb-text mb-3"
          >
            A little bit of Tokyo, a whole lot of heart.
          </p>
          <p className="font-body text-tb-text-soft text-sm leading-relaxed mb-3">
            Founded in 2020, Tinkerbells is a clean beauty brand inspired by the
            ancient wisdom of Japanese skincare. We believe beauty should be simple,
            honest, and kind — to your skin and to the planet.
          </p>
          <p className="font-body text-tb-text-soft text-sm leading-relaxed">
            Each product is carefully crafted with ingredients like sake extract,
            green tea, camellia oil, and morning dew botanicals — chosen for their
            proven effectiveness and gentle touch.
          </p>
        </div>
      </section>

      {/* ── Nos valeurs ───────────────────────── */}
      <section className="max-w-md mx-auto px-4 py-3 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-tb-lav-deep text-sm">✦</span>
          <h2 className="font-body font-bold text-tb-text text-base">Our Values</h2>
          <span className="text-tb-text-light text-xs" style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>~~~~</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-4 shadow-card flex gap-4 items-start animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-body font-bold text-tb-text text-sm mb-1">{title}</h3>
                <p className="font-body text-tb-text-soft text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── L'équipe ──────────────────────────── */}
      <section className="max-w-md mx-auto px-4 py-5 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-tb-lav-deep text-sm">✦</span>
          <h2 className="font-body font-bold text-tb-text text-base">Meet the Team</h2>
          <span className="text-tb-text-light text-xs" style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>~~~~</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {TEAM.map(({ name, role, img }) => (
            <div key={name} className="bg-white rounded-2xl p-3 shadow-card text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 ring-2 ring-tb-pink ring-offset-1">
                <img src={img} alt={name} className="w-full h-full object-cover" />
              </div>
              <p className="font-body font-bold text-tb-text text-xs leading-tight">{name}</p>
              <p className="font-body text-tb-text-light text-[10px] mt-0.5">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="max-w-md mx-auto px-4 py-5 pb-6 animate-fade-up" style={{ animationDelay: '240ms' }}>
        <div
          className="rounded-3xl p-6 text-center"
          style={{ background: 'linear-gradient(135deg,#F5F0FC 0%,#FDF0F4 100%)' }}
        >
          <div className="text-3xl mb-2">🦋</div>
          <p
            style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.3rem', fontWeight: 700 }}
            className="text-tb-text mb-2"
          >
            Ready to feel the magic?
          </p>
          <p className="font-body text-tb-text-soft text-xs mb-4">
            Discover our full range of clean, Japanese-inspired beauty.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-tb-purple text-white font-body font-semibold text-sm rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity"
          >
            Shop Now ✨
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AboutPage