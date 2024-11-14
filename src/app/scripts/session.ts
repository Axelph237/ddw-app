'use server'

interface Session {
    accessToken: string,
    tokenType: string,
    userId: string
}

let currentSession: Session | undefined

export async function setSession(session: Session): Promise<string> {
    currentSession = session

    return 'Session successfully set'
}

export async function getSession(): Promise<Session | undefined> {
    return currentSession
}