// app/api/tagihan-admin/mark-paid/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak ditemukan' }, { status: 400 })
    }

    const tagihan = await prisma.pembayaran.update({
      where: { id: parseInt(id) },
      data: {
        status: 'lunas',
        paidAt: new Date(),
        paymentMethod: 'manual'
      }
    })

    return NextResponse.json({ success: true, data: tagihan })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal update status' }, { status: 500 })
  }
}