import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname (e.g. himanshu.designly.co.in or localhost:3000)
  const hostname = req.headers.get("host") || "designly.co.in";

  // Define allowed domains (main app)
  const allowedDomains = ["designly.co.in", "www.designly.co.in", "localhost:3000", "designly-five.vercel.app"];
  
  const subdomain = hostname.split(".")[0].toLowerCase();

  // If we are on the main domain or it's an IP address, do nothing
  const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname.split(':')[0]);
  if (allowedDomains.includes(hostname) || subdomain === "www" || isIP) {
    return NextResponse.next();
  }

  // If we have a subdomain that isn't the main domain, rewrite to /[domain] route
  // e.g. himanshu.designly.co.in/rest-of-path -> designly.co.in/himanshu/rest-of-path
  console.log(`Rewriting ${hostname} to /${subdomain}${url.pathname}`);
  
  return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
}
