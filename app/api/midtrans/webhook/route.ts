// app/api/midtrans/webhook/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('Webhook received:', body)

    // Verifikasi signature (opsional tapi disarankan)
    const signature = crypto
      .createHash('sha512')
      .update(body.order_id + body.status_code + body.gross_amount + process.env.MIDTRANS_SERVER_KEY)
      .digest('hex')

    if (signature !== body.signature_key) {
      console.log('Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Update status pembayaran jika settlement
    if (body.transaction_status === 'settlement') {
      const pembayaran = await prisma.pembayaran.updateMany({
        where: { midtransOrderId: body.order_id },
        data: {
          status: 'lunas',
          paidAt: new Date(),
          paymentMethod: 'qris',
          transactionId: body.transaction_id
        }
      })

      console.log('Payment updated:', pembayaran)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}