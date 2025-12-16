const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: bcrypt.hashSync("Admin@123", 10),
      role: "ADMIN",
    },
  });

  console.log("Admin created:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
