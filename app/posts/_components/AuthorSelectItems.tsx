"use server";

import prisma from "@/lib/db";
import { Select } from "@radix-ui/themes";

export async function AuthorSelectItems() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const users = await prisma.user.findMany({
    select: {
      name: true,
      id: true,
    },
  });
  return (
    <>
      {users.map((user) => (
        <Select.Item key={user.id} value={user.id}>
          {user.name}
        </Select.Item>
      ))}
    </>
  );
}
