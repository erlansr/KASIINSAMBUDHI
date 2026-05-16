'use client'

import { useState, useEffect } from 'react'

// Komponen Popup Global
function GlobalSuccessPopup({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
      window.location.reload()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="global-popup-overlay">
      <div className="global-popup-container">
        <div className="global-popup-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="3"/>
          </svg>
        </div>
        <h3 className="global-popup-title">Pembayaran Berhasil!</h3>
        <p className="global-popup-message">Tagihan Anda telah berhasil dibayar.</p>
      </div>
    </div>
  )
}

interface BayarButtonProps {
  id: number | number[]
  nominal?: number
  bulan?: string
  multiple?: boolean
  onSuccess?: () => void
}

// Flag untuk mengecek apakah Snap.js sudah di-load
let snapLoaded = false

export default function BayarButton({ id, nominal, multiple, onSuccess }: BayarButtonProps) {
  const [loading, setLoading] = useState(false)

  const updateStatusLunas = async (ids: number | number[]) => {
    try {
      const isMultiple = Array.isArray(ids)
      const endpoint = isMultiple ? '/api/midtrans/update-status-bulk' : '/api/midtrans/update-status'
      const body = isMultiple ? { pembayaranIds: ids } : { pembayaranId: ids }
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      return res.ok
    } catch (error) {
      return false
    }
  }

  // Load Snap.js sekali saat komponen mount
  useEffect(() => {
    if (!snapLoaded && typeof window !== 'undefined') {
      // Cek apakah sudah ada script Snap.js
      const existingScript = document.querySelector('script[src*="midtrans.com/snap/snap.js"]')
      
      if (!existingScript) {
        const snapScript = document.createElement('script')
        snapScript.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
        snapScript.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!)
        snapScript.async = true
        snapScript.onload = () => {
          snapLoaded = true
        }
        document.body.appendChild(snapScript)
      } else {
        snapLoaded = true
      }
    }
  }, [])

  const handleBayar = async () => {
    setLoading(true)

    try {
      let endpoint = '/api/midtrans/create-transaction'
      let body = {}

      if (multiple && Array.isArray(id)) {
        endpoint = '/api/midtrans/create-transaction-bulk'
        body = { pembayaranIds: id }
      } else {
        body = { pembayaranId: id }
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (data.success) {
        // Tunggu sebentar hingga Snap.js siap
        const waitForSnap = (retries = 10) => {
          // @ts-ignore
          if (window.snap) {
            // @ts-ignore
            window.snap.pay(data.token, {
              onSuccess: async () => {
                await updateStatusLunas(id)
                if (onSuccess) onSuccess()
                setLoading(false)
              },
              onError: (result: any) => {
                alert('❌ Pembayaran gagal: ' + result.status_message)
                setLoading(false)
              }
            })
          } else if (retries > 0) {
            setTimeout(() => waitForSnap(retries - 1), 200)
          } else {
            alert('❌ Gagal memuat pembayaran. Silakan refresh halaman.')
            setLoading(false)
          }
        }
        
        waitForSnap()
      } else {
        alert('Error: ' + (data.error || 'Gagal memproses'))
        setLoading(false)
      }
    } catch (error) {
      alert('Gagal koneksi ke server')
      setLoading(false)
    }
  }

  const getButtonText = () => {
    if (loading) return 'Memproses...'
    if (multiple && Array.isArray(id) && nominal) {
      return `Bayar Rp ${nominal.toLocaleString('id-ID')}`
    }
    return 'Bayar'
  }

  return (
    <button
      onClick={handleBayar}
      disabled={loading}
      className="bayar-btn"
    >
      {loading ? (
        <>
          <span className="bayar-btn-spinner" />
          Memproses…
        </>
      ) : (
        <>
          {getButtonText()}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </>
      )}
    </button>
  )
}