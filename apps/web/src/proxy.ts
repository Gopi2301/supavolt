import { NextRequest, NextResponse } from "next/server";
import { COOKIE_KEYS } from '@supavolt/constants';
import * as jose from "jose";
import { applyAuthCookiesToResponse } from "./features/auth/cookies";

const AUTH_ROUTES = ['/login', '/register'];

async function refreshSession(
    refreshToken: string,
    response: NextResponse,
): Promise<boolean> {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) return false;
    const refreshRes = await fetch(`${apiUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
            Cookie: `${COOKIE_KEYS.REFRESH_TOKEN}=${refreshToken}`
        }
    });
    if (!refreshRes) return false;

    applyAuthCookiesToResponse(response, refreshRes.headers.getSetCookie());
    return true;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
    const refreshToken = request.cookies.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;

    const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
    const isProtected = (pathname.startsWith('/organizations') || pathname.startsWith('/')) && !isAuthRoute;

    let isValid = false;
    if (accessToken && process.env.JWT_ACCESS_SECRET) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
            await jose.jwtVerify(accessToken, secret);
            isValid = true
        } catch {
            // 
        }
    }
    if (isAuthRoute && isValid) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (isAuthRoute && refreshToken) {
        const response = NextResponse.redirect(new URL('/dashboard', request.url));
        if (await refreshSession(refreshToken, response)) {
            return response;
        }
    }
    if (isProtected && !isValid) {
        const response = NextResponse.next();
        if (refreshToken && await refreshSession(refreshToken, response)) {
            return response;
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
