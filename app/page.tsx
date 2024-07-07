import { signIn } from "@/lib/auth";

export default async function Home() {
	await signIn(undefined, { redirectTo: "/ai" });
}
