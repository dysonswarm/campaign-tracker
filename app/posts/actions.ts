"use server";

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
	try {
		await prisma.post.create({
			data: {
				author: {
					connect: {
						email: "trsch2005@gmail.com",
					},
				},
				title: formData.get("title") as string,
				content: formData.get("content") as string,
				slug: formData
					.get("title")
					?.toString()
					.toLowerCase()
					.replace(/\s/g, "-") as string,
			},
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				console.error("Post already exists");
			} else {
				throw error;
			}
		} else {
			throw error;
		}
	}
	revalidatePath("/posts");
}

export async function editPost(formData: FormData, id: string) {
	await prisma.post.update({
		where: {
			id,
		},
		data: {
			title: formData.get("title") as string,
			content: formData.get("content") as string,
			slug: formData
				.get("title")
				?.toString()
				.toLowerCase()
				.replace(/\s/g, "-") as string,
		},
	});
}

export async function deletePost(id: string) {
	await prisma.post.delete({
		where: {
			id,
		},
	});
}
