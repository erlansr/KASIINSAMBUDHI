// app/admin/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (!adminData) {
      router.push('/admin/login')
    } else {
      setAdmin(JSON.parse(adminData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    router.push('/admin/login')
  }

  if (!admin) {
    return (
      <div className="tagihan-loading">
        <div className="tagihan-loading-spinner" />
        <p className="tagihan-loading-text">Memuat dashboard...</p>
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
              Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="bayar-btn"
            style={{ 
              background: 'var(--color-black)', 
              padding: '0.5rem 1.25rem',
              fontSize: '0.7rem'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Welcome Card */}
      <div style={{ 
        marginBottom: '2.5rem',
        padding: '1.5rem',
        background: 'var(--color-gray-50)',
        border: '1px solid var(--surface-border)'
      }}>
        <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>
          Selamat datang, <strong style={{ color: 'var(--color-black)' }}>{admin.name}</strong>!
        </p>
      </div>

      {/* Menu Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Keluarga Card */}
        <Link 
          href="/admin/keluarga" 
          style={{
            display: 'block',
            background: 'var(--color-white)',
            border: '1px solid var(--surface-border)',
            padding: '1.5rem',
            textDecoration: 'none',
            transition: 'all var(--duration-base) var(--ease-out)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-black)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--surface-border)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👨‍👩‍👧‍👦</div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-black)', marginBottom: '0.5rem' }}>
            Data Keluarga
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-400)', margin: 0 }}>
            Tambah, edit, atau hapus data keluarga
          </p>
        </Link>

        {/* Tagihan Card */}
        <Link 
          href="/admin/tagihan" 
          style={{
            display: 'block',
            background: 'var(--color-white)',
            border: '1px solid var(--surface-border)',
            padding: '1.5rem',
            textDecoration: 'none',
            transition: 'all var(--duration-base) var(--ease-out)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-black)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--surface-border)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-black)', marginBottom: '0.5rem' }}>
            Data Tagihan
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-400)', margin: 0 }}>
            Tambah, edit, atau hapus tagihan
          </p>
        </Link>

        {/* Laporan Card */}
        <Link 
          href="/admin/laporan" 
          style={{
            display: 'block',
            background: 'var(--color-white)',
            border: '1px solid var(--surface-border)',
            padding: '1.5rem',
            textDecoration: 'none',
            transition: 'all var(--duration-base) var(--ease-out)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-black)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--surface-border)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📊</div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-black)', marginBottom: '0.5rem' }}>
            Laporan
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-400)', margin: 0 }}>
            Lihat dan export laporan keuangan
          </p>
        </Link>
      </div>
    </div>
  )
}