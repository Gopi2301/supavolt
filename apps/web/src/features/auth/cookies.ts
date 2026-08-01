import { COOKIE_KEYS } from '@supavolt/constants'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'

type ParsedCookie = {
    name: string;
    value: string;
    options: {
        path: string;
        maxAge?: number;
        httpOnly: boolean;
        secure: boolean;
        sameSite: 'lax' | 'strict' | 'none'
    }
};
export function parsedSetCookieHeader(cookieHeader: string): ParsedCookie {
    const parts = cookieHeader.split(';').map(part => part.trim());
    const [nameValue, ...attributes] = parts;
    const seperatorIndex = nameValue.indexOf('=');
    const name = seperatorIndex > -1 ? nameValue.slice(0, seperatorIndex) : nameValue;
    const value = seperatorIndex > -1 ? nameValue.slice(seperatorIndex + 1) : '';
    const options: ParsedCookie['options'] = {
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'lax'
    };
    for (const attribute of attributes) {
        const seperator = attribute.indexOf('=');
        const key = (seperator === -1 ? attribute : attribute.slice(0, seperator)).toLowerCase();
        const val = seperator > -1 ? attribute.slice(seperator + 1) : undefined;
        switch (key) {
            case 'path':
                if (val !== undefined) {
                    options.path = val;
                }
                break;
            case 'max-age':
                if (val !== undefined) {
                    options.maxAge = parseInt(val, 10);
                }
                break;
            case 'httponly':
                options.httpOnly = true;
                break;
            case 'secure':
                options.secure = true;
                break;
            case 'samesite':
                if (val) {
                    const lower = val.toLowerCase();
                    if (lower === 'lax' || lower === 'strict' || lower === 'none') {
                        options.sameSite = lower;
                    }
                }
                break;
        }
    }
    return { name, value, options }
}

function isAuthCookie(name: string) {
    return name === COOKIE_KEYS.ACCESS_TOKEN || name === COOKIE_KEYS.REFRESH_TOKEN
}

export async function applyAuthCookiesFromResponse(response: Response) {
    const cookieStore = await cookies();
    for (const header of response.headers.getSetCookie()) {
        const parsed = parsedSetCookieHeader(header);
        if (!isAuthCookie(parsed.name)) continue;
        cookieStore.set(parsed.name, parsed.value, parsed.options);
    }
}

export function applyAuthCookiesToResponse(
    response: NextResponse,
    setCookieHeaders: string[]
) {
    for (const header of setCookieHeaders) {
        const parsed = parsedSetCookieHeader(header);
        if (!isAuthCookie(parsed.name)) continue;
        response.cookies.set(parsed.name, parsed.value, parsed.options);
    }
}