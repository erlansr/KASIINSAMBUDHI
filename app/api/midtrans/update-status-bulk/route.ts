import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { pembayaranIds } = await request.json()

    await prisma.pembayaran.updateMany({
      where: { id: { in: pembayaranIds } },
      data: {
        status: 'lunas',
        paidAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}