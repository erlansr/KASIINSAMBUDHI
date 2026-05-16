// app/tagihan/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'  // ← TAMBAHKAN useState, useEffect
import BayarButton from '@/components/BayarButton'

function TagihanContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [tagihan, setTagihan] = useState([])
  const [keluarga, setKeluarga] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTagihan, setSelectedTagihan] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showGlobalPopup, setShowGlobalPopup] = useState(false)  // ← TAMBAHKAN INI

  useEffect(() => {
    if (id) {
      fetch(`/api/tagihan?keluargaId=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTagihan(data.tagihan || [])
            setKeluarga(data.keluarga)
          }
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [id])

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID').format(angka)
  }

  const tagihanAktif = tagihan.filter((t: any) => t.status === 'belum_lunas')

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTagihan([])
    } else {
      const semuaId = tagihanAktif.map((t: any) => t.id)
      setSelectedTagihan(semuaId)
    }
    setSelectAll(!selectAll)
  }

  const handleSelectTagihan = (id: number) => {
    if (selectedTagihan.includes(id)) {
      setSelectedTagihan(selectedTagihan.filter(i => i !== id))
      setSelectAll(false)
    } else {
      setSelectedTagihan([...selectedTagihan, id])
      if (selectedTagihan.length + 1 === tagihanAktif.length) {
        setSelectAll(true)
      }
    }
  }

  const totalBayar = selectedTagihan.reduce((total, tagihanId) => {
    const t = tagihanAktif.find((t: any) => t.id === tagihanId)
    return total + (t?.nominal || 0)
  }, 0)

  if (loading) {
    return (
      <div className="tagihan-loading">
        <div className="tagihan-loading-spinner" />
        <p className="tagihan-loading-text">Memuat data tagihan…</p>
      </div>
    )
  }

  if (!keluarga) {
    return (
      <div className="tagihan-empty-state">
        <div className="tagihan-empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p className="tagihan-empty-title">Keluarga tidak ditemukan</p>
        <p className="tagihan-empty-sub">Data keluarga tidak tersedia atau telah dihapus.</p>
        <Link href="/" className="tagihan-back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Global Popup */}
      {showGlobalPopup && (
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
      )}

      {/* Back link */}
      <Link href="/" className="tagihan-back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        <span>Kembali</span>
      </Link>

      {/* Header */}
      <div className="tagihan-header">
        <p className="tagihan-eyebrow">Tagihan Iuran</p>
        <h1 className="tagihan-title">{keluarga.namaKeluarga}</h1>
        <div className="tagihan-meta-row">
          {keluarga.alamat && (
            <span className="tagihan-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              {keluarga.alamat}
            </span>
          )}
          {keluarga.noTelepon && (
            <span className="tagihan-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.57 3.47 2 2 0 0 1 3.54 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.88-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {keluarga.noTelepon}
            </span>
          )}
        </div>
      </div>

      {/* Pilihan Massal */}
      {tagihanAktif.length > 0 && (
        <div className="tagihan-bulk-bar">
          <label className="tagihan-checkbox-label">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="tagihan-checkbox"
            />
            <span>Pilih Semua</span>
          </label>
          {selectedTagihan.length > 0 && (
            <BayarButton 
              id={selectedTagihan} 
              nominal={totalBayar}
              multiple={true}
              onSuccess={() => {
                setShowGlobalPopup(true)
                setTimeout(() => {
                  window.location.reload()
                }, 2000)
              }}
            />
          )}
        </div>
      )}

      {/* Count strip */}
      <div className="tagihan-count-strip">
        <span className="tagihan-count-label">Tagihan belum lunas</span>
        <span className="tagihan-count-badge">{tagihanAktif.length}</span>
        {selectedTagihan.length > 0 && (
          <span className="tagihan-count-selected">
            {selectedTagihan.length} tagihan dipilih • Rp {formatRupiah(totalBayar)}
          </span>
        )}
      </div>

      {/* Tagihan list */}
      {tagihanAktif.length > 0 ? (
        <div className="tagihan-list">
          {tagihanAktif.map((t: any) => (
            <div key={t.id} className="tagihan-item">
              <div className="tagihan-item-left">
                <input
                  type="checkbox"
                  checked={selectedTagihan.includes(t.id)}
                  onChange={() => handleSelectTagihan(t.id)}
                  className="tagihan-item-checkbox"
                />
                <div>
                  <div className="tagihan-item-bulan">{t.bulan}</div>
                  <div className="tagihan-item-nominal">Rp {formatRupiah(t.nominal)}</div>
                </div>
              </div>
              <div className="tagihan-item-right">
                <BayarButton 
                  id={t.id} 
                  nominal={t.nominal} 
                  bulan={t.bulan}
                  onSuccess={() => {
                    setShowGlobalPopup(true)
                    setTimeout(() => {
                      window.location.reload()
                    }, 2000)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="tagihan-lunas-state">
          <div className="tagihan-lunas-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <p className="tagihan-lunas-title">Semua Tagihan Lunas</p>
          <p className="tagihan-lunas-sub">Tidak ada tagihan yang perlu dibayar saat ini.</p>
        </div>
      )}
    </div>
  )
}

export default function TagihanPage() {
  return (
    <Suspense fallback={
      <div className="tagihan-loading">
        <div className="tagihan-loading-spinner" />
        <p className="tagihan-loading-text">Memuat…</p>
      </div>
    }>
      <TagihanContent />
    </Suspense>
  )
}