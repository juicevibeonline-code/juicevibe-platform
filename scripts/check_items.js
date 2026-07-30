require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const items = await prisma.menuItem.findMany({ select: { name: true, slug: true, thumbnail: true } });
  console.log('Total items in DB:', items.length);
  items.forEach(i => console.log(i.name.padEnd(35) + ' -> ' + i.thumbnail));
  await prisma.$disconnect();
}

run();
