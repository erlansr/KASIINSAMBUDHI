// app/page.tsx
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

async function getKeluarga() {
  try {
    const keluarga = await prisma.keluarga.findMany({
      orderBy: { namaKeluarga: 'asc' }
    })
    return keluarga
  } catch (error) {
    console.error(error)
    return []
  }
}

export default async function HomePage() {
  const keluargaList = await getKeluarga()

  return (
    <div style={{ minHeight: '100%' }}>

      {/* ── Hero ────────────────────────────────────────────── */}
      <div style={{
        paddingTop: '3.5rem',
        paddingBottom: '3rem',
        borderBottom: '1px solid #e5e5e5',
      }}>
        <p style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#a3a3a3',
          marginBottom: '1rem',
        }}>
          Kas Keluarga · Sistem Iuran
        </p>

        <h1 style={{
          fontWeight: 900,
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: '#000',
          marginBottom: '1rem',
        }}>
          Pilih Keluarga
        </h1>

        <p style={{
          fontSize: '1rem',
          fontWeight: 400,
          color: '#525252',
          maxWidth: '30rem',
          lineHeight: 1.6,
        }}>
          Ketuk nama keluarga Anda untuk melihat tagihan iuran kas Keluarga.
        </p>
      </div>

      {/* ── Jumlah keluarga ──────────────────────────────────── */}
      {keluargaList.length > 0 && (
        <div style={{
          padding: '0.875rem 0',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.75rem',
            height: '1.75rem',
            background: '#000',
            color: '#fff',
            fontSize: '0.6875rem',
            fontWeight: 800,
            borderRadius: '50%',
            flexShrink: 0,
          }}>
            {keluargaList.length}
          </span>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#525252',
          }}>
            keluarga terdaftar
          </span>
        </div>
      )}

      {/* ── List Kartu ───────────────────────────────────────── */}
      <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {keluargaList.length === 0 ? (

          <div style={{
            textAlign: 'center',
            padding: '5rem 1rem',
            background: '#fafafa',
            border: '2px dashed #e5e5e5',
            marginTop: '1rem',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
            <p style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#404040',
              marginBottom: '0.375rem',
            }}>
              Belum ada data keluarga
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#a3a3a3',
            }}>
              Silakan hubungi admin Keluarga untuk mendaftarkan keluarga Anda.
            </p>
          </div>

        ) : (

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
          }}>
            {keluargaList.map((keluarga: any, index: number) => (
              <KeluargaCard
                key={keluarga.id}
                keluarga={keluarga}
                index={index}
              />
            ))}
          </div>

        )}
      </div>

    </div>
  )
}

/* ── Kartu Keluarga ───────────────────────────────────────────── */
function KeluargaCard({ keluarga, index }: { keluarga: any; index: number }) {
  return (
    <Link
      href={`/tagihan?id=${keluarga.id}`}
      className="keluarga-card"
      aria-label={`Buka tagihan keluarga ${keluarga.namaKeluarga}`}
    >
      {/* Kiri: info keluarga */}
      <div className="card-body">

        {/* Nomor urut */}
        <span className="card-number">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Nama */}
        <div className="card-name">
          {keluarga.namaKeluarga}
        </div>

        {/* Alamat & telepon */}
        <div className="card-details">
          {keluarga.alamat && (
            <div className="card-detail-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <span>{keluarga.alamat}</span>
            </div>
          )}
          {keluarga.noTelepon && (
            <div className="card-detail-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.57 3.47 2 2 0 0 1 3.54 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.88-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>{keluarga.noTelepon}</span>
            </div>
          )}
        </div>
      </div>

      {/* Kanan: tombol buka */}
      <div className="card-action">
        <span className="card-action-btn">
          Buka
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </span>
      </div>
    </Link>
  )
}