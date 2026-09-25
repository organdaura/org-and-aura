import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { careerApplicationSchema } from "@/lib/validations/career";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const RECRUITMENT_ACTIVE = false;

export async function POST(req: NextRequest) {
  if (!RECRUITMENT_ACTIVE) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RECRUITMENT_CLOSED",
          message: "Applications are currently closed as our talent cohort is full. Please check back soon.",
        },
      },
      { status: 403 }
    );
  }

  try {
    // 0. Check rate limiting (max 5 requests per 60 seconds per IP)
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`career_${ip}`, 5, 60);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many application submissions. Please wait a moment before trying again.",
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

    // 1. Honeypot check
    if (body.bot_trap && body.bot_trap.length > 0) {
      return NextResponse.json(
        { success: false, error: { code: "BOT_DETECTED", message: "Automated submission rejected." } },
        { status: 400 }
      );
    }

    // 2. Validate input schema
    const parseResult = careerApplicationSchema.safeParse(body);
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
            message: "Please correct the application fields.",
            fields: fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const {
      fullName,
      mobileNumber,
      email,
      physicalAddress,
      topSkills,
      department,
      roleType,
      resumeUrl,
      resumeFilename,
    } = parseResult.data;

    // 3. Persist to PostgreSQL
    const application = await prisma.careerApplication.create({
      data: {
        fullName,
        mobileNumber,
        email,
        physicalAddress,
        topSkills,
        department,
        roleType,
        resumeUrl: resumeUrl || null,
        resumeFilename: resumeFilename || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
      data: { id: application.id },
    });
  } catch (error) {
    console.error("Career apply API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred while saving your application.",
        },
      },
      { status: 500 }
    );
  }
}
