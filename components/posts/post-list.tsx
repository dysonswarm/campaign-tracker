"use server";

import { Date } from "@/components/date";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import Link from "next/link";

interface PostListProps {
	title?: string;
	authorId?: string;
}
export async function PostList({ title, authorId }: PostListProps) {
	await new Promise((resolve) => setTimeout(resolve, 2000));
	console.log("PostList", { title, authorId });
	const where = {
		...(title && { title: { contains: title } }),
		...(authorId && { authorId: authorId }),
	};

	const posts = await prisma.post.findMany({
		where,
		include: {
			author: true,
		},
		take: 10,
	});
	const postsCount = await prisma.post.count({
		where,
	});

	return (
		<>
			<h1 className="text-3xl font-semibold">All Posts ({postsCount})</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Author</TableHead>
						<TableHead>Created Date</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{posts.map((post) => (
						<TableRow key={post.id}>
							<TableCell className="font-medium">
								<Link href={`/posts/${post.slug}`}>{post.title}</Link>
							</TableCell>
							<TableCell>{post.author.name}</TableCell>
							<TableCell>
								<Date date={post.createdAt} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
