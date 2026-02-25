import { useState, useEffect } from 'react'
import api from '../utils/api'

const wilayasCache = { data: null }
const feesCache = {}
const communesCache = {}

export function useDeliveryFees() {
  const [wilayas, setWilayas] = useState([])
  const [communes, setCommunes] = useState([])
  const [deliveryFee, setDeliveryFee] = useState(null)
  const [deliverySpeed, setDeliverySpeed] = useState('express') // 'express' | 'economic'
  const [deliveryType, setDeliveryType] = useState('home')     // 'home' | 'desk'
  const [currentCommuneFees, setCurrentCommuneFees] = useState(null)
  const [loadingFee, setLoadingFee] = useState(false)
  const [loadingCommunes, setLoadingCommunes] = useState(false)
  const [feesData, setFeesData] = useState(null)

  useEffect(() => {
    if (wilayasCache.data) { setWilayas(wilayasCache.data); return }
    api.get('/delivery/wilayas')
      .then(res => { wilayasCache.data = res.data; setWilayas(res.data) })
      .catch(() => {})
  }, [])

  // Calcule le prix selon speed + type
  const computeFee = (cf, speed, type) => {
    if (!cf) return null
    if (speed === 'express') {
      return type === 'home'
        ? (cf.express_home ?? cf.express_desk ?? null)
        : (cf.express_desk ?? cf.express_home ?? null)
    } else {
      // economic — peut être null si non disponible pour cette commune
      return type === 'home'
        ? (cf.economic_home ?? null)
        : (cf.economic_desk ?? null)
    }
  }

  const onWilayaChange = async (wilayaId) => {
    setDeliveryFee(null)
    setCommunes([])
    setFeesData(null)
    setCurrentCommuneFees(null)
    if (!wilayaId) return

    setLoadingCommunes(true)
    try {
      if (communesCache[wilayaId]) setCommunes(communesCache[wilayaId])
      else {
        const res = await api.get(`/delivery/communes/${wilayaId}`)
        communesCache[wilayaId] = res.data
        setCommunes(res.data)
      }
    } catch(e) {} finally { setLoadingCommunes(false) }

    setLoadingFee(true)
    try {
      if (feesCache[wilayaId]) setFeesData(feesCache[wilayaId])
      else {
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
      setDeliveryFee(computeFee(cf, deliverySpeed, deliveryType))
    } else {
      setDeliveryFee(null)
      setCurrentCommuneFees(null)
    }
  }

  const onDeliverySpeedChange = (speed) => {
    setDeliverySpeed(speed)
    setDeliveryFee(computeFee(currentCommuneFees, speed, deliveryType))
  }

  const onDeliveryTypeChange = (type) => {
    setDeliveryType(type)
    setDeliveryFee(computeFee(currentCommuneFees, deliverySpeed, type))
  }

  return {
    wilayas, communes, deliveryFee, deliverySpeed, deliveryType,
    loadingFee, loadingCommunes,
    onWilayaChange, onCommuneChange, onDeliverySpeedChange, onDeliveryTypeChange,
    currentCommuneFees,
  }
}