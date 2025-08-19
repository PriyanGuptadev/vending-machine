import { PrismaClient } from '../src/generated/prisma';
const prisma = new PrismaClient();

async function seed() {
   await prisma.chocolate.deleteMany();
   await prisma.userCash.deleteMany();
  await prisma.chocolate.createMany({
    data: [
      { name: 'Toblerone', price: 5, quantity: 10 },
      { name: 'Snickers Pack', price: 8, quantity: 10 },
      { name: 'Ferrero', price: 15, quantity: 10 }
    ],

  });

  await prisma.userCash.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, cash: 200 }
  });

  console.log('Seed data inserted');
}

seed().finally(() => prisma.$disconnect());