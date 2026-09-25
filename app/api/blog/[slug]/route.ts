import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });

    if (!post || !post.published) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Article not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("GET /api/blog/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch article" } },
      { status: 500 }
    );
  }
}
