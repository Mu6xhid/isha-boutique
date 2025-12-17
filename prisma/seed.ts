import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean products & categories only (safe)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create category
  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      slug: 'clothing',
    },
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: 'Classic White T-Shirt',
        slug: 'classic-white-tshirt',
        description: '100% cotton crew-neck tee.',
        price: 79900,
        images: {
          set: ['https://via.placeholder.com/600x800?text=Tee'],
        } as any,
        sizes: ['S', 'M', 'L'],
        colors: ['white'],
        stock: 50,
        categoryId: clothing.id,
      },
      {
        name: 'Slim-Fit Denim Jeans',
        slug: 'slimfit-denim-jeans',
        description: 'Mid-wash stretch denim.',
        price: 219900,
        images: {
          set: ['https://via.placeholder.com/600x800?text=Jeans'],
        } as any,
        sizes: ['30', '32', '34'],
        colors: ['indigo'],
        stock: 35,
        categoryId: clothing.id,
      },
    ],
  });

  // Create / update admin
  await prisma.user.upsert({
    where: { email: 'admin@shop.local' },
    update: {
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin',
      role: 'ADMIN',
    },
    create: {
      email: 'admin@shop.local',
      name: 'Admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
