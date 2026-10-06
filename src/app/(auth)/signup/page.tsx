import { AuthForm } from "@/components/auth-form";

export const metadata = { title: "Get Started" };

export default function Page() {
  return <AuthForm mode="signup" />;
}
