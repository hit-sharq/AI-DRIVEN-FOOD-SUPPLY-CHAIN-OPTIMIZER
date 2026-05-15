import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  // During Vercel builds, DATABASE_URL can be missing.
  // Creating a pg Pool with an undefined connection string will throw.
  if (!databaseUrl) {
    // For build-time environments we can’t create the pg adapter (no connection string).
    // Prisma schema uses the "adapter" integration, so provide an "accelerateUrl" placeholder
    // to satisfy PrismaClient constructor validation.
    // NOTE: This client must only be used for non-DB build steps.
    return new PrismaClient({
      accelerateUrl: "http://localhost:0",
      log: ["error", "warn"],
    });
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter, log: ["query"] });

}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

