import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerConfig } from "@/lib/supabase/config";

const protectedPrefixes = ["/dashboard", "/supplies", "/ideas", "/guestbook"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function loginRedirect(request: NextRequest, reason?: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  if (reason) url.searchParams.set("error", reason);
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_APP_MODE === "demo") return NextResponse.next();

  const protectedPath = isProtectedPath(request.nextUrl.pathname);
  let url: string | null = null;
  let publishableKey: string | null = null;

  try {
    ({ url, publishableKey } = getSupabaseServerConfig());
  } catch {
    return protectedPath ? loginRedirect(request) : NextResponse.next();
  }

  if (!url || !publishableKey) {
    return protectedPath ? loginRedirect(request) : NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (!protectedPath) return response;

  const userId = typeof claimsData?.claims?.sub === "string" ? claimsData.claims.sub : null;
  if (claimsError || !userId) return loginRedirect(request);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.role !== "family" && profile?.role !== "admin") {
    return loginRedirect(request, "family_only");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
