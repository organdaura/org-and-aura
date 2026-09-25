import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";

  let dbError: string | null = null;
  const dbUrl = process.env.DATABASE_URL || "";
  const dbUrlHost = dbUrl ? (dbUrl.includes("@") ? dbUrl.split("@")[1].split("/")[0] : "invalid-format") : "missing";

  try {
    // Ping database
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    dbStatus = "unhealthy";
    dbError = error instanceof Error ? error.message : String(error);
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
          host: dbUrlHost,
          hasUrl: !!dbUrl,
          error: dbError,
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
