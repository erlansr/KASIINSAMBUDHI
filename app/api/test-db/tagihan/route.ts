// app/api/tagihan/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keluargaId = searchParams.get('keluargaId')

  if (!keluargaId) {
    return NextResponse.json({ error: 'keluargaId required' }, { status: 400 })
  }

  const keluarga = await prisma.keluarga.findUnique({
    where: { id: parseInt(keluargaId) }
  })

  if (!keluarga) {
    return NextResponse.json({ error: 'Keluarga not found' }, { status: 404 })
  }

  const tagihan = await prisma.pembayaran.findMany({
    where: { keluargaId: parseInt(keluargaId) },
    orderBy: { bulan: 'desc' }
  })

  return NextResponse.json({ keluarga, tagihan })
}