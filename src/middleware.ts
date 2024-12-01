import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { encrypt, decrypt } from 'crypto-js/aes';
import { enc } from 'crypto-js';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';
const publicPages = ['/', '/login', '/signup'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if it's a public page
    if (publicPages.includes(pathname)) {
        return NextResponse.next();
    }

    // Get session from cookie
    const sessionCookie = request.cookies.get('session');
    let session;
    
    if (sessionCookie) {
        try {
            const bytes = decrypt(sessionCookie.value, SECRET_KEY);
            const decrypted = bytes.toString(enc.Utf8);
            session = JSON.parse(decrypted);
        } catch (e) {
            session = null;
        }
    }

    // If no valid session and not on a public page, redirect to login
    if (!session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Add auth header to all API requests
    // if (pathname.startsWith('/api/')) {
    //     const requestHeaders = new Headers(request.headers);
    //     requestHeaders.set('Authorization', `Bearer ${session.accessToken}`);
    //
    //     return NextResponse.next({
    //         request: {
    //             headers: requestHeaders,
    //         },
    //     });
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|favicon.ico).*)'],
};