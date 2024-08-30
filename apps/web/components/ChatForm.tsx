"use client";
import { Button } from "@campaign-tracker/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@campaign-tracker/ui/components/form";
import { Textarea } from "@campaign-tracker/ui/components/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const WidgetSchema = z.object({
  type: z.string({
    required_error: "Widget type is required",
  }),
});

export type Widget = z.infer<typeof WidgetSchema>;

interface ChatFormProps {
  onSubmit: (values: z.infer<typeof WidgetSchema>) => void;
}

export function ChatForm({ onSubmit }: ChatFormProps) {
  const form = useForm<Widget>({
    resolver: zodResolver(WidgetSchema),
    defaultValues: {
      type: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Widget Type</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the widget you want to add..."
                  className="resize-none border rounded-md p-2"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Widget</Button>
      </form>
    </Form>
  );
}
