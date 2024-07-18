import { signIn } from "@/lib/auth";

export default async function Home() {
	try {
		await signIn(undefined, { redirectTo: "/ai" });
	} catch (ex) {
		if (!(ex as { digest: string }).digest.startsWith("NEXT_REDIRECT")) return <p>{JSON.stringify(ex)}</p>;
		throw ex;
	}
}
