import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/validations/auth";
import { createSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parseResult = adminLoginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Please enter a valid email and password.",
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid administrator credentials.",
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
            message: "Invalid administrator credentials.",
          },
        },
        { status: 401 }
      );
    }

    // Set secure HTTP-only session cookie
    const { rawToken, expiresAt } = await createSession(user.id);

    const response = NextResponse.json({
      success: true,
      message: "Admin authenticated successfully.",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
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
    console.error("Admin login API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: "An authentication error occurred." },
      },
      { status: 500 }
    );
  }
}
