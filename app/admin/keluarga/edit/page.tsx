// app/admin/keluarga/edit/page.tsx
import { Suspense } from 'react'
import EditKeluargaContent from './EditKeluargaContent'

export default function EditKeluargaPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <EditKeluargaContent />
    </Suspense>
  )
}