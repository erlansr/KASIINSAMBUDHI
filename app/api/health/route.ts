import { PrismaClient } from '@prisma/client'
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      status: "ok",
      db: "connected",
      time: new Date(),
    });
  } catch (error) {
    return Response.json(
      {
        status: "error",
        db: "disconnected",
      },
      {
        status: 500,
      }
    );
  }
}