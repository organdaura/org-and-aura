import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50);

    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        ...(category ? { category } : {}),
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        publishedAt: true,
        imageRef: true,
      },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch articles" } },
      { status: 500 }
    );
  }
}
