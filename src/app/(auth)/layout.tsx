import type { Metadata } from "next";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col px-5 py-8 sm:px-8">
      <Logo />
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">{children}</main>
    </div>
  );
}
