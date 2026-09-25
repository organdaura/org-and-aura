import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST() {
  await destroySession();

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.set("org_aura_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
