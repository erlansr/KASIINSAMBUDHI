// app/api/admin/login/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('Login attempt:', email)

    // Cari user di database
    const user = await prisma.user.findUnique({
      where: { email }
    })

    console.log('User found:', user ? 'Yes' : 'No')

    if (!user) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    // Cek password
    const isValid = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isValid)

    if (!isValid) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    // Cek admin
    if (!user.isAdmin) {
      console.log('User is not admin')
      return NextResponse.json({ error: 'Anda bukan admin' }, { status: 403 })
    }

    console.log('Login success')

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}