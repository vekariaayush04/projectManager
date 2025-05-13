import { PrismaClient } from "../generated/prisma/index";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const db: PrismaClient = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;