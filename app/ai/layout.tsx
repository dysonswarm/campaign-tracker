import { ReactNode } from "react";
import { AI } from "./actions";

export default function AiLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<AI>
			<div className="flex min-h-screen w-full flex-col">
				<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
			</div>
		</AI>
	);
}
