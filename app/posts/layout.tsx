import { SignOut } from "@/components/auth/signout-button";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SignOut />
      {children}
    </div>
  );
}
