import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const EXTENSION_MAP: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "text/plain": ".txt",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const RECRUITMENT_ACTIVE = false;

export async function POST(req: NextRequest) {
  if (!RECRUITMENT_ACTIVE) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RECRUITMENT_CLOSED",
          message: "Resume submissions are currently closed.",
        },
      },
      { status: 403 }
    );
  }

  try {
    // 0. Rate limiting check
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`resume_upload_${ip}`, 10, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many upload attempts. Please wait a moment.",
          },
        },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: { code: "NO_FILE", message: "No resume file provided." } },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_FILE_TYPE",
            message: `Unsupported document type (${file.type}). Please upload a PDF, DOC, or DOCX document.`,
          },
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FILE_TOO_LARGE",
            message: "Resume exceeds the 10MB maximum file size.",
          },
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = EXTENSION_MAP[file.type] || path.extname(file.name) || ".pdf";
    const sanitizedExt = ext.startsWith(".") ? ext : `.${ext}`;
    const safeFilename = `${crypto.randomUUID()}${sanitizedExt}`;

    const resumeDir = path.join(process.cwd(), "public", "uploads", "resumes");
    await mkdir(resumeDir, { recursive: true });

    const filePath = path.join(resumeDir, safeFilename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/resumes/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: file.name.replace(/[^a-zA-Z0-9._\-\s]/g, "_"),
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("POST /api/career/upload-resume error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to upload resume file." } },
      { status: 500 }
    );
  }
}
