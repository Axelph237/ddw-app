'use server'

import fetchWithAuth from "@/scripts/fetchWithAuth.ts";

const ENTRANTS_URL = process.env.NEXT_PUBLIC_API_URL + '/entrants/'

export interface Entrant {
    name: string,
    weapon: string,
    id?: number,
    img_url?: string,
    total_bets?: number,
    max_bet?: number,
    matches_won?: number,
    leaderboard_pos?: number
}

// Creates entrant under user's account
export async function createEntrant(entrant: Entrant) {
    try {
        const response = await fetchWithAuth(ENTRANTS_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entrant),
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

export async function getEntrant(entrantId: number) {

    try {
        const response = await fetch(ENTRANTS_URL + `${entrantId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Gets if user created entrant this game.
 *
 * @param gameId - Game to check.
 */
export async function getUserEntrant(gameId: number) {

    try {
        const response = await fetchWithAuth(ENTRANTS_URL + `user/${gameId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}