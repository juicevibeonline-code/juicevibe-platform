import * as dotenv from "dotenv";
import { join } from "path";
dotenv.config({ path: join(__dirname, "..", ".env") });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EMAIL = "admin@juicevibe.com";
const NEW_PASSWORD = "Admin@123";

async function main() {
  console.log("🔧 Resetting admin credentials...");

  const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    update: {
      password: hashedPassword,
      emailVerified: true,
      role: "admin",
    },
    create: {
      email: EMAIL,
      name: "Admin",
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
    },
  });

  console.log(`✅ Admin user reset: ${user.email} (id: ${user.id})`);
  console.log(`   Password: ${NEW_PASSWORD}`);
  console.log(`   Role: ${user.role}`);
}

main()
  .catch((e) => {
    console.error("❌ Reset failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
