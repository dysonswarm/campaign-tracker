import { PostList } from "@/components/posts/post-list";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { AuthorSelect } from "./_components/AuthorSelect";

function firstOrUndefined(value: string | string[] | undefined) {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function Posts({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const title = firstOrUndefined(searchParams.title);
  const authorId = firstOrUndefined(searchParams.authorId);
  return (
    <div>
      <form method="GET" action="/posts">
        <div className="flex flex-row gap-2">
          <Input
            placeholder="Title"
            id="title"
            name="title"
            defaultValue={title}
          />
          <AuthorSelect name="authorId" defaultValue={authorId} />
          <Button type="submit">Apply</Button>
        </div>
      </form>
      <Suspense fallback={<div>Loading...</div>}>
        <PostList title={title} authorId={authorId} />
      </Suspense>
      {/* <form className="flex flex-col gap-y-2 w-[300px]" action={createPost}>
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
      </form> */}
    </div>
  );
}
