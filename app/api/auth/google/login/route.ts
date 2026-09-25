import { NextRequest, NextResponse } from "next/server";
import {
  createGoogleAuthUrl,
  generateOAuthState,
  isGoogleOAuthConfigured,
} from "@/lib/auth/googleOAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    if (!isGoogleOAuthConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "OAUTH_NOT_CONFIGURED",
            message: "Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) are not set.",
          },
        },
        { status: 503 }
      );
    }

    const state = generateOAuthState();
    const googleAuthUrl = createGoogleAuthUrl(state);

    const response = NextResponse.redirect(googleAuthUrl);

    // Save CSRF state token in httpOnly cookie with 10-minute expiry
    response.cookies.set("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error: unknown) {
    console.error("Google OAuth login error:", error);
    return NextResponse.redirect(
      new URL("/login?error=oauth_init_failed", req.url)
    );
  }
}
