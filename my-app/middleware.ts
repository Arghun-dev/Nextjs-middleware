import { NextResponse, NextRequest } from "next/server";

// You can see from your middleware you can return pages, you can rewrite, redirect, you can even respond with a json, you can access the cookies you can modify the cookies or headers and more.

export function middleware(request: NextRequest) {
  // parse nextUrl object
  //   const { pathname, searchParams } = request.nextUrl;
  //   console.log({ pathname, sort: searchParams.get("sort") });
  //   return NextResponse.next();
  // redirecting
  //   return NextResponse.redirect(new URL("/team", request.url));
  // reading request cookies
  //   const allCookies = request.cookies.getAll();
  // setting response cookies
  //   const response = NextResponse.next();
  //   response.cookies.set({
  //     name: "next",
  //     value: "fast",
  //     path: "/",
  //   });
  //   return response;
  // responding with json
  return NextResponse.json({ message: "Hello from middleware" });
}

export const config = {
  matcher: "/about",
};
