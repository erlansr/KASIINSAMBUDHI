// app/api/tagihan-admin/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET semua tagihan
export async function GET() {
  try {
    const tagihan = await prisma.pembayaran.findMany({
      include: {
        keluarga: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, data: tagihan })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 })
  }
}

// POST tambah tagihan
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { keluargaId, bulan, nominal } = body

    // Cek duplikasi
    const existing = await prisma.pembayaran.findFirst({
      where: {
        keluargaId: parseInt(keluargaId),
        bulan: bulan
      }
    })

    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tagihan untuk bulan ini sudah ada' 
      }, { status: 400 })
    }

    const tagihan = await prisma.pembayaran.create({
      data: {
        keluargaId: parseInt(keluargaId),
        bulan,
        nominal: parseInt(nominal),
        status: 'belum_lunas'
      }
    })

    return NextResponse.json({ success: true, data: tagihan })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal menambah tagihan' }, { status: 500 })
  }
}