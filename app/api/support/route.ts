import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supportRequestSchema } from "@/lib/validations/support";
import { verifyCaptcha } from "@/lib/captcha";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 0. Check rate limiting (max 5 requests per 60 seconds per IP)
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`support_${ip}`, 5, 60);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many submission attempts. Please wait a moment before trying again.",
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

    // 1. Check honeypot field
    if (body.website_honeypot && body.website_honeypot.length > 0) {
      return NextResponse.json(
        { success: false, error: { code: "BOT_DETECTED", message: "Automated submission rejected." } },
        { status: 400 }
      );
    }

    // 2. Validate input schema
    const parseResult = supportRequestSchema.safeParse(body);
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
            message: "Please check the submitted fields.",
            fields: fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, captchaAnswer, captchaToken } =
      parseResult.data;

    // 3. Verify bot defense CAPTCHA
    const isCaptchaValid = verifyCaptcha(captchaAnswer, captchaToken);
    if (!isCaptchaValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CAPTCHA",
            message: "Anti-bot verification failed. Please try again with the new question.",
            fields: { captchaAnswer: "Incorrect answer or expired session" },
          },
        },
        { status: 400 }
      );
    }

    // 4. Persist to PostgreSQL
    const record = await prisma.supportRequest.create({
      data: {
        name,
        email,
        subject,
        message,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Support inquiry logged successfully.",
      data: { id: record.id },
    });
  } catch (error) {
    console.error("Support API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred while saving your request. Please try again later.",
        },
      },
      { status: 500 }
    );
  }
}
