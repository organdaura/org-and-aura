import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { googleAuthSchema } from "@/lib/validations/auth";
import { createSession } from "@/lib/auth/session";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`auth_google_${ip}`, 5, 60);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many attempts. Please wait 60 seconds before trying again.",
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.resetSeconds),
          },
        }
      );
    }

    const body = await req.json();
    const parseResult = googleAuthSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid Google authentication details provided.",
          },
        },
        { status: 400 }
      );
    }

    const { email, name } = parseResult.data;
    const normalizedEmail = email.toLowerCase();

    // Upsert User in PostgreSQL
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name || "Google User",
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

    // Sync Signup registry for admin
    await prisma.signup.upsert({
      where: { email: normalizedEmail },
      update: { name: user.name, provider: "GOOGLE", status: "ACTIVE" },
      create: { email: normalizedEmail, name: user.name, provider: "GOOGLE", status: "ACTIVE" },
    });

    // Create session
    const { rawToken, expiresAt } = await createSession(user.id);

    const response = NextResponse.json({
      success: true,
      message: "Google sign-in successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
      },
    });

    response.cookies.set("org_aura_session", rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error("Auth google API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Failed to authenticate with Google. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
