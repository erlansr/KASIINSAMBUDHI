// app/admin/tagihan/edit/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function EditTagihanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [keluargaList, setKeluargaList] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [form, setForm] = useState({
    keluargaId: '',
    bulan: '',
    nominal: '',
    status: ''
  })

  useEffect(() => {
    fetchKeluarga()
    if (id) {
      fetchTagihan()
    }
  }, [id])

  const fetchKeluarga = async () => {
    const res = await fetch('/api/keluarga')
    const data = await res.json()
    if (data.success) {
      setKeluargaList(data.data)
    }
  }

  const fetchTagihan = async () => {
    try {
      const res = await fetch(`/api/tagihan-admin/edit?id=${id}`)
      const data = await res.json()
      if (data.success) {
        setForm({
          keluargaId: data.data.keluargaId.toString(),
          bulan: data.data.bulan,
          nominal: data.data.nominal.toString(),
          status: data.data.status
        })
      }
    } catch (error) {
      alert('Gagal mengambil data')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/tagihan-admin/edit?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/tagihan')
      } else {
        alert(data.error || 'Gagal mengupdate')
      }
    } catch (error) {
      alert('Gagal mengupdate tagihan')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="tagihan-loading">
        <div className="tagihan-loading-spinner" />
        <p className="tagihan-loading-text">Memuat data tagihan...</p>
      </div>
    )
  }

  return (
    <div className="main-content" style={{ maxWidth: '800px', padding: '2rem 1.5rem 4rem' }}>
      
      {/* Header */}
      <div className="tagihan-header" style={{ marginBottom: '2rem', padding: '0 0 1.5rem 0' }}>
        <div className="flex justify-between items-center">
          <div>
            <p className="tagihan-eyebrow">Admin Panel</p>
            <h1 className="tagihan-title" style={{ fontSize: '1.75rem', marginBottom: 0 }}>
              Edit Tagihan
            </h1>
          </div>
          <Link href="/admin/tagihan" className="tagihan-back-link" style={{ padding: 0 }}>
            ← Kembali
          </Link>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ 
          background: 'var(--color-white)', 
          border: '1px solid var(--surface-border)',
          padding: '2rem'
        }}>
          
          {/* Pilih Keluarga */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="tagihan-eyebrow" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.65rem' }}>
              Pilih Keluarga *
            </label>
            <select
              value={form.keluargaId}
              onChange={(e) => setForm({ ...form, keluargaId: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--color-white)',
                border: '1px solid var(--surface-border)',
                fontSize: '0.875rem',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all var(--duration-base) var(--ease-out)'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-black)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
              required
            >
              <option value="">-- Pilih Keluarga --</option>
              {keluargaList.map((k: any) => (
                <option key={k.id} value={k.id}>
                  {k.namaKeluarga}
                </option>
              ))}
            </select>
          </div>

          {/* Bulan */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="tagihan-eyebrow" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.65rem' }}>
              Bulan *
            </label>
            <input
              type="text"
              value={form.bulan}
              onChange={(e) => setForm({ ...form, bulan: e.target.value })}
              placeholder="Contoh: Januari 2026"
              className="w-full px-4 py-3"
              style={{
                background: 'var(--color-white)',
                border: '1px solid var(--surface-border)',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all var(--duration-base) var(--ease-out)'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-black)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
              required
            />
          </div>

          {/* Nominal */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="tagihan-eyebrow" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.65rem' }}>
              Nominal (Rp) *
            </label>
            <input
              type="number"
              value={form.nominal}
              onChange={(e) => setForm({ ...form, nominal: e.target.value })}
              className="w-full px-4 py-3"
              style={{
                background: 'var(--color-white)',
                border: '1px solid var(--surface-border)',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all var(--duration-base) var(--ease-out)'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-black)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
              required
            />
          </div>

          {/* Status */}
          <div style={{ marginBottom: '2rem' }}>
            <label className="tagihan-eyebrow" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.65rem' }}>
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--color-white)',
                border: '1px solid var(--surface-border)',
                fontSize: '0.875rem',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all var(--duration-base) var(--ease-out)'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-black)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
            >
              <option value="belum_lunas">Belum Lunas</option>
              <option value="lunas">Lunas</option>
            </select>
          </div>

          {/* Tombol Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Link
              href="/admin/tagihan"
              className="bayar-btn"
              style={{ 
                background: 'var(--color-gray-200)', 
                color: 'var(--color-black)',
                padding: '0.75rem 1.5rem'
              }}
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bayar-btn"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              {loading ? 'Menyimpan...' : 'Update'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

