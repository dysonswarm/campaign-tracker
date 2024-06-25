import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthorSelect } from "./AuthorSelect";

interface PostFiltersProps {
  filterUpdate: (title: string, authorId: string) => void;
}
export function PostFilters({ filterUpdate }: PostFiltersProps) {
  return (
    <form
      action={(formData) =>
        filterUpdate(
          formData.get("title") as string,
          formData.get("author") as string
        )
      }
    >
      <div className="flex flex-row gap-2">
        <Input placeholder="Title" id="title" name="title" />
        <AuthorSelect name="authorId" />
        <Button type="submit">Apply</Button>
      </div>
    </form>
  );
}
