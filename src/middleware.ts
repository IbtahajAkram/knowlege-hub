// import { NextResponse } from "next/server";

// export default function middleware(request) {
// const authHeader = request.headers.get("token");
// const token = authHeader?.split(" ")[1];
//   const url = request.nextUrl;

//   const isProtected = ["/courses"];

//   const matchProtectedRoute = isProtected.some((route) =>
//     url.pathname.startsWith(route)
//   );

//   if (matchProtectedRoute && !token) {
//     // return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }




// // middleware.ts
// // import { NextResponse } from "next/server";
// // import type { NextRequest } from "next/server";

// // export function middleware(request: NextRequest) {
// //   const token = request.cookies.get("token")?.value; // JWT from cookies
// //   const url = request.nextUrl;

// //   // List of protected routes
// //   const protectedRoutes = ["/dashboard", "/profile", "/courses"];

// //   // Match if path starts with any protected route
// //   const isProtected = protectedRoutes.some((route) =>
// //     url.pathname.startsWith(route)
// //   );

// //   if (isProtected && !token) {
// //     return NextResponse.redirect(new URL("/login", request.url));
// //   }

// //   return NextResponse.next(); // Continue if authenticated or not protected
// // }


// middleware.ts
// middleware.ts ya middleware.js
// src/middleware.js
// src/middleware.ts
// src/middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};