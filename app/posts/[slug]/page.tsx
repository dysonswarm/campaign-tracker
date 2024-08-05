import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
	const post = await prisma.post.findMany({
		select: {
			slug: true,
		},
	});
	return post.map((post) => ({ slug: post.slug }));
}

export default async function Post({ params }: { params: { slug: string } }) {
	const post = await prisma.post.findUnique({
		where: {
			slug: params.slug,
		},
	});

	if (post === null) {
		return notFound();
	}

	return (
		<main className="flex flex-col items-center gap-y-5 pt-24 text-center">
			<h1 className="text-3xl font-semibold">{post?.title}</h1>
			<p className="text-gray-500">{post?.content}</p>
		</main>
	);
}
