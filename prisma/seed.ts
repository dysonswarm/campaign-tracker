import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()
async function main() {
  const resources = [
    {
      content: "Sample resource content 1",
    },
    {
      content: "Sample resource content 2",
    },
    {
      content: "Sample resource content 3",
    },
  ];

  for (const resource of resources) {
    await prisma.resource.create({
      data: resource,
    });
  }

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
