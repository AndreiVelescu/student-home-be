import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export const getPrisma = () => {
  if (prisma) return prisma;

  prisma = new PrismaClient();
  return prisma;
};

export const disconnectDataLayer = () => prisma && prisma.$disconnect;
export const getTransaction = (cb:any): Promise<any> => prisma.$transaction(cb);