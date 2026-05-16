// app/admin/tagihan/edit/page.tsx
'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

// --- Pindahkan semua logic dan JSX ke komponen baru ---
function EditTagihanContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [keluargaList, setKeluargaList] = useState([])
  const [form, setForm] = useState({
    keluargaId: '',
    bulan: '',
    nominal: '',
    status: ''
  })

  // Fetch daftar keluarga untuk dropdown
  useEffect(() => {
    fetch('/api/keluarga')
      .then(res => res.json())
      .then(data => {
        if (data.success) setKeluargaList(data.data)
      })
  }, [])

  useEffect(() => {
    if (!id) {
      router.push('/admin/tagihan')
      return
    }

    const fetchData = async () => {
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
        } else {
          alert('Data tidak ditemukan')
          router.push('/admin/tagihan')
        }
      } catch (error) {
        console.error('Fetch error:', error)
        alert('Gagal mengambil data')
      } finally {
        setFetchLoading(false)
      }
    }

    fetchData()
  }, [id, router])

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
        alert('Data berhasil diupdate')
        router.push('/admin/tagihan')
      } else {
        alert(data.error || 'Gagal mengupdate')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Gagal mengupdate tagihan')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">✏️ Edit Tagihan</h1>
        <Link href="/admin/tagihan" className="text-gray-600 hover:text-gray-800">
          ← Kembali
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Pilih Keluarga</label>
            <select
              value={form.keluargaId}
              onChange={(e) => setForm({ ...form, keluargaId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">-- Pilih Keluarga --</option>
              {keluargaList.map((k: any) => (
                <option key={k.id} value={k.id}>{k.namaKeluarga}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Bulan</label>
            <input
              type="text"
              value={form.bulan}
              onChange={(e) => setForm({ ...form, bulan: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Nominal (Rp)</label>
            <input
              type="number"
              value={form.nominal}
              onChange={(e) => setForm({ ...form, nominal: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="belum_lunas">Belum Lunas</option>
              <option value="lunas">Lunas</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/admin/tagihan" className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg">Batal</Link>
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50">
              {loading ? 'Menyimpan...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- Komponen utama yang di-export, membungkus dengan Suspense ---
export default function EditTagihanPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <EditTagihanContent />
    </Suspense>
  )
}