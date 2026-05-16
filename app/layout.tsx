// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Kas Keluarga — Sistem Iuran',
  description: 'Sistem Pembayaran Iuran Kas Keluarga',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Navbar */}
        <div className="nav-root">
          <div className="nav-inner">
            <a href="/" className="nav-brand">
              <div className="nav-logo-box">
                <span></span>
              </div>
              <div>
                <div className="nav-brand-text">Kas Keluarga</div>
                <div className="nav-brand-sub">Management System</div>
              </div>
            </a>
            <a href="/admin/login" className="nav-admin-btn">
              Admin
            </a>
          </div>
        </div>

        <main className="main-content">
          {children}
        </main>

        <footer className="site-footer">
          <div className="footer-brand">Kas Keluarga</div>
          <div className="footer-copy">© {new Date().getFullYear()} Sistem Informasi Kas Keluarga</div>
        </footer>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#000',
              color: '#fff',
              border: '1px solid #262626',
              borderRadius: 0,
              fontSize: '0.8125rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
            },
          }}
        />

        {/* Midtrans Snap.js - Load once globally */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}