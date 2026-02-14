// src/components/public/CheckoutForm.jsx
// Formulaire de commande avec sélecteur de wilaya et commune libre

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import wilayas from '../../data/wilayas'

function CheckoutForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    wilaya: '',
    commune: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Prénom requis'
    if (!form.lastName.trim()) e.lastName = 'Nom requis'
    if (!form.phone.trim()) e.phone = 'Téléphone requis'
    else if (!/^(0)(5|6|7)\d{8}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Numéro algérien invalide (ex: 0551234567)'
    if (!form.wilaya) e.wilaya = 'Wilaya requise'
    if (!form.commune.trim()) e.commune = 'Commune requise'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) {
      setErrors(e2)
      return
    }
    onSubmit(form)
  }

  const Field = ({ name, label, type = 'text', placeholder, as }) => (
    <div>
      <label className="block text-brand-gray-400 text-xs font-heading font-semibold
                         tracking-widest uppercase mb-2">
        {label}
      </label>
      {as === 'select' ? (
        <div className="relative">
          <select
            name={name}
            value={form[name]}
            onChange={handleChange}
            className={`select-field ${errors[name] ? 'border-brand-red' : ''}`}
          >
            <option value="">Sélectionner une wilaya</option>
            {wilayas.map((w) => (
              <option key={w.code} value={w.name}>
                {w.code} — {w.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-400
                        pointer-events-none"
          />
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`input-field ${errors[name] ? 'border-brand-red' : ''}`}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-brand-red text-xs font-body">{errors[name]}</p>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field name="firstName" label="Prénom" placeholder="Karim" />
        <Field name="lastName" label="Nom" placeholder="Benali" />
      </div>
      <Field
        name="phone"
        label="Téléphone"
        type="tel"
        placeholder="0551234567"
      />
      <Field name="wilaya" label="Wilaya" as="select" />
      <Field
        name="commune"
        label="Commune"
        placeholder="Votre commune"
      />

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full text-center mt-6 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Traitement...
          </>
        ) : (
          'CONFIRMER LA COMMANDE'
        )}
      </button>
    </form>
  )
}

export default CheckoutForm