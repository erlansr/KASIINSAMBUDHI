// app/admin/tagihan/generate/page.tsx
import { Suspense } from 'react'
import GenerateTagihanContent from './GenerateTagihanContent'

export default function GenerateTagihanPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <GenerateTagihanContent />
    </Suspense>
  )
}