// app/tagihan/page.tsx
import { Suspense } from 'react'
import TagihanContent from './TagihanContent'

export default function TagihanPage() {
  return (
    <Suspense fallback={
      <div className="tagihan-loading">
        <div className="tagihan-loading-spinner" />
        <p className="tagihan-loading-text">Memuat…</p>
      </div>
    }>
      <TagihanContent />
    </Suspense>
  )
}