// app/api/tagihan-admin/edit/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET detail tagihan
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak ditemukan' }, { status: 400 })
    }

    const tagihan = await prisma.pembayaran.findUnique({
      where: { id: parseInt(id) },
      include: { keluarga: true }
    })

    if (!tagihan) {
      return NextResponse.json({ success: false, error: 'Data tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: tagihan })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 })
  }
}

// PUT update tagihan
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak ditemukan' }, { status: 400 })
    }

    const body = await request.json()
    const { keluargaId, bulan, nominal, status } = body

    const tagihan = await prisma.pembayaran.update({
      where: { id: parseInt(id) },
      data: {
        keluargaId: parseInt(keluargaId),
        bulan,
        nominal: parseInt(nominal),
        status
      }
    })

    return NextResponse.json({ success: true, data: tagihan })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengupdate tagihan' }, { status: 500 })
  }
}

// DELETE hapus tagihan
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak ditemukan' }, { status: 400 })
    }

    await prisma.pembayaran.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal menghapus tagihan' }, { status: 500 })
  }
}