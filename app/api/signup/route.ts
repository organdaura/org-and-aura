import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signupSchema } from "@/lib/validations/signup";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Check rate limiting (max 5 requests per 60 seconds per IP)
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`signup_${ip}`, 5, 60);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many signup attempts. Please wait a moment before trying again.",
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

    const parseResult = signupSchema.safeParse(body);
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
            message: "Invalid signup details.",
            fields: fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { email, name, provider } = parseResult.data;

    // Upsert signup record
    const signup = await prisma.signup.upsert({
      where: { email },
      update: {
        name: name || undefined,
        provider,
        status: "ACTIVE",
      },
      create: {
        email,
        name: name || null,
        provider,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account registered successfully.",
      data: { id: signup.id, email: signup.email },
    });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to create account. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
