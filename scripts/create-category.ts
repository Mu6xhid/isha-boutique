// scripts/create-category.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.category.create({
    data: {
      name: "Clothing",
      slug: "clothing",
    },
  });

  console.log("✅ Category added!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
