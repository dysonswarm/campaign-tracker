import { ReactNode } from "react";
import { AI } from "./actions";

export default function AiLayout({ children }: Readonly<{ children: ReactNode }>) {
	return <AI>{children}</AI>;
}
