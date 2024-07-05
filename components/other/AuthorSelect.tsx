import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Suspense } from "react";
import { AuthorSelectItems } from "./AuthorSelectItems";
interface AuthorSelectProps {
	name: string;
	defaultValue?: string;
}
export function AuthorSelect({ name, defaultValue = "none" }: AuthorSelectProps) {
	return (
		<Select defaultValue={defaultValue} name={name}>
			<SelectTrigger>
				<SelectValue placeholder="Select an author..." />
			</SelectTrigger>
			<SelectContent>
				<Suspense
					fallback={
						<SelectItem
							value={defaultValue !== "none" ? defaultValue : "loading"}
							disabled
						>
							LOADING...
						</SelectItem>
					}
				>
					<AuthorSelectItems />
				</Suspense>
			</SelectContent>
		</Select>
	);
}
