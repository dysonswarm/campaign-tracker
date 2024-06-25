import { format } from "date-fns/format";

interface DateProps {
  date: Date;
  formatStr?: string;
}
export function Date({ date, formatStr }: DateProps) {
  return format(date, formatStr ?? "yyyy-MM-dd");
}
