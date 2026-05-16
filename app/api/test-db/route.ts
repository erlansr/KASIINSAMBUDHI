import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const keluargaCount = await prisma.keluarga.count()
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected!',
      totalKeluarga: keluargaCount 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 })
  }
}