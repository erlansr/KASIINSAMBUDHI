// app/api/keluarga/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET semua keluarga
export async function GET() {
  try {
    const keluarga = await prisma.keluarga.findMany({
      orderBy: { namaKeluarga: 'asc' }
    })
    return NextResponse.json({ success: true, data: keluarga })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 })
  }
}

// POST tambah keluarga
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { namaKeluarga, alamat, noTelepon } = body

    const keluarga = await prisma.keluarga.create({
      data: {
        namaKeluarga,
        alamat,
        noTelepon
      }
    })

    return NextResponse.json({ success: true, data: keluarga })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal menambah keluarga' }, { status: 500 })
  }
}