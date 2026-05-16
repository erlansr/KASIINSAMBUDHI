// app/admin/tagihan/generate/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GenerateTagihanPage() {
  const router = useRouter()
  const [keluargaList, setKeluargaList] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedKeluarga, setSelectedKeluarga] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(true)
  
  const [form, setForm] = useState({
    bulan: '',
    tahun: new Date().getFullYear().toString(),
    nominal: '100000'
  })

  const bulanList = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  const tahunList = [2024, 2025, 2026, 2027, 2028]

  const nominalOptions = [
    { label: 'Rp 50.000', value: '50000' },
    { label: 'Rp 100.000', value: '100000' },
    { label: 'Rp 150.000', value: '150000' },
    { label: 'Rp 200.000', value: '200000' },
    { label: 'Lainnya (input manual)', value: 'custom' }
  ]

  useEffect(() => {
    fetchKeluarga()
  }, [])

  const fetchKeluarga = async () => {
    const res = await fetch('/api/keluarga')
    const data = await res.json()
    if (data.success) {
      setKeluargaList(data.data)
      setSelectedKeluarga(data.data.map((k: any) => k.id))
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedKeluarga([])
    } else {
      setSelectedKeluarga(keluargaList.map((k: any) => k.id))
    }
    setSelectAll(!selectAll)
  }

  const handleToggleKeluarga = (id: number) => {
    if (selectedKeluarga.includes(id)) {
      setSelectedKeluarga(selectedKeluarga.filter(i => i !== id))
      setSelectAll(false)
    } else {
      setSelectedKeluarga([...selectedKeluarga, id])
      if (selectedKeluarga.length + 1 === keluargaList.length) {
        setSelectAll(true)
      }
    }
  }

  const handleNominalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'custom') {
      setForm({ ...form, nominal: '' })
    } else {
      setForm({ ...form, nominal: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.bulan) {
      alert('Pilih bulan terlebih dahulu')
      return
    }

    if (!form.nominal || parseInt(form.nominal) <= 0) {
      alert('Masukkan nominal yang valid')
      return
    }

    if (selectedKeluarga.length === 0) {
      alert('Pilih minimal 1 keluarga')
      return
    }

    setLoading(true)

    const res = await fetch('/api/tagihan-admin/generate-bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bulan: form.bulan,
        tahun: form.tahun,
        nominal: form.nominal,
        keluargaIds: selectedKeluarga
      })
    })

    const data = await res.json()
    if (data.success) {
      alert(data.message)
      router.push('/admin/tagihan')
    } else {
      alert(data.error || 'Gagal generate tagihan')
    }
    setLoading(false)
  }

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID').format(angka)
  }

  return (
    <div className="main-content" style={{ maxWidth: '1000px', padding: '2rem 1.5rem 4rem' }}>
      
      {/* Header */}
      <div className="tagihan-header" style={{ marginBottom: '2rem', padding: '0 0 1.5rem 0' }}>
        <div className="flex justify-between items-center">
          <div>
            <p className="tagihan-eyebrow">Admin Panel</p>
            <h1 className="tagihan-title" style={{ fontSize: '1.75rem', marginBottom: 0 }}>
              Generate Tagihan Massal
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
          
          {/* Pilih Bulan dan Tahun */}
          <div className="grid md:grid-cols-2 gap-4" style={{ marginBottom: '1.5rem' }}>
            <div>
              <label className="tagihan-eyebrow" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.65rem' }}>
                Bulan *
              </label>
              <select
                value={form.bulan}
                onChange={(e) => setForm({ ...form, bulan: e.target.value })}
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
                <option value="">-- Pilih Bulan --</option>
                {bulanList.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="tagihan-eyebrow" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.65rem' }}>
                Tahun *
              </label>
              <select
                value={form.tahun}
                onChange={(e) => setForm({ ...form, tahun: e.target.value })}
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
                {tahunList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pilih Nominal */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="tagihan-eyebrow" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.65rem' }}>
              Nominal Tagihan *
            </label>
            <select
              onChange={handleNominalChange}
              value={nominalOptions.some(opt => opt.value === form.nominal) ? form.nominal : 'custom'}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--color-white)',
                border: '1px solid var(--surface-border)',
                fontSize: '0.875rem',
                outline: 'none',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                transition: 'all var(--duration-base) var(--ease-out)'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-black)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
            >
              {nominalOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            
            {!nominalOptions.some(opt => opt.value === form.nominal) && (
              <input
                type="number"
                value={form.nominal}
                onChange={(e) => setForm({ ...form, nominal: e.target.value })}
                placeholder="Masukkan nominal (contoh: 75000)"
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
            )}
            
            {form.nominal && nominalOptions.some(opt => opt.value === form.nominal) && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.5rem' }}>
                Nominal: Rp {formatRupiah(parseInt(form.nominal))}
              </p>
            )}
          </div>

          {/* Pilih Keluarga */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="tagihan-eyebrow" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.65rem' }}>
              Pilih Keluarga
            </label>
            
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ fontSize: '0.875rem' }}>Pilih Semua</span>
              </label>
            </div>

            <div style={{ 
              border: '1px solid var(--surface-border)',
              padding: '1rem',
              maxHeight: '240px',
              overflowY: 'auto'
            }}>
              <div className="grid md:grid-cols-2 gap-2">
                {keluargaList.map((k: any) => (
                  <label key={k.id} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedKeluarga.includes(k.id)}
                      onChange={() => handleToggleKeluarga(k.id)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <span style={{ fontSize: '0.8125rem' }}>
                      {k.namaKeluarga}
                      <span style={{ color: 'var(--color-gray-400)', fontSize: '0.7rem', marginLeft: '0.25rem' }}>
                        ({k.alamat?.substring(0, 20) || 'no alamat'})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <p style={{ fontSize: '0.7rem', color: 'var(--color-gray-400)', marginTop: '0.5rem' }}>
              Terpilih: {selectedKeluarga.length} dari {keluargaList.length} keluarga
            </p>
          </div>

          {/* Preview */}
          <div style={{ 
            background: 'var(--color-gray-50)', 
            border: '1px solid var(--surface-border)',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h3 className="tagihan-eyebrow" style={{ marginBottom: '0.75rem', fontSize: '0.65rem' }}>Preview:</h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              Periode: <strong>{form.bulan || '?'} {form.tahun}</strong>
            </p>
            <p style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              Nominal: <strong>Rp {form.nominal ? formatRupiah(parseInt(form.nominal)) : '?'}</strong>
            </p>
            <p style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              Jumlah Keluarga: <strong>{selectedKeluarga.length}</strong>
            </p>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem', color: 'var(--color-black)' }}>
              Total Pendapatan: <strong>Rp {formatRupiah(selectedKeluarga.length * (parseInt(form.nominal) || 0))}</strong>
            </p>
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
              {loading ? 'Memproses...' : 'Generate Tagihan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}