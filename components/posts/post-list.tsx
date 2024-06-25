"use server";

import { Date } from "@/components/date";
import prisma from "@/lib/db";
import { Table } from "@radix-ui/themes";
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
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Author</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Created Date</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {posts.map((post) => (
            <Table.Row key={post.id}>
              <Table.RowHeaderCell>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </Table.RowHeaderCell>
              <Table.Cell>{post.author.name}</Table.Cell>
              <Table.Cell>
                <Date date={post.createdAt} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
