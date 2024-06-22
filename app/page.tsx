import { SignIn } from "@/components/auth/signin-button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <SignIn redirectTo="/posts" />
    </div>
  );
}
