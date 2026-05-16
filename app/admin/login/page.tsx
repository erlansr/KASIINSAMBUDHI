// app/admin/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('admin', JSON.stringify(data.user))
        window.location.href = '/admin/dashboard'
      } else {
        setError(data.error || 'Login gagal')
      }
    } catch (err) {
      setError('Gagal koneksi ke server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '360px',
        padding: '0 20px'
      }}>
        
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#000',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '24px' }}>hi</span>
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#111'
          }}>
            Masuk
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#888',
            margin: 0
          }}>
            Dashboard Admin Kas Keluarga
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: '#fee',
            borderLeft: '3px solid #e53e3e',
            borderRadius: '4px'
          }}>
            <p style={{ fontSize: '13px', color: '#e53e3e', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '12px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '20px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link 
            href="/" 
            style={{
              fontSize: '12px',
              color: '#999',
              textDecoration: 'none'
            }}
          >
            ← Kembali ke Beranda
          </Link>
        </div>

        {/* Demo Info */}
        <div style={{
          marginTop: '32px',
          paddingTop: '20px',
          textAlign: 'center',
          borderTop: '1px solid #eee'
        }}>
          <p style={{
            fontSize: '10px',
            color: '#bbb',
            margin: 0
          }}>
            Demo: admin@kasrt.com / password123
          </p>
        </div>
      </div>
    </div>
  )
}