import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json({
      success: true,
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        : null,
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { success: false, user: null },
      { status: 500 }
    );
  }
}
