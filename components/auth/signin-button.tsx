import { signIn } from "@/lib/auth";

interface SignInProps {
	redirectTo?: string;
}

export function SignIn({ redirectTo }: SignInProps) {
	return (
		<form
			action={async () => {
				"use server";
				await signIn(undefined, { redirectTo });
			}}
		>
			<button type="submit">Sign in</button>
		</form>
	);
}
