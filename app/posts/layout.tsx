import { auth } from "@/lib/auth";
import { Search } from "lucide-react";
import { SessionProvider } from "next-auth/react";
import CampaignSwitcher from "./_components/CampaignSwitcher";
import { MainNav } from "./_components/MainNav";
import { UserNav } from "./_components/UserNav";
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user) {
    // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    // filter out sensitive data before passing to client.
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }

  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <CampaignSwitcher />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      <SessionProvider basePath={"/"} session={session}>
        {children}
      </SessionProvider>
    </div>
  );
}
