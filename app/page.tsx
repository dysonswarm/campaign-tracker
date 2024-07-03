import { SignIn } from "@/components/auth/signin-button";

export default function Home() {
  return (
    <div>
      <SignIn redirectTo="/dashboard" />
    </div>
  );
}
