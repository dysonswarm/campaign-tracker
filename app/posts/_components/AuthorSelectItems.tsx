"use server";

import {
  SelectItem
} from "@/components/ui/select";
import prisma from "@/lib/db";

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
        <SelectItem key={user.id} value={user.id}>
          {user.name}
        </SelectItem>
      ))}
    </>
  );
}
