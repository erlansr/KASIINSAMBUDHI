// app/admin/laporan/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import Link from 'next/link'
import LaporanPDF from '@/components/pdf/LaporanPDF'

export default function LaporanPage() {
    const [bulan, setBulan] = useState('')
    const [tahun, setTahun] = useState(new Date().getFullYear().toString())
    const [status, setStatus] = useState('all')
    const [data, setData] = useState([])
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(false)

    const bulanList = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    const tahunList = [2024, 2025, 2026, 2027, 2028]

    const fetchLaporan = async () => {
        if (!bulan) return

        setLoading(true)
        try {
            const res = await fetch(`/api/laporan?bulan=${bulan}&tahun=${tahun}&status=${status}`)

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`)
            }

            const result = await res.json()

            if (result.success) {
                setData(result.data)
                setSummary(result.summary)
            } else {
                console.error('API error:', result.error)
            }
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (bulan) fetchLaporan()
    }, [bulan, tahun, status])

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID').format(angka)
    }

    return (
        <div className="main-content" style={{ maxWidth: '1200px', padding: '2rem 1.5rem 4rem' }}>
            
            {/* Header */}
            <div className="tagihan-header" style={{ marginBottom: '2rem', padding: '0 0 1.5rem 0' }}>
                <div>
                    <p className="tagihan-eyebrow">Admin Panel</p>
                    <h1 className="tagihan-title" style={{ fontSize: '1.75rem', marginBottom: 0 }}>
                        Laporan Keuangan
                    </h1>
                </div>
            </div>

            {/* Back link */}
            <div style={{ marginBottom: '1.5rem' }}>
                <Link href="/admin/dashboard" className="tagihan-back-link" style={{ padding: 0 }}>
                    ← Kembali ke Dashboard
                </Link>
            </div>

            {/* Filter */}
            <div style={{ 
                background: 'var(--color-white)', 
                border: '1px solid var(--surface-border)',
                padding: '1.5rem',
                marginBottom: '1.5rem'
            }}>
                <div className="grid md:grid-cols-4 gap-4">
                    <select
                        value={bulan}
                        onChange={(e) => setBulan(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'var(--color-white)',
                            border: '1px solid var(--surface-border)',
                            fontSize: '0.875rem',
                            outline: 'none',
                            transition: 'all var(--duration-base) var(--ease-out)'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-black)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
                    >
                        <option value="">-- Pilih Bulan --</option>
                        {bulanList.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>

                    <select
                        value={tahun}
                        onChange={(e) => setTahun(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'var(--color-white)',
                            border: '1px solid var(--surface-border)',
                            fontSize: '0.875rem',
                            outline: 'none',
                            transition: 'all var(--duration-base) var(--ease-out)'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-black)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
                    >
                        {tahunList.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'var(--color-white)',
                            border: '1px solid var(--surface-border)',
                            fontSize: '0.875rem',
                            outline: 'none',
                            transition: 'all var(--duration-base) var(--ease-out)'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-black)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
                    >
                        <option value="all">Semua Status</option>
                        <option value="lunas">Lunas</option>
                        <option value="belum_lunas">Belum Lunas</option>
                    </select>

                    <button
                        onClick={fetchLaporan}
                        disabled={!bulan || loading}
                        className="bayar-btn"
                        style={{ padding: '0.75rem 1rem' }}
                    >
                        {loading ? 'Memuat...' : 'Tampilkan'}
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="tagihan-loading">
                    <div className="tagihan-loading-spinner" />
                    <p className="tagihan-loading-text">Memuat data laporan...</p>
                </div>
            )}

            {/* Summary Cards */}
            {summary && !loading && (
                <div className="grid md:grid-cols-4 gap-4" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ 
                        background: 'var(--color-white)', 
                        border: '1px solid var(--surface-border)',
                        padding: '1rem'
                    }}>
                        <p className="tagihan-eyebrow" style={{ marginBottom: '0.25rem' }}>Total Tagihan</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-black)' }}>
                            Rp {formatRupiah(summary.totalTagihan)}
                        </p>
                    </div>
                    <div style={{ 
                        background: 'var(--color-white)', 
                        border: '1px solid var(--surface-border)',
                        padding: '1rem'
                    }}>
                        <p className="tagihan-eyebrow" style={{ marginBottom: '0.25rem' }}>Sudah Lunas</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2e7d32' }}>
                            Rp {formatRupiah(summary.totalLunas)}
                        </p>
                    </div>
                    <div style={{ 
                        background: 'var(--color-white)', 
                        border: '1px solid var(--surface-border)',
                        padding: '1rem'
                    }}>
                        <p className="tagihan-eyebrow" style={{ marginBottom: '0.25rem' }}>Belum Lunas</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c62828' }}>
                            Rp {formatRupiah(summary.totalBelumLunas)}
                        </p>
                    </div>
                    <div style={{ 
                        background: 'var(--color-white)', 
                        border: '1px solid var(--surface-border)',
                        padding: '1rem'
                    }}>
                        <p className="tagihan-eyebrow" style={{ marginBottom: '0.25rem' }}>Tingkat Ketertiban</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-black)' }}>
                            {summary.persentase.toFixed(1)}%
                        </p>
                    </div>
                </div>
            )}

            {/* Tombol Export PDF */}
            {data.length > 0 && summary && !loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <PDFDownloadLink
                        document={<LaporanPDF data={data} summary={summary} bulan={bulan} tahun={tahun} status={status} />}
                        fileName={`laporan_kas_rt_${bulan}_${tahun}.pdf`}
                        className="bayar-btn"
                        style={{ display: 'inline-block', textDecoration: 'none', padding: '0.625rem 1.25rem' }}
                    >
                        {({ loading }) => loading ? 'Menyiapkan PDF...' : '📄 Export PDF'}
                    </PDFDownloadLink>
                </div>
            )}

            {/* Tabel Data */}
            {data.length > 0 && !loading && (
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
                                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tgl Bayar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item: any, index: number) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>{index + 1}</td>
                                    <td style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-black)' }}>{item.keluarga?.namaKeluarga}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>{item.bulan}</td>
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
                                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                                        {item.paidAt ? new Date(item.paidAt).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot style={{ background: 'var(--color-gray-50)', borderTop: '1px solid var(--surface-border)' }}>
                            <tr>
                                <td colSpan={3} style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, fontSize: '0.875rem' }}>TOTAL</td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-black)' }}>
                                    Rp {formatRupiah(summary?.totalTagihan || 0)}
                                </td>
                                <td colSpan={2}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* Empty state */}
            {bulan && data.length === 0 && !loading && (
                <div className="tagihan-empty-state" style={{ marginTop: '2rem' }}>
                    <div className="tagihan-empty-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    </div>
                    <p className="tagihan-empty-title">Tidak ada data</p>
                    <p className="tagihan-empty-sub">Tidak ada data tagihan untuk periode ini</p>
                </div>
            )}
        </div>
    )
}