import { prisma } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession, Session, User } from "next-auth";
import type { Provider } from "next-auth/providers";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

declare module "next-auth" {
	interface Session {
		user: {
			role: string;
		} & DefaultSession["user"];
	}
	interface User {
		role: string;
	}
}
declare module "@auth/core/adapters" {
	interface AdapterUser {
		role: string;
	}
}

const adapter = PrismaAdapter(prisma);

const providers: Provider[] = [
	Google,
	Github,
	Resend({
		apiKey: process.env.AUTH_RESEND_KEY,
		from: "Schluechtermann <no-reply@schluechtermann.com>",
	}),
];

export const providerMap = providers.map((provider) => {
	if (typeof provider === "function") {
		const providerData = provider();
		return { id: providerData.id, name: providerData.name };
	} else {
		return { id: provider.id, name: provider.name };
	}
});

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter,
	providers: [
		Google,
		Github,
		Resend({
			apiKey: process.env.AUTH_RESEND_KEY,
			from: "Schluechtermann <no-reply@schluechtermann.com>",
		}),
	],
	callbacks: {
		session({ session, user }: { session: Session; user: User }) {
			session.user.role = user.role;
			return session;
		},
	},
	// pages: {
	//   signIn: "/auth/signin",
	// },
});
