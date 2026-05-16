import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('password123', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@kasrt.com' },
    update: {},
    create: {
      name: 'Admin Kas RT',
      email: 'admin@kasrt.com',
      password: adminPassword,
      isAdmin: true,
    },
  })
  
  console.log('Admin user created!')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())