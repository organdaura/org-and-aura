import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { userSignupSchema } from "@/lib/validations/auth";
import { createSession } from "@/lib/auth/session";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`auth_signup_${ip}`, 5, 60);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many registration attempts. Please wait a moment before trying again.",
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
    const parseResult = userSignupSchema.safeParse(body);

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Please correct the registration fields.",
            fields: fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { email, name, password } = parseResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_EXISTS",
            message: "An account with this email address already exists. Please log in instead.",
          },
        },
        { status: 409 }
      );
    }

    // Hash password securely
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in PostgreSQL
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash,
        role: "USER",
        provider: "EMAIL",
      },
    });

    // Also record in Signup registry for admin tracking
    await prisma.signup.upsert({
      where: { email: email.toLowerCase() },
      update: { name, provider: "EMAIL", status: "ACTIVE" },
      create: { email: email.toLowerCase(), name, provider: "EMAIL", status: "ACTIVE" },
    });

    // Create authenticated session
    const { rawToken, expiresAt } = await createSession(user.id);

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully.",
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
    console.error("Auth signup API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Failed to create account. Please try again later.",
        },
      },
      { status: 500 }
    );
  }
}
