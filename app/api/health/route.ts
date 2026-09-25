import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";

  try {
    // Ping database
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = "unhealthy";
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      status: dbStatus === "healthy" ? "pass" : "fail",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus,
          responseTimeMs: responseTime,
        },
      },
    },
    {
      status: dbStatus === "healthy" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
