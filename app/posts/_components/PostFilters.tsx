import { Button, Flex, TextField } from "@radix-ui/themes";
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
      <Flex direction="row" gap="2">
        <TextField.Root placeholder="Title" id="title" name="title" />
        <AuthorSelect name="authorId" />
        <Button type="submit">Apply</Button>
      </Flex>
    </form>
  );
}
