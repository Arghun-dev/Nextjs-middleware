This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Middleware

### Intro

1. Middleware allows you to run code before a request is completed.
2. You can then:
   - Rewrite
   - Redirect
   - Modifying the headers
   - Or respond directly
3. Middleware runs before cached content and routes are matched
4. It can be useful for things like:
   - Authentication
   - Redirect and Rewrite based on the user geolocation
   - Add or modify request/response headers
   - Read, write and manage cookies
   - Render and return a page or component
   - Respond with some JSON, like an API endpoint
   - Enforce a block or IP allow-list
   - A/B testing with different content

### Convention

Use the file middleware.ts in the root of your project to define Middleware.

```js
// ./middleware.ts

import { NextResponse } from "next/server";

export function middleware(request) {
  return NextResponse.redirect(new URL("/home", request.url));
}

export const config = {
  matcher: "/about/:path",
};
```

### Matching path

1. Middleware will be invoked for every route in your project.
2. There are two ways to limit which paths Middleware will run on:
   - Custom matcher config
   - Conditional statements

### Matcher

`matcher` allows you to filter Middleware to run on specific paths.

```js
export const config = {
  matcher: "/about/:path",
};
```

You can match a single path or multiple paths with an array syntax:

```js
export const config = {
  matcher: ["/about/:path", "/dashboard/:path"],
};
```

The `matcher` config allows full regex so matching like negative lookaheads:

```js
// Match all except `api`, `_next/static`, `_next/image`, `favicon.ico`

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

> Good to know: The `matcher` values need to be constants so they can be statically analyzed at build time. Dynamic values such as variables will be ignored.

### Configurations

1. MUST start with `/`
2. Can include named parameters
   a. `/about/:path`
   i. matches `/about/a`
   ii. and `/about/b`
   iii. but not `/about/a/c`
3. Can have modifiers on named parameters
   a. `/about/:path*`
   i. matches `/about/a/b/c`
   ii. `*` is zero or more
   iii. `?` is zero or one
   iv. `+` is one or more
4. Can use regular expression enclosed in parethesis:
   a. `/about/(.*)` is the same as `/about/:path*`

### Conditional statements

You can also use conditional statements instead of matchers

```js
import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/about")) {
    return NextResponse.rewrite(new URL("/about-2", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.rewrite(new URL("/dashboard/user", request.url));
  }
}
```

### Using Cookies

NextJs provides a convenient way to access cookies through the `cookies` extension on `NextRequest` and `NextResponse`

1. For incoming requests, `cookies` comes with the following methods:
   a. `get`
   b. `getAll`
   c. `set`
   d. `delete`
   e. `has`
   f. `clear`

2. For outgoing responses, `cookies` have the following methods:
   a. `get`
   b. `getAll`
   c. `set`
   d. `delete`

```js
import { NextResponse } from "next/server";

export function middleware(request) {
  const cookie = request.cookies.get("nextjs");
  // { name: 'nextjs', value: 'fast', path: '/' }
  const allCookies = request.cookies.getAll();
  // [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has("nextjs"); // => true
  request.cookies.delete("nextjs");

  // setting cookies on the response
  const response = NextResponse.next();
  response.cookies.set("vercel", "fast");
  response.cookies.set({
    name: "vercel",
    value: "fast",
    path: "/",
  });

  return response;
}
```

### Setting Headers

You can set request and response headers using `NextResponse` API.

```js
import { NextResponse } from "next/server";

export function middleware(request) {
  // clone the request headers and set a new header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-hello-from-middleware", "hello");

  // set request headers in NextResponse.rewrite
  const response = NextResponse.next({
    request: {
      // new request headers
      headers: requestHeaders,
    },
  });

  // set a new response header
  response.headers.set("x-hello-from-middleware2", "hello");
  return response;
}
```
