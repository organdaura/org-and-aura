import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getOptimizedDatabaseUrl(): string | undefined {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;

  // Clean channel_binding which some Prisma engines struggle with
  url = url.replace("channel_binding=require&", "").replace("&channel_binding=require", "").replace("channel_binding=require", "");

  // For pooled Neon connections, ensure pgbouncer=true and generous connect_timeout
  if (url.includes("-pooler") && !url.includes("pgbouncer=true")) {
    const sep = url.includes("?") ? "&" : "?";
    url += `${sep}pgbouncer=true`;
  }
  if (!url.includes("connect_timeout")) {
    const sep = url.includes("?") ? "&" : "?";
    url += `${sep}connect_timeout=30`;
  }

  return url;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: process.env.DATABASE_URL
      ? { db: { url: getOptimizedDatabaseUrl() } }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

