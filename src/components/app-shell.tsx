"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Archive, BookOpen, CalendarDays, Ellipsis, FileText, Gamepad2, House, LogOut, Settings, Sparkles, X,
} from "lucide-react";
import { Logo } from "./logo";
import { ThemeSwitch } from "./theme-switch";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export const NAV = [
  { href: "/home", label: "Home", Icon: House },
  { href: "/writing", label: "Writing", Icon: BookOpen },
  { href: "/calendar", label: "Calendar", Icon: CalendarDays },
  { href: "/memory-vault", label: "Memory Vault", Icon: Archive },
  { href: "/insights", label: "Insights", Icon: Sparkles },
  { href: "/games", label: "Cognitive Games", Icon: Gamepad2 },
  { href: "/reports", label: "Reports", Icon: FileText },
  { href: "/settings", label: "Settings", Icon: Settings },
] as const;

const MOBILE_PRIMARY = NAV.slice(0, 4);
const MOBILE_MORE = NAV.slice(4);

function isActive(path: string, href: string) {
  return path === href || path.startsWith(href + "/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const inEditor = /^\/writing\/(journal|note)\//.test(path);

  useEffect(() => setMoreOpen(false), [path]);
  async function signOut() { await createClient().auth.signOut(); router.replace("/signin"); router.refresh(); }
  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line px-4 py-6 lg:flex">
        <div className="px-2"><Logo href="/home" /></div>
        <nav aria-label="Main" className="mt-10 flex-1">
          <ul className="space-y-0.5">
            {NAV.map(({ href, label, Icon }) => {
              const active = isActive(path, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-[0.92rem] transition-colors ${
                      active ? "bg-paper-2 text-ink" : "text-ink-2 hover:bg-paper-2/60 hover:text-ink"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-accent" : ""}`} aria-hidden />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="space-y-4 px-2">
          <ThemeSwitch compact />
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-ink-3 hover:text-ink">
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo href="/home" />
        <ThemeSwitch compact />
      </header>

      <main id="main" className={`min-w-0 ${inEditor ? "pb-10" : "pb-28"} lg:pb-16`}>{children}</main>

      {/* Mobile bottom nav (hidden while writing to keep the editor clear) */}
      {!inEditor && (
        <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
          <ul className="grid grid-cols-5">
            {MOBILE_PRIMARY.map(({ href, label, Icon }) => {
              const active = isActive(path, href);
              return (
                <li key={href}>
                  <Link href={href} aria-current={active ? "page" : undefined}
                    className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[0.68rem] ${active ? "text-accent" : "text-ink-3"}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                    {label === "Memory Vault" ? "Vault" : label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button type="button" onClick={() => setMoreOpen(true)} aria-haspopup="dialog" aria-expanded={moreOpen}
                className={`flex min-h-14 w-full flex-col items-center justify-center gap-1 text-[0.68rem] ${
                  MOBILE_MORE.some((n) => isActive(path, n.href)) ? "text-accent" : "text-ink-3"}`}>
                <Ellipsis className="h-5 w-5" aria-hidden /> More
              </button>
            </li>
          </ul>
        </nav>
      )}

      {moreOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="More navigation">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-ink/30" onClick={() => setMoreOpen(false)} />
          <div className="rise absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-line bg-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg text-ink">More</p>
              <button type="button" onClick={() => setMoreOpen(false)} aria-label="Close" autoFocus className="rounded-full p-2 text-ink-3 hover:bg-paper-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {MOBILE_MORE.map(({ href, label, Icon }) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-3 rounded-lg border border-line px-4 py-4 text-sm text-ink">
                    <Icon className="h-4 w-4 text-accent" aria-hidden /> {label}
                  </Link>
                </li>
              ))}
            </ul>
            <button onClick={signOut} className="mt-4 flex items-center gap-2 px-1 text-sm text-ink-3"><LogOut className="h-4 w-4" /> Sign out</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-xs uppercase tracking-[0.2em] text-ink-3">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}
