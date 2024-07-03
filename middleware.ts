import { auth } from "@/auth"

 
export default auth((req) => {
    if (
        !req.auth &&
        req.nextUrl.pathname !== "/" &&
        req.nextUrl.pathname !== "/auth/sign-in" &&
        req.nextUrl.pathname !== "/auth/sign-up"
    ) {
        const newUrl = new URL("/auth/sign-in", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
})

export const config = {
    matcher: ["/((?!.*\\..*|_next|api|auth/sign-in|auth/sign-up|trpc).*)"]
}

// const matcher =  ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']

