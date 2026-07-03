import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/projects";
    return NextResponse.redirect(url);
  }

  // Legacy: /?to=guest → /w/my-wedding/guest
  if (pathname === "/" && request.nextUrl.searchParams.has("to")) {
    const guestSlug = request.nextUrl.searchParams.get("to");
    if (guestSlug) {
      const url = request.nextUrl.clone();
      url.pathname = `/w/my-wedding/${guestSlug}`;
      url.searchParams.delete("to");
      return NextResponse.redirect(url, 301);
    }
  }

  // Legacy: /w/slug?to=guest → /w/slug/guest
  const weddingMatch = pathname.match(/^\/w\/([^/]+)$/);
  if (weddingMatch && request.nextUrl.searchParams.has("to")) {
    const guestSlug = request.nextUrl.searchParams.get("to");
    if (guestSlug) {
      const url = request.nextUrl.clone();
      url.pathname = `/w/${weddingMatch[1]}/${guestSlug}`;
      url.searchParams.delete("to");
      const event = request.nextUrl.searchParams.get("event");
      if (event) url.searchParams.set("event", event);
      return NextResponse.redirect(url, 301);
    }
  }

  if (pathname === "/admin" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/projects";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/", "/admin/:path*", "/w/:path*"],
};
