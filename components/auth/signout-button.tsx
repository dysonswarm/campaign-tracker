import { signOut } from "@/lib/auth";

export function SignOut() {
	return (
		<form
			id="signout"
			action={async () => {
				"use server";
				await signOut();
			}}
		>
			<button form="signout" type="submit">
				Sign Out
			</button>
		</form>
	);
}
