import { createPost } from "@/app/actions/actions";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Posts() {
  const session = await auth();
  if (!session?.user?.email) {
    console.log("No user email found");
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
    include: {
      posts: true,
    },
  });
  const postsCount = await prisma.user.count({
    where: {
      email: session?.user?.email,
    },
  });

  return (
    <main className="flex flex-col items-center gap-y-5 pt-24 text-center">
      <h1 className="text-3xl font-semibold">
        All Posts ({postsCount}) for {user?.email}
      </h1>
      <ul className="border-t border-b border-black/10 py-5 leading-8">
        {user?.posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between px-5">
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
      <form className="flex flex-col gap-y-2 w-[300px]" action={createPost}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="px-2 py-1 rounded-sm"
        />
        <textarea
          name="content"
          placeholder="Content"
          rows={5}
          className="px-2 py-1 rounded-sm"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 py-2 text-white rounded-sm"
        >
          Create Post
        </button>
      </form>
    </main>
  );
}
