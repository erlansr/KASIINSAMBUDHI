// app/api/keluarga/delete/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak ditemukan' }, { status: 400 })
    }

    const keluargaId = parseInt(id)
    if (isNaN(keluargaId)) {
      return NextResponse.json({ success: false, error: 'ID tidak valid' }, { status: 400 })
    }

    // Cek apakah keluarga punya tagihan
    const tagihan = await prisma.pembayaran.findFirst({
      where: { keluargaId: keluargaId }
    })

    if (tagihan) {
      return NextResponse.json({ 
        success: false, 
        error: 'Keluarga memiliki tagihan, hapus tagihan terlebih dahulu' 
      }, { status: 400 })
    }

    await prisma.keluarga.delete({
      where: { id: keluargaId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ success: false, error: 'Gagal menghapus keluarga' }, { status: 500 })
  }
}