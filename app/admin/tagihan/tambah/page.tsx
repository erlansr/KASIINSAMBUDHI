// app/admin/tagihan/tambah/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TambahTagihanPage() {
  const router = useRouter()
  const [keluargaList, setKeluargaList] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    keluargaId: '',
    bulan: '',
    nominal: '100000'
  })

  useEffect(() => {
    fetchKeluarga()
  }, [])

  const fetchKeluarga = async () => {
    const res = await fetch('/api/keluarga')
    const data = await res.json()
    if (data.success) {
      setKeluargaList(data.data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/tagihan-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/tagihan')
      } else {
        alert(data.error || 'Gagal menambah tagihan')
      }
    } catch (error) {
      alert('Gagal menambah tagihan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-content" style={{ maxWidth: '800px', padding: '2rem 1.5rem 4rem' }}>
      
      {/* Header */}
      <div className="tagihan-header" style={{ marginBottom: '2rem', padding: '0 0 1.5rem 0' }}>
        <div className="flex justify-between items-center">
          <div>
            <p className="tagihan-eyebrow">Admin Panel</p>
            <h1 className="tagihan-title" style={{ fontSize: '1.75rem', marginBottom: 0 }}>
              Tambah Tagihan
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
          <div style={{ marginBottom: '2rem' }}>
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

          {/* Tombol Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={loading}
              className="bayar-btn"
              style={{ padding: '0.75rem 2rem' }}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}