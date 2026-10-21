import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PRIVATE_PREFIXES = [
  "/home",
  "/writing",
  "/calendar",
  "/memory-vault",
  "/insights",
  "/games",
  "/reports",
  "/settings",
  "/voice"
];

const AUTH_PAGES = ["/signin", "/signup", "/forgot-password"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value, options }) => {
          request.cookies.set({ name, value, ...options });
        });
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  const isPrivate = PRIVATE_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(prefix + "/"));
  const isAuthPage = AUTH_PAGES.some(page => pathname === page || pathname.startsWith(page + "/"));

  if (!user && isPrivate) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
