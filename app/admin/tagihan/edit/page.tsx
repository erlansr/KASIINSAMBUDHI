// app/admin/tagihan/edit/page.tsx
'use client'

import { Suspense } from 'react'
import EditTagihanContent from './EditTagihanContent'

export default function EditTagihanPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <EditTagihanContent />
    </Suspense>
  )
}