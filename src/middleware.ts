import { NextResponse, type NextRequest } from "next/server";

/* No session and heading into the app? Start a guest workspace instead of
   bouncing people through a login wall — using the widgets never requires
   an email. */
export function middleware(req: NextRequest) {
  if (req.cookies.get("plk_session")) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/api/auth/guest";
  url.search = "";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
