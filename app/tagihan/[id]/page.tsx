// app/tagihan/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: {
    id: string
  }
}

export default function TagihanDetailPage({ params }: PageProps) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  return (
    <div>

      {/* ── Back link ──────────────────────────────────────── */}
      <Link href="/" className="tagihan-back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        <span>Kembali</span>
      </Link>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="tagihan-header">
        <p className="tagihan-eyebrow">Detail Tagihan</p>
        <h1 className="tagihan-title">Keluarga #{id}</h1>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="tagihan-detail-card">
        <div className="tagihan-detail-row">
          <span className="tagihan-detail-label">ID Keluarga</span>
          <span className="tagihan-detail-value">{params.id}</span>
        </div>
        <p style={{
          fontSize: '0.875rem',
          color: '#737373',
          marginTop: '1.5rem',
          lineHeight: 1.6,
        }}>
          Halaman ini menampilkan detail tagihan untuk keluarga dengan ID {params.id}.
          Gunakan halaman utama tagihan untuk melihat dan membayar iuran.
        </p>
      </div>

    </div>
  )
}