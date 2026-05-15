import dotenv from "dotenv";

dotenv.config();


// Vercel build environments may not provide DATABASE_URL at compile time.
// Prisma needs a datasource URL during `prisma generate`, so provide a safe fallback.
const DATABASE_URL_FALLBACK =
  "postgresql://prisma:prisma@127.0.0.1:5432/prisma?schema=public";

export default {
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? DATABASE_URL_FALLBACK,
  },
};

