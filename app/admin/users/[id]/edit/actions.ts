"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function editUser(userId: string, formData: FormData) {
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			role: formData.get("role") as string,
		},
	});
	revalidatePath(`/admin/users/${userId}/edit`);
}
