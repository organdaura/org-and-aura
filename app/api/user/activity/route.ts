import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Please log in to view account activity." } },
        { status: 401 }
      );
    }

    const [supportRequests, careerApplications] = await Promise.all([
      prisma.supportRequest.findMany({
        where: { email: user.email.toLowerCase() },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.careerApplication.findMany({
        where: { email: user.email.toLowerCase() },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        supportRequests,
        careerApplications,
      },
    });
  } catch (error) {
    console.error("User activity API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to load account activity." } },
      { status: 500 }
    );
  }
}
