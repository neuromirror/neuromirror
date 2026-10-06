import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Sign In" };

export default function Page() {
  return <AuthForm mode="signin" />;
}
