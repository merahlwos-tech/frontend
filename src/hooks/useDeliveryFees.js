import { useState, useEffect } from 'react'
import api from '../utils/api'

// Cache en mémoire pour éviter les appels répétés
const wilayasCache = { data: null }
const feesCache = {}
const communesCache = {}

export function useDeliveryFees() {
  const [wilayas, setWilayas] = useState([])
  const [communes, setCommunes] = useState([])
  const [deliveryFee, setDeliveryFee] = useState(null)
  const [deliveryType, setDeliveryType] = useState('home') // 'home' | 'desk'
  const [currentCommuneFees, setCurrentCommuneFees] = useState(null)
  const [loadingFee, setLoadingFee] = useState(false)
  const [loadingCommunes, setLoadingCommunes] = useState(false)
  const [feesData, setFeesData] = useState(null)

  // Charger la liste des wilayas au montage
  useEffect(() => {
    if (wilayasCache.data) { setWilayas(wilayasCache.data); return }
    api.get('/delivery/wilayas')
      .then(res => { wilayasCache.data = res.data; setWilayas(res.data) })
      .catch(() => {})
  }, [])

  const onWilayaChange = async (wilayaId) => {
    setDeliveryFee(null)
    setCommunes([])
    setFeesData(null)
    if (!wilayaId) return

    // Communes
    setLoadingCommunes(true)
    try {
      if (communesCache[wilayaId]) {
        setCommunes(communesCache[wilayaId])
      } else {
        const res = await api.get(`/delivery/communes/${wilayaId}`)
        communesCache[wilayaId] = res.data
        setCommunes(res.data)
      }
    } catch(e) {} finally { setLoadingCommunes(false) }

    // Fees
    setLoadingFee(true)
    try {
      if (feesCache[wilayaId]) {
        setFeesData(feesCache[wilayaId])
      } else {
        const res = await api.get(`/delivery/fees/${wilayaId}`)
        feesCache[wilayaId] = res.data
        setFeesData(res.data)
      }
    } catch(e) {} finally { setLoadingFee(false) }
  }

  const onCommuneChange = (communeId) => {
    if (!feesData || !communeId) { setDeliveryFee(null); setCurrentCommuneFees(null); return }
    const cf = feesData.per_commune?.[String(communeId)]
    if (cf) {
      setCurrentCommuneFees(cf)
      const fee = deliveryType === 'home'
        ? (cf.express_home ?? cf.express_desk ?? null)
        : (cf.express_desk ?? cf.express_home ?? null)
      setDeliveryFee(fee)
    } else {
      setDeliveryFee(null)
      setCurrentCommuneFees(null)
    }
  }

  const onDeliveryTypeChange = (type) => {
    setDeliveryType(type)
    if (!currentCommuneFees) return
    const fee = type === 'home'
      ? (currentCommuneFees.express_home ?? currentCommuneFees.express_desk ?? null)
      : (currentCommuneFees.express_desk ?? currentCommuneFees.express_home ?? null)
    setDeliveryFee(fee)
  }

  return { wilayas, communes, deliveryFee, deliveryType, loadingFee, loadingCommunes, onWilayaChange, onCommuneChange, onDeliveryTypeChange, currentCommuneFees }
}