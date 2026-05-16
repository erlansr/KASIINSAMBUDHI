// app/api/admin/login/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  // Cek login
  if (email === 'admin@kasrt.com' && password === 'password123') {
    return NextResponse.json({
      success: true,
      user: {
        id: 1,
        name: 'Admin Kas RT',
        email: email,
        isAdmin: true
      }
    })
  }

  return NextResponse.json(
    { error: 'Email atau password salah' },
    { status: 401 }
  )
}