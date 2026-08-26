import { PrismaClient } from "@generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { serverEnv } from "../env/serverEnv";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaLibSql({
  url: serverEnv.DATABASE_URL,
  ...(serverEnv.TURSO_AUTH_TOKEN ?
    { authToken: serverEnv.TURSO_AUTH_TOKEN }
  : {}),
});

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
