import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Plus } from 'lucide-react'
import api from '../../utils/api'

/* ══════════════════════════════════════════════════════
   BRANCHE FLORALE — image exacte encodée en base64
══════════════════════════════════════════════════════ */
function FloralBranch() {
  return (
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABCMAAADhCAYAAADyIH9kAAAWt0lEQVR4nO3dWZLktpIF0EiZlv8W0dvo1VV/ZOerqCgyggMGd8c5ZjKTVEOSBIjhEgS//uc///sAAAAAGOWf2QcAAAAArEUYAQAAAAwljAAAAACGEkYAAAAAQwkjAAAAgKGEEQAAAMBQwggAAABgKGEEAAAAMJQwAgAAABhKGAEAAAAMJYwAAAAAhhJGAAAAAEMJIwAAAIChhBEAAADAUMIIAAAAYChhBAAAADCUMAIAAAAYShgBAAAADCWMAAAAAIYSRgAAAABDCSMAAACAof6dfQAAANDZr6d//5p2FAD8lzACAICV/Hr5b+EEwATCCAAAKnoNHc78PgEFQGfCCAAAqjgaQAAwmTACAIDsWocQVksAdOZrGgAAAMBQVkYAAJDVyNcyfn6WFRIADQgjAADIaNb+ED4TCtCAMAIA4vCeOhwTZaPKXw/3KMAlwgjY58kHMMKnSZWl4QBAOcII+BblCQuwljNtj1AC9NcAZQgjqMYgBcjgTltlWTir0scDFCKMoIIRgxPvcQN3tG6nBBIQR6v78bWd+Hp4ZRQoTBhBdp6SAKsSSEBtr2McD0aAUoQRZBQlgPC0AjiiZ5slkGAFUfr9nu6+uvVDewCkIYwgshUGH0Bt2jHgnbtthDYGSEsYQUQ6VoDjfGWDyqqOCXqdl9VSQBrCCKKoOtgAiG6v/TWhAQC6EUYwkwACqCpq+3bmuH6esHofHe4b2Sa4Z4EU/pl9AABAEz0mO0d284deMta3X0//PF7+HYAnVkbQy7tUXqcMVDazjdt6X7z18dijAo6JMN6xhwQQljCCVoQPAGsRStBLr3HDc101NgGYTBhBDzp4gHlGt8FCCTJ4rZ8//93qfok89rGHBBCSMAIA2og8GYGVmYD/JjwEwrCBJXfZmAmAx0NfQD7qLMBEwggAAKIQEAAswmsa3GHAYJkjAJCHcQsQhpURAHCfcPab60BE6iVAQFZGcIVO/ZunCwDQjvEFwEKEEXxiYADAGb8ewloA4ANhBFsEEO8ZZANAW73GHvpsgKCEETwTQgAAANCdMIIsfp5szA5MPGEBXs1ul6LRTh63V3dcwzayXcfn49WuAOUJI3g84nV4UQcPUY8LgFw+9bvPv67vqU8ZA0sSRhCFjhgAGCHKQ5h3Y5+vR5/jtMEsEIYwgtl0iACsIMoEeAXGFgAJCCN4PPql7+9+3hWzBnIGNQDHefL6JyHEZyteI/cIsDxhBI9H3EHA7OMyUAAqGR0804ZwZz0971N1CQhDGLGuKAPSKMfxSmcNVPG18e+9215fifgWtY9jrr37QH0BliKMAIC69iY9PVZJHPk7VwkpWl/bn7+v2nX60bI+ZrtGAghgWcIIRsg2MADgvDuTquqTbeKINPnPsF8XQDfCCHo50ulFGhAArOa5nT7bHr+28a3ac6EEFc2qz+4jIDRhxHpGBADvOr+oAYQOG2Df6DYycyjRq5/LeC2OWvEVjajjIYBhhBH1WQL4WdbjBpjNhOpPPa+Hr2rcN6O+KjOAHcKI2gwSAdZlEjTOqP62YiBRZaxyplx6n3O1OgIUJYzgrCsdXLSBhk4a4JzX1yaiteugbwdIRhhRV49Pts362a0YqAAr6fEUfXT7Hn0lQNT+DgDCE0bQStQBWeRBLFCD1QIQ3yobi0Y7HoBdwgiO2OvYog68dcQAx0Vty39EXB0R/ZoBQHjCiHoMkACA1bwLrXqMjaIFZADpCCM4IkvAYWAAzBTxdY2Iqwqym1m+lcqyx3Xcqu+R7sfeKtUPYAHCCD75esTvyHW+AOdEb9fhqsh1u+exGQsB6Qgj2BO1U4t6XABRRZ6cfaLNJ6J39fL5fsvwQAdgmn9mHwApGAwCMEOkidyvh1c0Wph9HUda5TwBLrEygiyqDMIA4IoK+39UmpxHOpfs9QJYlDCijpadYqRN2HSwAMwUoS/Mrto1jHQ+xklAWsIIotK5AqAvyC3SpL2qCitmgEUJI9jinVgAMJkmB4EEkJIwIrdKgySdKFz3unv7p9/z6fdyTevX5Sq18QAAfxBG5GSACuz5aR+O7P3y+mvCiTi08zzLeG+qw2O9tv0A4Qkj8tCpAz+OtAdX2owjf8ZAdxyrI+Zx3QGgM2FEXEeWXVdyZeC3wnWBZyZIrEL7npu2ah4r3oA0hBE56NS36XBZRaQ2YO9Y3H/tRSr3d17LPstxAwATCSPmM2hrRzhBJdoGotK2Qh72kgDCEkaMY2IxnnCCTLK/mpX9+O+q3savWKZQic9/AuEII/qqPjjN5k556MDpYa9OZm87DHrrOFOO2evtjyrnAa+skgBCEUZcs/cE0ACmLh04d2kfyEZ7F4NyAKAkYcR7R5Ydm2CsxasfcMxqAd7Kn+Fsed6r1BeYabX2GQhqxTDiNWA4OohadZDJezp0PtF2EJ32q62f67nqvb/qeWdkDANMtWIY8UyHSStbdUnnDuvI2J/cbaMynnNvLdt9fcifVg95AMqpHkbosJhJQAFU1KtvjdA+Xj23CMdOPiu/3gVQPoyAaCyJXIPBJdFpg8jita5mm8Cfuddsig4spWoYoQEnOqFEXdqfNWVaQh6t3YlwPBnKjXtm3KNH6vbe73n9/+ooUE6VMEIDTVaf6m6EQTrHaIe2/XqoxxVUfjWDfM4ECzNXVmR58KCdBqbIHkYY/FOdAUJs2iAqU7+Jbi+UiNZvtujLs72eAvBRxDDi9dObe78Gq8jyZIXYtuqPNpUtI+pFlPasxbn2OpeMYfSsNuXsRN3EHiCAiGHEMx0F/PY8MPWlDj45+q6ydrYt1/QzbRVnHA1lztar0XtIZAyXALqaGUYYrMF57+6b6MtUs6vYZlU8J65baUUEuVghCFDQjDDC4Le/Vk/PlRXEY3VMfJG/rKGO5JCxnEbU9x6rCyLfrwCljQojNPB9Hf0s1NW/V/mxshn1v8eS5GejzinjhKo67flvrkVO7/YWu2PEmOfqCg91FSipZxih4fxbi45uxuD+3c9UznFZ1prLiHJyvzJL1XZo77zca2Nk3YdB/wzwiL+BZVWVNjizQ398n8rDYGibenyPelWrrb8jYl1QLvdEun6tV0qMXBW6F6ZEur4A3bQKIzSa7211NEc+WxpxAHdE1I71+bg+DV4iHC/r6H2vq8/QXtY++q7o7Umv1zh6iX49Abq5EkZoNPvI0GFW8ul6bz0Z2QszsjtyLupnXiPrqnryt5VXR6xaHyqXd/Rza3l89s0C6OxsGKFBPm/VwdirrJ268vu22vutFTZ4rHAOENWK9T5b/w1AcPaM6C/bcsHKXgdSd8rjyGs2FWXdLOyIVcqwpap1gXvUi2uiXbcKbWLLfr8i1wOY6lMYUaEjikSnGGsSL5y4ZrVVEi1VumaVzoU2VqgTn86xQttf4RxacS0AOrIyYi6Tulj7MLRcxRLpvHqpsEqi4qsMI84pe7mPUvXeh6ysVv1t9fMHAtgLIwygWJ1VLMcY2O2rej2qnhfXZasTxjj7Vro2qz4QWu18gcB+woiVOh/iqrqaYK/jr3SO2fS69rMGeeoScIc2pDYBBBCS1zRiqLDcvbVowUSPJyjVQorVV5OMOt+Z9WO1Mr2r6mc9M9eDq+Vx5JzvlPWMa1qxbl6xNwZzfQA6E0bEsepywWxGBEfRgpir9o69ah3vUTcyl//qKpZd1Xu3hejlHf34Zntuv10rgEF+woiqT2+oIdrkfORKlmjn3oLg7U9b+25EK2tlBf24v2KI1u7eoU4BKVgZQTZRJmsm1PQwu17TRrVy1M7lVa0u8s09CZSQZQPLld7lW/29e/ZV32PiR/U6H728ql//nqKX7RXqw3vRyjza8fyouMpvBvcjUErmlRFeLYFvUVaL8P5Tp8qnFuW5lpGbGFfw7tyM386rXFeAhUUII+40sCZh64pS9u8mn1yzVaYtr+2oOjO7bh6l3rJFvdgX6d6OdCyPx/F6E6UPj8w9CJT372N8R6BxpSVLP3+rfi3uBj8Vrwm0po9+b3Y7Mvvn77lab1ZbJWHFHMCTHisj9tLungOcygm7PSSOmz0Zj7RKoto+K5mPPYrZdZLYVqkfmSe/EY+7Rb2pPIZ7duZarXI/Aosb9ZrG6M8gVu/Q+Exd+Fula1LhHMilWp0z2Znv0z4UUetcr7pTqY8C4IB/H/06wdUGOu/OV8c6z6zVEpFWSbzKNvCFFc1e6VVZ9NUREY9tZD9WLZSINgYACOPqyggN6zktO9YeO3qvYtYAJ0uZVRsA8lv0uhfZyPthr5yOBIif7t/oE/CV/Xoony0r9EnaZmBpR8OIbI1l1A7MYAMgnt5fcDniys/b+jOfPqlITFHGBupIG64jwAHvwggNaWyRXwMA5tAWtDNicqi8iEJdbMN1BDhh1AaWs0RdIcFcM/eRyDBQ2bpv3EuxZahXAFdk2T9FOwxwUvUw4kf1iVSWPQnIZW8JeNX7KCP3/D0z6rIyI4qMdTHiZ6szXkeAEFYJIyCKLKsj3jl6/LMHiAB7qj+keCd7H/Tq9Xxal+m71YIA3CCMaOfoJLPnAKjCRHe0lQek5OU+z0m5MZs6eJ1rB9DYamFE74nnmdcleh2LQOKaLO+kZiLoOebMdXJvt6NespKV2o4jn8J9/r3v2oKVrhvAcKuFERF5Bz+enmWy4sBGHT9mxbqxCmUbU/V2Sb370971cJ0AJhFG1OS9xrhWXbmyeiDhneMYRtdBZRxX1fZInQMgjVXDiEivazz/vqqDo4x6Tp7fBRJ7y0j3fk+mgWfEXdBHy1ReQA7aFQBSWjWMGCVCKLHqk/jozpTLu3r0+mtZg4qKXP/5Vgu7AADSEEbE1DqUOBuKMMbZ8n33+7NOunp/kg1G087Si7oFQCnCiDGuhgGrv2fPPa91J8NAttIrS1YlzVGh7sArbQkA5aweRoye+FhSn4cJzVxV9pc4sgcI90WpG8o2D2E/AEy2ehgxy5kBUKUnxRlUvs7ZX9ep8kpH9nKIJkI9UJb5RKg3R6hbAJQljPgWYcL/aZVEi6c4lo2/l2VwetfeeWarG8/Hu0rZ8Zsy5wr1BgCCEEb8KfqyzQihSVWuae4n9tHv3S2ZrzfKjfbUKQCWIoz4W8ZJDdcp6zqyvsaRcaPRHjKU16plU0GG+gUASxFGxLT1yoaBFKN4nWeuvVe2qm54q22jp4j1q9L9CwCXCSO2RVodEeU4KnJt91V4haBCkLd37BVWU2Qql4zXd2WZ6hYALEsYwYoMVNdSIZT4xGoW+Bb1Pnd/AsALYcR6KjzxZhyT3DzuTsJGlnPUCSM5Ra5P2k8A2CGM2LfC09QVKc/zBBJraBlUVrnP1PvYItczdQcAPhBGAKsQMB6zdX22rl2kvXVaM5GMrWq9A4ClCCNYhcErXLd1/1S8p4QQsWWoc+oQABwkjPhsa2CRYUD0iaX3nGGvESpTr+ep0J8+HuoQAJwmjLjmddCRdTBlgsmKqty/3KftG6fyfaYeAcAFwog2ngcilQdcWSmTdgRYVKEOc5c6BAA3CCPas0ke5OKehXYq30fCBwBoSBjRjwkOre0NhNUxeM8kso/Xr6sAABwmjODxsJlldjNCioqva3jdCrYduR+q3zOV2joACEEYAfFdHQRbnQMmka8+tQfaDXUGAIYQRvRnYMdsX49+9c+qGpjvyP199D5doa96bRO1YQAwgTBiHJ8TZCavILCqSq8U3bl33fd/1oEK9QEAUhNGzGPFBMTVcjVJz5Up1KS+tCN0AICghBEYqK1HEDaelSnzbV33vXL5tJKtRbu59fPUjXb0bQAQnDBiPq9v9NX6es54yt1rmXmrc7FvxDbXJL69+v/pvtj79avtuXa/vUqv5wBAScKIeLYGTr0GqtUHaSOum0kEZ3ltoy7lGpcNKwEgGGFEDiMDCv4WZeBqMD3W3dBgdHkJyeBvW/dCj9duAICThBF5vRs8vZuIGHS1Nespd6QyVqfiOdo+2KsABL0AMIUwoib7ULRReVCqTqxrq14LJQAAGEoYsYbKk+peKl8zE87xem7y2fLvFWSyuq2NL62cAIAOhBFUdWcSVWmwaTJZ38igQ31iFeo6AHQmjKCi1YMIg+h2Wu4JUvVTg74Owkq26nq1exoAhhBGAHDU3qRra88JIQWr8BoHAFwgjIB7TLa4ovWGkVFWXcz++TCbYAIADhJGAHcYbN9TffXA0fpR+RqwrighIQCEJIyA3wwYGaHnhpM9/27Ws1eXhEfnCCUAYIMwAq5beUBuUH2P0OBPW9di5fsrutavGa3CKxwA8EQYAfBe74lX1f0j7jLhvee5/Ht9AeLTzwAA2CWMAM7KPsm9qvr+Dhl5jeCYEfes8OicT9dp1XYWgIUII6gk+yDYZHctvVcwVFshcffPHP3s6Ouv9diE88iKgr1j3Jv0az8AgFSEEXDN3UF/9gkiZPN6z727B1sFIHf/3Kdf2wok+NvrdckQ2lQJEwFg1z+zDwASyjCQ7eHrYWCc8fxXra8r+Hq4L985cm2iXzv3LwBlWRkBv436wkH0we+WjMfcS+vl8CYbVJJh74gWq2JGnp9VEgCUJIyAcyIPsHsxAP5btvfzfUqU0TJ9acO9AQATCCMglihPFQ3Ogayqfj3ECgkAShFGAD8McIEeooSsvWVbMQUAUwkjYLxoS+YjHQtQ16hQ4tPf37LN2/pKy+jz04YDkJKvaUBMI3bItwv/PT2u3dbERhlRzew6/etRawXDr0e9cwJgAVZGwLfZg2P4oS6yggivbjz/7F6rJUafX69zAoDmrIyA4zx14tWolQtWSEBfvVYXzLxv9VkAhGZlBKzHpDYm5cKKIm76+GlPhq3VB+9WJERYBQIA4VgZAbF5Ik4rJkJElaWN21o5cWY1xYzztJcEAGFZGQEQQ7SvrADfrkzm9/7MrJUgPz9TGwNAGFZGwHo8JWuv1QBf2UB+7+5j9zgA/D8rIwBi8QSTFc38AgUAMIEwAr5ZIk80PSZk6jkAACF4TYNKTLLgMxvaEd3Xw+a9AFCeMALmMBmsx8QJAAAOEkZADp4S5qCMoC1tHwAUJYyAY6xkoBqva5CJUAIAihFGQC4G4/EpI+jH/XWNMAeAcIQR8NvoJ8WeSgOcZ2J9jmsFQEjCCKox6AIAAAhOGAF/e10h0XMFg9URANdYIfGe6wNAaP/OPgAIbFRQ8PxzDBwBAIDyhBEQy6hg4lfnv5881AWye62/q684cz8DkIIwAuL6GVAbWAIcd6XNzB5g6CcASEcYQUVfj/wDy2e9zsUT8X5+rmulegiVPbeFGe5bbTcA6QkjAAB+excmzgq7hQ8AlCOMAOjHCgnIay8AOBJItAothBAAlCWMgDUZ4AJct9WGng0fXgML7TIASxFGwJpsjjlW9PfR7R8C973eQ0fuKfcdAMv6Z/YBQCcGeAAAAEEJI6hMIEFEX0//AADAkoQRVGfCt81kmGfqAgAAQ9kzAq55nbxF3AeA+KJ8bcOeEQAADGVlBCsYMcmy0gAAAOAgYQSrGBUU2A8AAADgA2EEnHMmaIgaSEQ9rpUpEwAAlmLPCFZy9/18E0Z62qqfW3Vu9v4SAABwmzCCFT1P8HpP7KJtdClQie9TGfXY9FK9AABgKGEEqzsSTLScqI0MQgAAAEISRsBvo58Oj1qC76l3TV+PNvVF/QAAYDhhBEBed1faCCIAAJhCGAGxvJscnplsmmQCAABhCSMgDwEDrahLAABMJYwAqOHIVzaEEAAAhCCMAKjldWNLAQQAAOEIIwDqEUAAABDa/wHn5slAUeMi1AAAAABJRU5ErkJggg=="
      alt=""
      style={{ width: 160, height: 36, objectFit: 'contain', opacity: 1 }}
    />
  )
}

/* ══════════════════════════════════════════════════════
   ICÔNE +✦ exacte du design
══════════════════════════════════════════════════════ */
function MagicStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8h12" stroke="#E8A0B4" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="#E8A0B4" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  )
}

/* ══════════════════════════════════════════════════════
   CATÉGORIES
══════════════════════════════════════════════════════ */
const CATEGORIES = [
  { label: 'Skincare',  img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=160&h=160&fit=crop&q=80', bg: '#FFE8EF', border: '#F9C8D4' },
  { label: 'Makeup',    img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=160&h=160&fit=crop&q=80', bg: '#EBE0FF', border: '#C9ADE8' },
  { label: 'Body Care', img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f35f?w=160&h=160&fit=crop&q=80', bg: '#9B5FC0', border: '#7B3FA0' },
  { label: 'Hair Care', img: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=160&h=160&fit=crop&q=80', bg: '#C8EDE0', border: '#A0D8C8' },
]

/* ══════════════════════════════════════════════════════
   CARTE PRODUIT
══════════════════════════════════════════════════════ */
function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const img     = product.images?.[0] || '/placeholder.jpg'
  const rating  = product.rating  || (4 + Math.random()).toFixed(1)
  const reviews = product.reviews || Math.floor(40 + Math.random() * 30)

  return (
    <Link to={`/products/${product._id}`} className="flex-shrink-0 block" style={{ width: 128 }}>
      <div style={{ background: 'white', borderRadius: 18, boxShadow: '0 2px 12px rgba(155,95,192,0.09)', overflow: 'hidden' }}>
        <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', background: '#F8F3FC' }}>
          <img src={img} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          <button onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.88)' }}>
            <Heart size={12} style={{ fill: liked ? '#E8A0B4' : 'none', color: liked ? '#E8A0B4' : '#C4B0D8', strokeWidth: 2 }} />
          </button>
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 rounded-full px-1.5 py-0.5"
               style={{ background: 'rgba(255,255,255,0.88)' }}>
            <Star size={8} style={{ fill: '#FBBF24', color: '#FBBF24' }} />
            <span style={{ fontSize: '8px', fontWeight: 700, color: '#2D2340' }}>{rating}</span>
            <span style={{ fontSize: '8px', color: '#B8A8C8' }}>({reviews})</span>
          </div>
        </div>
        <div style={{ padding: '8px 10px 10px' }}>
          <p style={{ fontSize: '10px', color: '#B8A8C8', marginBottom: 2 }}>{product.brand}</p>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#2D2340', lineHeight: 1.3, marginBottom: 6, minHeight: 28 }}
             className="line-clamp-2">{product.name}</p>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#2D2340' }}>
              ${(product.price ?? 0).toFixed(2)}
            </span>
            <button onClick={(e) => e.preventDefault()}
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: '#9B5FC0' }}>
              <Plus size={12} color="white" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ══════════════════════════════════════════════════════
   EN-TÊTE DE SECTION
══════════════════════════════════════════════════════ */
function SectionHeader({ title, to }) {
  return (
    <div className="flex items-center justify-between mb-3 px-5">
      <div className="flex items-center gap-2">
        <span style={{ fontSize: '18px', fontWeight: 900, color: '#2D2340' }}>{title}</span>
        <FloralBranch />
      </div>
      <Link to={to} style={{ fontSize: '13px', fontWeight: 600, color: '#8B7A9B' }}
            className="hover:opacity-70 flex-shrink-0">See All</Link>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   PAGE HOME
══════════════════════════════════════════════════════ */
function HomePage() {
  const [trending, setTrending] = useState([])
  const [arrivals, setArrivals] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/products')
      .then((res) => {
        const all = res.data || []
        setTrending(all.slice(0, 8))
        setArrivals([...all].reverse().slice(0, 8))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const Skeleton = () => (
    <div className="flex gap-2.5 px-5 overflow-hidden">
      {[1,2,3,4].map(i => (
        <div key={i} className="flex-shrink-0 animate-pulse"
             style={{ width: 128, height: 195, background: 'rgba(255,255,255,0.7)', borderRadius: 18 }} />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen pb-4" style={{ background: '#FEF0F8' }}>

      {/* ════════════════════════════════════════
          HERO — photo plein container, texte par-dessus
      ════════════════════════════════════════ */}
      <section className="px-4 pt-4 pb-5 animate-fade-up">
        <div className="relative rounded-3xl overflow-hidden" style={{ height: 248 }}>

          {/* Photo plein container — AUCUN texte alternatif visible */}
          <img
            src="images/images.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ display: 'block' }}
            onError={(e) => {
              // Si l'image ne charge pas, fond dégradé de remplacement
              e.target.style.display = 'none'
              e.target.parentElement.style.background =
                'linear-gradient(135deg, #8B6AAE 0%, #B896D4 40%, #C8A87E 80%, #D4B896 100%)'
            }}
          />

          {/* Overlay gauche pour lisibilité du texte */}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(110deg, rgba(80,40,130,0.55) 0%, rgba(80,40,130,0.25) 52%, transparent 100%)' }} />

          {/* Bloc texte glassmorphism — posé par-dessus la photo */}
          <div className="absolute"
               style={{
                 left: 16,
                 top: '50%',
                 transform: 'translateY(-50%)',
                 background: 'rgba(255,255,255,0.13)',
                 backdropFilter: 'blur(10px)',
                 WebkitBackdropFilter: 'blur(10px)',
                 borderRadius: 18,
                 border: '1px solid rgba(255,255,255,0.30)',
                 padding: '16px 18px',
                 maxWidth: '57%',
               }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.80)', marginBottom: 4 }}>
              New Collection
            </p>
            <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '2rem', fontWeight: 700, color: 'white', lineHeight: 1.05, marginBottom: 6 }}>
              Fairy Glow
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.55, marginBottom: 13 }}>
              Japanese essences infused<br />with morning dew magic.
            </p>
            <Link to="/products"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'white', color: '#3D2060',
                fontWeight: 700, fontSize: '12px',
                borderRadius: 50, padding: '8px 16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
                whiteSpace: 'nowrap',
              }}>
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SHOP BY MAGIC
      ════════════════════════════════════════ */}
      <section className="pb-5 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center justify-between mb-4 px-5">
          <div className="flex items-center gap-1.5">
            <MagicStar />
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#2D2340' }}>Shop by Magic</span>
            <FloralBranch />
          </div>
          <Link to="/products" style={{ fontSize: '13px', fontWeight: 600, color: '#8B7A9B' }}
                className="hover:opacity-70 flex-shrink-0">See All</Link>
        </div>
        <div className="grid grid-cols-4 gap-1 px-5">
          {CATEGORIES.map(({ label, img, bg, border }, i) => (
            <Link key={label} to={`/products?category=${label}`}
              className="flex flex-col items-center gap-2 animate-fade-up"
              style={{ animationDelay: `${i * 55}ms` }}>
              <div className="rounded-full overflow-hidden"
                   style={{ width: 72, height: 72, background: bg, border: `2.5px solid ${border}`, boxShadow: '0 2px 10px rgba(155,95,192,0.13)' }}>
                <img src={img} alt={label} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#5A4A6A', textAlign: 'center' }}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          TRENDING NOW
      ════════════════════════════════════════ */}
      <section className="pb-4 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <SectionHeader title="Trending Now" to="/products" />
        {loading ? <Skeleton /> : trending.length > 0 ? (
          <div className="flex gap-2.5 px-5 overflow-x-auto pb-2 scrollbar-hide">
            {trending.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <p className="text-center py-8" style={{ color: '#B8A8C8', fontSize: 14 }}>No products yet 🌸</p>
        )}
      </section>

      {/* ════════════════════════════════════════
          NEW ARRIVALS
      ════════════════════════════════════════ */}
      <section className="pb-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <SectionHeader title="New Arrivals" to="/products" />
        {!loading && arrivals.length > 0 && (
          <div className="flex gap-2.5 px-5 overflow-x-auto pb-2 scrollbar-hide">
            {arrivals.map(p => <ProductCard key={`a-${p._id}`} product={p} />)}
          </div>
        )}

        {/* ── Clean Japanese Beauty ── */}
        <div className="mx-5 mt-4 rounded-3xl overflow-hidden relative text-center"
             style={{
               background: 'linear-gradient(135deg, #FFD6E8 0%, #E8D6FF 28%, #D6EEFF 55%, #D6FFE8 78%, #FFF0D6 100%)',
               padding: '32px 20px 28px',
             }}>
          <span className="absolute top-3 left-5" style={{ fontSize: 11, color: '#C9ADE8', opacity: 0.7 }}>✦</span>
          <span className="absolute top-3 right-6" style={{ fontSize: 9, color: '#F9C8D4', opacity: 0.7 }}>✦</span>
          <svg className="mx-auto mb-3" width="34" height="34" viewBox="0 0 36 36" fill="none">
            <path d="M18 30 C18 30 6 22 6 14 C6 9 10 6 14 8 C15.5 8.5 17 10 18 12 C19 10 20.5 8.5 22 8 C26 6 30 9 30 14 C30 22 18 30 18 30Z"
                  fill="#9B5FC0" opacity="0.85"/>
            <path d="M18 30 C18 30 11 24 10 18 C13 19 16 22 18 26 C20 22 23 19 26 18 C25 24 18 30 18 30Z"
                  fill="#7B3FA0" opacity="0.7"/>
            <path d="M18 12 C18 12 16 8 18 5 C20 8 18 12 18 12Z" fill="#C9ADE8"/>
          </svg>
          <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.55rem', fontWeight: 700, color: '#4A3070', lineHeight: 1.1, marginBottom: 8 }}>
            Clean Japanese Beauty
          </p>
          <p style={{ fontSize: '13px', color: '#7A6888', lineHeight: 1.65 }}>
            Curated with love from Tokyo to your doorstep.<br />
            Cruelty-free and magical.
          </p>
        </div>
      </section>
    </div>
  )
}

export default HomePage