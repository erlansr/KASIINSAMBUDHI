import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { pembayaranId } = await request.json()

    await prisma.pembayaran.update({
      where: { id: pembayaranId },
      data: {
        status: 'lunas',
        paidAt: new Date()
      }
    })

    // Response lebih cepat tanpa data berlebih
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}