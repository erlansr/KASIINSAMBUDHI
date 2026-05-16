// app/api/admin/test-password/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@kasrt.com' }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' })
  }

  // Test password "password123"
  const isValid = await bcrypt.compare('password123', user.password)

  return NextResponse.json({
    email: user.email,
    passwordHash: user.password,
    isValid: isValid,
    message: isValid ? 'Password benar!' : 'Password salah!'
  })
}