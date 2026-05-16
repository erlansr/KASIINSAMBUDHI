// app/api/admin/create/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Hapus admin lama jika ada
    await prisma.user.deleteMany({
      where: { email: 'admin@keluarga.com' }
    })

    // Buat admin baru
    const admin = await prisma.user.create({
      data: {
        name: 'Admin Kas RT',
        email: 'admin@kasrt.com',
        password: '$2a$10$2yKmGSMvL.U4v.4StaKFHu4vZmD1JX.YLtDqBzb3ZzZzZzZzZzZ',
        isAdmin: true,
      }
    })

    return NextResponse.json({ success: true, user: admin })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal membuat admin' }, { status: 500 })
  }
}