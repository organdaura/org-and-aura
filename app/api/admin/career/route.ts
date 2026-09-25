import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin authorization required." } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const applications = await prisma.careerApplication.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: applications });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin authorization required." } },
      { status: 401 }
    );
  }

  try {
    const { id, status } = await req.json();
    if (!id || !["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_INPUT", message: "Invalid id or status value." } },
        { status: 400 }
      );
    }

    const updated = await prisma.careerApplication.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Career update error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to update application." } },
      { status: 500 }
    );
  }
}
