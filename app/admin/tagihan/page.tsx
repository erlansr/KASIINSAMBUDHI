// app/admin/tagihan/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function TagihanPage() {
  const router = useRouter()
  const [tagihanList, setTagihanList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const admin = localStorage.getItem('admin')
    if (!admin) {
      router.push('/admin/login')
      return
    }
    fetchTagihan()
  }, [])

  const fetchTagihan = async () => {
    try {
      const res = await fetch('/api/tagihan-admin')
      const data = await res.json()
      if (data.success) {
        setTagihanList(data.data)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, bulan: string) => {
    if (!confirm(`Yakin hapus tagihan bulan "${bulan}"?`)) return

    try {
      const res = await fetch(`/api/tagihan-admin/edit?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (data.success) {
        alert('Tagihan berhasil dihapus')
        fetchTagihan()
      } else {
        alert(data.error || 'Gagal menghapus')
      }
    } catch (error) {
      alert('Gagal menghapus tagihan')
    }
  }

  const handleMarkPaid = async (id: number) => {
    if (!confirm('Tandai lunas tagihan ini?')) return

    try {
      const res = await fetch(`/api/tagihan-admin/mark-paid?id=${id}`, { method: 'POST' })
      const data = await res.json()
      
      if (data.success) {
        alert('Tagihan ditandai lunas')
        fetchTagihan()
      } else {
        alert(data.error || 'Gagal')
      }
    } catch (error) {
      alert('Gagal')
    }
  }

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID').format(angka)
  }

  if (loading) {
    return (
      <div className="tagihan-loading">
        <div className="tagihan-loading-spinner" />
        <p className="tagihan-loading-text">Memuat data tagihan...</p>
      </div>
    )
  }

  return (
    <div className="main-content" style={{ maxWidth: '1400px', padding: '1rem 1.5rem 4rem' }}>
      
      {/* Header */}
      <div className="tagihan-header" style={{ marginBottom: '2rem', padding: '0 0 1.5rem 0' }}>
        <div className="flex justify-between items-center">
          <div>
            <p className="tagihan-eyebrow">Admin Panel</p>
            <h1 className="tagihan-title" style={{ fontSize: '1.75rem', marginBottom: 0 }}>
              📋 Data Tagihan
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/tagihan/generate"
              className="bayar-btn"
              style={{ padding: '0.625rem 1.25rem' }}
            >
              📦 Generate Massal
            </Link>
            <Link
              href="/admin/tagihan/tambah"
              className="bayar-btn"
              style={{ background: 'var(--color-black)', padding: '0.625rem 1.25rem' }}
            >
              + Tambah Tagihan
            </Link>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/admin/dashboard" className="tagihan-back-link" style={{ padding: 0 }}>
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Table */}
      <div style={{ 
        background: 'var(--color-white)', 
        border: '1px solid var(--surface-border)',
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ 
              background: 'var(--color-gray-50)', 
              borderBottom: '1px solid var(--surface-border)' 
            }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Keluarga</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Bulan</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Nominal</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tagihanList.map((item: any, index: number) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>{index + 1}</td>
                <td style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-black)' }}>{item.keluarga?.namaKeluarga}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-gray-700)' }}>{item.bulan}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-black)' }}>
                  Rp {formatRupiah(item.nominal)}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  {item.status === 'lunas' ? (
                    <span style={{ 
                      background: '#e8f5e9', 
                      color: '#2e7d32',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em'
                    }}>
                      LUNAS
                    </span>
                  ) : (
                    <span style={{ 
                      background: '#ffebee', 
                      color: '#c62828',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em'
                    }}>
                      BELUM LUNAS
                    </span>
                  )}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    {item.status === 'belum_lunas' && (
                      <button
                        onClick={() => handleMarkPaid(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2e7d32',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        ✅ Tandai
                      </button>
                    )}
                    <Link
                      href={`/admin/tagihan/edit?id=${item.id}`}
                      style={{
                        color: 'var(--color-gray-600)',
                        textDecoration: 'none',
                        fontSize: '0.75rem'
                      }}
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.bulan)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#c62828',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {tagihanList.length === 0 && (
        <div className="tagihan-empty-state" style={{ marginTop: '2rem' }}>
          <div className="tagihan-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p className="tagihan-empty-title">Belum ada tagihan</p>
          <p className="tagihan-empty-sub">Generate tagihan massal atau tambah manual</p>
        </div>
      )}
    </div>
  )
}