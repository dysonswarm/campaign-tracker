import { Select } from "@radix-ui/themes";
import { Suspense } from "react";
import { AuthorSelectItems } from "./AuthorSelectItems";
interface AuthorSelectProps {
  name: string;
  defaultValue?: string;
}
export function AuthorSelect({
  name,
  defaultValue = "none",
}: AuthorSelectProps) {
  return (
    <Select.Root defaultValue={defaultValue} name={name}>
      <Select.Trigger variant="classic" />
      <Select.Content>
        <Select.Item value="none" disabled>
          Select an author...
        </Select.Item>
        <Suspense
          fallback={
            <Select.Item
              value={defaultValue !== "none" ? defaultValue : "loading"}
              disabled
            >
              LOADING...
            </Select.Item>
          }
        >
          <AuthorSelectItems />
        </Suspense>
      </Select.Content>
    </Select.Root>
  );
}
