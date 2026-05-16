// app/api/tagihan/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keluargaId = searchParams.get('keluargaId')

    if (!keluargaId) {
      return NextResponse.json({ error: 'keluargaId required' }, { status: 400 })
    }

    const id = parseInt(keluargaId)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid keluargaId' }, { status: 400 })
    }

    const keluarga = await prisma.keluarga.findUnique({
      where: { id: id }
    })

    if (!keluarga) {
      return NextResponse.json({ error: 'Keluarga tidak ditemukan' }, { status: 404 })
    }

    const tagihan = await prisma.pembayaran.findMany({
      where: { keluargaId: id },
      orderBy: { bulan: 'desc' }
    })

    return NextResponse.json({ 
      success: true, 
      keluarga, 
      tagihan 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}