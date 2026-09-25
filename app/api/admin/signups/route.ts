import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin authorization required." } },
      { status: 401 }
    );
  }

  const signups = await prisma.signup.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: signups });
}
