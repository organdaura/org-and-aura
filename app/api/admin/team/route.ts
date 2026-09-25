import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { teamMemberSchema, updateTeamMemberSchema } from "@/lib/validations/team";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin privileges required." } },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const validTypes = ["FOUNDER", "TEAM", "MENTOR"];
    const typeFilter = type && validTypes.includes(type) ? (type as "FOUNDER" | "TEAM" | "MENTOR") : undefined;

    const members = await prisma.teamMember.findMany({
      where: typeFilter ? { type: typeFilter } : undefined,
      orderBy: [{ type: "asc" }, { displayOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error("GET /api/admin/team error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch team members." } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin privileges required." } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parseResult = teamMemberSchema.safeParse(body);

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });

      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid member data.", fields: fieldErrors } },
        { status: 400 }
      );
    }

    const { name, role, type, imageRef, displayOrder, published } = parseResult.data;

    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        type,
        imageRef: imageRef || null,
        displayOrder,
        published,
      },
    });

    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/team error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to create team member." } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin privileges required." } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parseResult = updateTeamMemberSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid update data." } },
        { status: 400 }
      );
    }

    const { id, name, role, type, imageRef, displayOrder, published } = parseResult.data;

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Team member not found." } },
        { status: 404 }
      );
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(role !== undefined ? { role } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(imageRef !== undefined ? { imageRef } : {}),
        ...(displayOrder !== undefined ? { displayOrder } : {}),
        ...(published !== undefined ? { published } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /api/admin/team error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to update team member." } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin privileges required." } },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_ID", message: "Member ID is required." } },
        { status: 400 }
      );
    }

    await prisma.teamMember.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Member deleted successfully." });
  } catch (error) {
    console.error("DELETE /api/admin/team error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to delete member." } },
      { status: 500 }
    );
  }
}
