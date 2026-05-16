// app/admin/keluarga/tambah/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TambahKeluargaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    namaKeluarga: '',
    alamat: '',
    noTelepon: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/keluarga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/keluarga')
      } else {
        alert('Gagal menambah keluarga')
      }
    } catch (error) {
      alert('Gagal menambah keluarga')
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
              Tambah Keluarga
            </h1>
          </div>
          <Link href="/admin/keluarga" className="tagihan-back-link" style={{ padding: 0 }}>
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
          
          {/* Nama Keluarga */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="tagihan-eyebrow" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.65rem' }}>
              Nama Kepala Keluarga *
            </label>
            <input
              type="text"
              value={form.namaKeluarga}
              onChange={(e) => setForm({ ...form, namaKeluarga: e.target.value })}
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

          {/* Alamat */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="tagihan-eyebrow" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.65rem' }}>
              Alamat
            </label>
            <textarea
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              rows={3}
              className="w-full px-4 py-3"
              style={{
                background: 'var(--color-white)',
                border: '1px solid var(--surface-border)',
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'all var(--duration-base) var(--ease-out)'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-black)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
            />
          </div>

          {/* No Telepon */}
          <div style={{ marginBottom: '2rem' }}>
            <label className="tagihan-eyebrow" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.65rem' }}>
              No Telepon
            </label>
            <input
              type="text"
              value={form.noTelepon}
              onChange={(e) => setForm({ ...form, noTelepon: e.target.value })}
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