import { cookies } from "next/headers";
import crypto from "crypto";
import prisma from "@/lib/prisma";

const SESSION_COOKIE_NAME = "org_aura_session";
const SESSION_EXPIRATION_DAYS = 7;

/**
 * Hashes raw session token for safe storage in the database
 */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a new session for a user and sets an HTTP-only secure cookie
 */
export async function createSession(userId: string) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRATION_DAYS);

  await prisma.session.create({
    data: {
      token: hashedToken,
      userId,
      expiresAt,
    },
  });

  try {
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });
  } catch (e) {
    // In Route Handlers, cookieStore might be read-only; caller will set on response
  }

  return { rawToken, expiresAt };
}

/**
 * Validates the session cookie and returns the active user if valid
 */
export async function getSessionUser() {
  try {
    const cookieStore = cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!rawToken) {
      return null;
    }

    const hashedToken = hashToken(rawToken);
    const session = await prisma.session.findUnique({
      where: { token: hashedToken },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Session retrieval error:", error);
    return null;
  }
}

/**
 * Logs out user by removing DB record and clearing the cookie
 */
export async function destroySession() {
  try {
    const cookieStore = cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (rawToken) {
      const hashedToken = hashToken(rawToken);
      await prisma.session.deleteMany({
        where: { token: hashedToken },
      });
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("Session destruction error:", error);
  }
}
