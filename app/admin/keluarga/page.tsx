// app/admin/keluarga/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function KeluargaPage() {
  const router = useRouter()
  const [keluargaList, setKeluargaList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const admin = localStorage.getItem('admin')
    if (!admin) {
      router.push('/admin/login')
      return
    }
    fetchKeluarga()
  }, [])

  const fetchKeluarga = async () => {
    try {
      const res = await fetch('/api/keluarga')
      const data = await res.json()
      if (data.success) {
        setKeluargaList(data.data)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Yakin hapus keluarga "${nama}"?`)) return

    try {
      const res = await fetch(`/api/keluarga/delete?id=${id}`, { 
        method: 'DELETE'
      })
      const data = await res.json()
      
      if (data.success) {
        alert('Keluarga berhasil dihapus')
        fetchKeluarga()
      } else {
        alert(data.error || 'Gagal menghapus')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Gagal menghapus keluarga')
    }
  }

  if (loading) {
    return (
      <div className="tagihan-loading">
        <div className="tagihan-loading-spinner" />
        <p className="tagihan-loading-text">Memuat data keluarga...</p>
      </div>
    )
  }

  return (
    <div className="main-content" style={{ maxWidth: '1200px', padding: '2rem 1.5rem 4rem' }}>
      
      {/* Header */}
      <div className="tagihan-header" style={{ marginBottom: '2rem', padding: '0 0 1.5rem 0' }}>
        <div className="flex justify-between items-center">
          <div>
            <p className="tagihan-eyebrow">Admin Panel</p>
            <h1 className="tagihan-title" style={{ fontSize: '1.75rem', marginBottom: 0 }}>
              Data Keluarga
            </h1>
          </div>
          <Link
            href="/admin/keluarga/tambah"
            className="bayar-btn"
            style={{ padding: '0.625rem 1.25rem' }}
          >
            + Tambah Keluarga
          </Link>
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
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Nama Keluarga</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Alamat</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No Telepon</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {keluargaList.map((item: any, index: number) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>{index + 1}</td>
                <td style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-black)' }}>{item.namaKeluarga}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>{item.alamat || '-'}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>{item.noTelepon || '-'}</td>
                <td style={{ padding: '1rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    <Link
                      href={`/admin/keluarga/edit?id=${item.id}`}
                      style={{
                        color: 'var(--color-gray-600)',
                        textDecoration: 'none',
                        fontSize: '0.75rem'
                      }}
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.namaKeluarga)}
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
      {keluargaList.length === 0 && (
        <div className="tagihan-empty-state" style={{ marginTop: '2rem' }}>
          <div className="tagihan-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p className="tagihan-empty-title">Belum ada data keluarga</p>
          <p className="tagihan-empty-sub">Tambah keluarga baru untuk memulai</p>
          <Link href="/admin/keluarga/tambah" className="tagihan-back-btn" style={{ marginTop: '1rem' }}>
            + Tambah Keluarga
          </Link>
        </div>
      )}
    </div>
  )
}