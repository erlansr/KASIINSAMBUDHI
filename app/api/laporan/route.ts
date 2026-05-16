// app/api/laporan/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bulan = searchParams.get('bulan') || ''
    const tahun = searchParams.get('tahun') || ''
    const status = searchParams.get('status') || 'all'

    console.log('Fetching laporan:', { bulan, tahun, status })

    let whereClause: any = {}
    
    if (bulan && tahun) {
      whereClause.bulan = `${bulan} ${tahun}`
    }
    
    if (status !== 'all') {
      whereClause.status = status
    }

    const pembayaran = await prisma.pembayaran.findMany({
      where: whereClause,
      include: {
        keluarga: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const totalTagihan = pembayaran.reduce((sum, p) => sum + p.nominal, 0)
    const totalLunas = pembayaran
      .filter(p => p.status === 'lunas')
      .reduce((sum, p) => sum + p.nominal, 0)
    const totalBelumLunas = totalTagihan - totalLunas

    return NextResponse.json({
      success: true,
      data: pembayaran,
      summary: {
        totalTagihan,
        totalLunas,
        totalBelumLunas,
        totalKeluarga: pembayaran.length,
        totalLunasCount: pembayaran.filter(p => p.status === 'lunas').length,
        totalBelumLunasCount: pembayaran.filter(p => p.status === 'belum_lunas').length,
        persentase: totalTagihan > 0 ? (totalLunas / totalTagihan) * 100 : 0
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Gagal mengambil data' 
    }, { status: 500 })
  }
}