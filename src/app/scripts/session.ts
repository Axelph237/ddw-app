'use server'

import { encrypt, decrypt } from 'crypto-js/aes';
import { enc } from 'crypto-js';
import { cookies } from 'next/headers';

// This should probably be stored in a more secure location
// maybe as an env var inside render?
const SECRET_KEY = 'my-secret-key';

export interface Session {
    accessToken: string,
    tokenType: string,
    userId: string
}

let currentSession: Session | undefined;

export async function setSession(session: Session): Promise<string> {
    currentSession = session;
    
    // Also store in encrypted cookie for persistence
    const encryptedSession = encrypt(JSON.stringify(session), SECRET_KEY).toString();
    (await cookies()).set('session', encryptedSession, {
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
        secure: true,
        sameSite: 'strict'
    });
    
    return 'Session successfully set';
}

export async function getSession(): Promise<Session | undefined> {
    // First try memory
    if (currentSession) {
        return currentSession;
    }
    
    // Then try cookie
    const sessionCookie = (await cookies()).get('session');
    if (sessionCookie) {
        try {
            const bytes = decrypt(sessionCookie.value, SECRET_KEY);
            const decrypted = bytes.toString(enc.Utf8);
            currentSession = JSON.parse(decrypted);
            return currentSession;
        } catch (e) {
            return undefined;
        }
    }
    
    return undefined;
}

export async function clearSession(): Promise<void> {
    currentSession = undefined;
    (await cookies()).delete('session');
}