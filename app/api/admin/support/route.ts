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

  const requests = await prisma.supportRequest.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: requests });
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
    const { id, status, adminNotes } = await req.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_INPUT", message: "Support ticket ID is required." } },
        { status: 400 }
      );
    }

    const validStatuses = ["NEW", "IN_PROGRESS", "RESOLVED"];
    if (status !== undefined && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_INPUT", message: "Invalid status value." } },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {};
    if (status !== undefined) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes ? String(adminNotes).trim() : null;

    const updated = await prisma.supportRequest.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Support update error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to update support request." } },
      { status: 500 }
    );
  }
}
