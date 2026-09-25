import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin privileges required." } },
      { status: 401 }
    );
  }

  try {
    const [supportCount, newSupportCount, careerCount, pendingCareerCount, signupsCount, blogCount] =
      await Promise.all([
        prisma.supportRequest.count(),
        prisma.supportRequest.count({ where: { status: "NEW" } }),
        prisma.careerApplication.count(),
        prisma.careerApplication.count({ where: { status: "PENDING" } }),
        prisma.signup.count(),
        prisma.blogPost.count(),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        totalSupport: supportCount,
        newSupport: newSupportCount,
        totalCareer: careerCount,
        pendingCareer: pendingCareerCount,
        totalSignups: signupsCount,
        totalBlogPosts: blogCount,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to load dashboard metrics." } },
      { status: 500 }
    );
  }
}
