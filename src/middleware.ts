import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

        if (isAuthPage) {
            if (isAuth) {
                if (token?.role === "ADMIN") {
                    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
                } else {
                    return NextResponse.redirect(new URL("/student/tasks", req.url));
                }
            }
            return null;
        }

        if (!isAuth) {
            return NextResponse.redirect(new URL("/auth/signin", req.url));
        }

        if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/student/tasks", req.url));
        }

        if (req.nextUrl.pathname.startsWith("/student") && token?.role !== "STUDENT") {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/student/:path*", "/auth/:path*"],
};
