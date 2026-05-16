import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import midtransClient from 'midtrans-client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { pembayaranIds } = await request.json()

    // Ambil semua tagihan yang dipilih
    const tagihanList = await prisma.pembayaran.findMany({
      where: { id: { in: pembayaranIds } },
      include: { keluarga: true }
    })

    if (tagihanList.length === 0) {
      return NextResponse.json({ error: 'Tagihan tidak ditemukan' }, { status: 404 })
    }

    const keluarga = tagihanList[0].keluarga
    const totalNominal = tagihanList.reduce((sum, t) => sum + t.nominal, 0)
    const orderId = `KAS-BULK-${Date.now()}`

    // Buat item_details untuk setiap tagihan
    const itemDetails = tagihanList.map(tagihan => ({
      id: tagihan.id.toString(),
      price: tagihan.nominal,
      quantity: 1,
      name: `Iuran Kas RT - ${tagihan.bulan}`
    }))

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    })

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalNominal
      },
      customer_details: {
        first_name: keluarga.namaKeluarga,
        phone: keluarga.noTelepon || '08123456789'
      },
      item_details: itemDetails
    }

    const transaction = await snap.createTransaction(parameter)

    // Update semua tagihan dengan order_id yang sama
    await prisma.pembayaran.updateMany({
      where: { id: { in: pembayaranIds } },
      data: { midtransOrderId: orderId }
    })

    return NextResponse.json({
      success: true,
      token: transaction.token
    })
  } catch (error) {
    console.error('Midtrans error:', error)
    return NextResponse.json({ error: 'Gagal membuat transaksi' }, { status: 500 })
  }
}