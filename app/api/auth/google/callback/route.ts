import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/auth/session";
import {
  exchangeGoogleCodeForTokens,
  getGoogleUserProfile,
} from "@/lib/auth/googleOAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const baseUrl = new URL(req.url).origin;

  // Handle user cancellation or Google error
  if (error) {
    console.warn("Google OAuth returned error:", error);
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_denied`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=missing_code`);
  }

  // Validate CSRF state
  const storedState = req.cookies.get("google_oauth_state")?.value;
  if (!storedState || storedState !== state) {
    console.error("Google OAuth state mismatch or missing state cookie");
    return NextResponse.redirect(`${baseUrl}/login?error=invalid_state`);
  }

  try {
    // 1. Exchange code for access token
    const tokenData = await exchangeGoogleCodeForTokens(code);

    // 2. Fetch Google profile info
    const profile = await getGoogleUserProfile(tokenData.access_token);

    if (!profile.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=no_email_provided`);
    }

    const normalizedEmail = profile.email.toLowerCase();
    const displayName = profile.name || profile.given_name || "Google User";

    // 3. Upsert user in database
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: displayName,
          role: "USER",
          provider: "GOOGLE",
          passwordHash: null,
        },
      });
    } else if (user.provider !== "GOOGLE" && !user.passwordHash) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { provider: "GOOGLE" },
      });
    }

    // 4. Sync signup registry for admin dashboard visibility
    await prisma.signup.upsert({
      where: { email: normalizedEmail },
      update: { name: user.name, provider: "GOOGLE", status: "ACTIVE" },
      create: { email: normalizedEmail, name: user.name, provider: "GOOGLE", status: "ACTIVE" },
    });

    // 5. Create active session
    const { rawToken, expiresAt } = await createSession(user.id);

    // 6. Redirect to member area with session cookie
    const response = NextResponse.redirect(`${baseUrl}/account`);

    response.cookies.set("org_aura_session", rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    // Clear state cookie
    response.cookies.delete("google_oauth_state");

    return response;
  } catch (err: unknown) {
    console.error("Google OAuth callback exception:", err);
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_exchange_failed`);
  }
}
