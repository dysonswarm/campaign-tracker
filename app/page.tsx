import { signIn } from "@/lib/auth";

export default async function Home() {
	try {
		await signIn(undefined, { redirectTo: "/ai" });
	} catch (ex) {
		return <p>{JSON.stringify(ex)}</p>;
	}
}
