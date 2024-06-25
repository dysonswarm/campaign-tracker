import { SignIn } from "@/components/auth/signin-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button>Click me</Button>
      <SignIn redirectTo="/posts" />
    </div>
  );
}
