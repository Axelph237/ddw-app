'use server'

import {getSession} from "@/scripts/session.ts";

/**
 * Adds access token to url.
 *
 * @param url - the url to fetch
 * @param init - the RequestInit object containing fetch options
 */
export default async function fetchWithAuth(
    url: string | URL | globalThis.Request,
    init?: RequestInit
) {
    const session = await getSession()

    if (!session) {
        throw Error('No authenticated session found.')
    }

    if (init)  {
        init.headers = {
            ...init.headers,
            Authorization: `Bearer ${session.accessToken}`
        }
    }

    return fetch(url, init)
}
