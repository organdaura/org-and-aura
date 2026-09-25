import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function POST() {
  await destroySession();
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });
  response.cookies.delete("org_aura_session");
  return response;
}
