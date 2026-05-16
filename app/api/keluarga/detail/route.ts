// app/api/keluarga/detail/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID diperlukan' }, { status: 400 })
  }

  const keluarga = await prisma.keluarga.findUnique({
    where: { id: parseInt(id) }
  })

  return NextResponse.json({ success: true, data: keluarga })
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID diperlukan' }, { status: 400 })
  }

  const body = await request.json()
  const keluarga = await prisma.keluarga.update({
    where: { id: parseInt(id) },
    data: body
  })

  return NextResponse.json({ success: true, data: keluarga })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID diperlukan' }, { status: 400 })
  }

  await prisma.keluarga.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}