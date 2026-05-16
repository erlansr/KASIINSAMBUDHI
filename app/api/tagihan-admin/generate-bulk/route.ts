// app/api/tagihan-admin/generate-bulk/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bulan, tahun, nominal, keluargaIds, semuaKeluarga } = body

    const bulanTahun = `${bulan} ${tahun}`
    const nominalInt = parseInt(nominal)

    // Ambil keluarga yang akan digenerate
    let keluargaList
    if (semuaKeluarga || !keluargaIds || keluargaIds.length === 0) {
      keluargaList = await prisma.keluarga.findMany()
    } else {
      keluargaList = await prisma.keluarga.findMany({
        where: { id: { in: keluargaIds.map((id: string) => parseInt(id)) } }
      })
    }

    let created = 0
    let skipped = 0

    for (const keluarga of keluargaList) {
      // Cek apakah sudah ada tagihan untuk bulan ini
      const existing = await prisma.pembayaran.findFirst({
        where: {
          keluargaId: keluarga.id,
          bulan: bulanTahun
        }
      })

      if (!existing) {
        await prisma.pembayaran.create({
          data: {
            keluargaId: keluarga.id,
            bulan: bulanTahun,
            nominal: nominalInt,
            status: 'belum_lunas'
          }
        })
        created++
      } else {
        skipped++
      }
    }

    return NextResponse.json({
      success: true,
      created,
      skipped,
      message: `✅ Berhasil generate ${created} tagihan untuk periode ${bulanTahun}${skipped > 0 ? ` (${skipped} sudah ada)` : ''}`
    })
  } catch (error) {
    console.error('Generate bulk error:', error)
    return NextResponse.json({ success: false, error: 'Gagal generate tagihan' }, { status: 500 })
  }
}