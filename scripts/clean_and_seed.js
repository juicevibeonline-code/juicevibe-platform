require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning orphan DB records...');
  // Delete all existing menu items so seed recreates them cleanly with correct category relations and thumbnails
  await prisma.addOn.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.menuItem.deleteMany({});
  console.log('✅ Cleaned menu items from database.');

  console.log('🌱 Re-running seed.ts...');
  execSync('npx ts-node prisma/seed.ts', { stdio: 'inherit' });

  // Clear .next caches
  const webCache = path.join(__dirname, '../apps/web/.next/cache');
  const adminCache = path.join(__dirname, '../apps/admin/.next/cache');

  if (fs.existsSync(webCache)) {
    fs.rmSync(webCache, { recursive: true, force: true });
    console.log('🗑️ Cleared apps/web/.next/cache');
  }
  if (fs.existsSync(adminCache)) {
    fs.rmSync(adminCache, { recursive: true, force: true });
    console.log('🗑️ Cleared apps/admin/.next/cache');
  }

  console.log('✨ All done!');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
