import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { blogPostSchema } from "@/lib/validations/blog";

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin privileges required." } },
      { status: 401 }
    );
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: posts });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin privileges required." } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parseResult = blogPostSchema.safeParse(body);

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });

      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid post data.", fields: fieldErrors } },
        { status: 400 }
      );
    }

    const { title, slug, excerpt, body: postBody, category, published, imageRef } =
      parseResult.data;

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: "DUPLICATE_SLUG", message: "Slug already exists. Choose a unique slug." } },
        { status: 409 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        body: postBody,
        category,
        published,
        imageRef: imageRef || "/assets/blog/waste-management.svg",
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("Admin create post error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to create article." } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin privileges required." } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id, published, title, slug, excerpt, body: postBody, category, imageRef } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_ID", message: "Article ID is required." } },
        { status: 400 }
      );
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Article not found." } },
        { status: 404 }
      );
    }

    if (slug && slug !== existing.slug) {
      const slugConflict = await prisma.blogPost.findUnique({ where: { slug } });
      if (slugConflict) {
        return NextResponse.json(
          { success: false, error: { code: "DUPLICATE_SLUG", message: "Slug is already taken." } },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(published !== undefined ? { published: Boolean(published) } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(excerpt !== undefined ? { excerpt } : {}),
        ...(postBody !== undefined ? { body: postBody } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(imageRef !== undefined ? { imageRef } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Admin update post error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to update article." } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin privileges required." } },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_ID", message: "Post ID required." } },
        { status: 400 }
      );
    }

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Post deleted successfully." });
  } catch (error) {
    console.error("Admin delete post error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to delete post." } },
      { status: 500 }
    );
  }
}
