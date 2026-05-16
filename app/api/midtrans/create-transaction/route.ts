// app/api/midtrans/create-transaction/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

// @ts-ignore - midtrans-client gak punya type
import midtransClient from 'midtrans-client'

const prisma = new PrismaClient()
// ... sisanya sama

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pembayaranId } = body

    // Cari data pembayaran
    const pembayaran = await prisma.pembayaran.findUnique({
      where: { id: parseInt(pembayaranId) },
      include: { keluarga: true }
    })

    if (!pembayaran) {
      return NextResponse.json({ error: 'Pembayaran tidak ditemukan' }, { status: 404 })
    }

    if (pembayaran.status === 'lunas') {
      return NextResponse.json({ error: 'Tagihan sudah lunas' }, { status: 400 })
    }

    // Konfigurasi Midtrans
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    })

    const orderId = `KAS-${pembayaran.id}-${Date.now()}`

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: pembayaran.nominal
      },
      customer_details: {
        first_name: pembayaran.keluarga.namaKeluarga,
        phone: pembayaran.keluarga.noTelepon || '08123456789'
      },
      item_details: [
        {
          id: pembayaran.id.toString(),
          price: pembayaran.nominal,
          quantity: 1,
          name: `Iuran Kas RT - ${pembayaran.bulan}`
        }
      ]
    }

    const transaction = await snap.createTransaction(parameter)

    // Simpan order_id ke database
    await prisma.pembayaran.update({
      where: { id: pembayaran.id },
      data: { midtransOrderId: orderId }
    })

    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url
    })
  } catch (error) {
    console.error('Midtrans error:', error)
    return NextResponse.json({ error: 'Gagal membuat transaksi' }, { status: 500 })
  }
}