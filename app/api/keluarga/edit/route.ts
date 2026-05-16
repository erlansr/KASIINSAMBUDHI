// app/api/keluarga/edit/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET detail keluarga
export async function GET(request: Request) {
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

    const keluarga = await prisma.keluarga.findUnique({
      where: { id: keluargaId }
    })

    if (!keluarga) {
      return NextResponse.json({ success: false, error: 'Data tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: keluarga })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 })
  }
}

// PUT update keluarga
export async function PUT(request: Request) {
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

    const body = await request.json()
    const { namaKeluarga, alamat, noTelepon } = body

    const keluarga = await prisma.keluarga.update({
      where: { id: keluargaId },
      data: {
        namaKeluarga,
        alamat: alamat || null,
        noTelepon: noTelepon || null
      }
    })

    return NextResponse.json({ success: true, data: keluarga })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ success: false, error: 'Gagal mengupdate keluarga' }, { status: 500 })
  }
}