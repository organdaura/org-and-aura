import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { userLoginSchema } from "@/lib/validations/auth";
import { createSession } from "@/lib/auth/session";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`auth_login_${ip}`, 5, 60);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many login attempts. Please wait 60 seconds before trying again.",
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
    const parseResult = userLoginSchema.safeParse(body);

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
            message: "Please provide both email and password.",
            fields: fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    // Look up user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      // Avoid revealing whether account exists
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password.",
          },
        },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password.",
          },
        },
        { status: 401 }
      );
    }

    // Create session
    const { rawToken, expiresAt } = await createSession(user.id);

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully.",
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
    console.error("Auth login API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "An authentication error occurred. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
