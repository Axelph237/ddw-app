import fetchWithAuth from "@/scripts/fetchWithAuth.ts";

const GAMEPLAY_URL = process.env.NEXT_PUBLIC_API_URL + '/gameplay/'

/**
 * Gets the user's current game balance
 *
 * @param gameId - the game to check
 */
export async function getBalance(gameId: number) { 'use server'
    try {
        const response = await fetchWithAuth(GAMEPLAY_URL + `balance/${gameId}`, {
            method: 'GET',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Gets the currently active round
 *
 * @param gameId - the game to check
 */
export async function getCurrentRound(gameId: number) { 'use server'
    try {
        const response = await fetchWithAuth(GAMEPLAY_URL + `get_round/${gameId}`, {
            method: 'GET',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Gets the currently active match
 *
 * @param roundId - the round to check
 */
export async function getCurrentMatch(roundId: number) { 'use server'
    try {
        const response = await fetchWithAuth(GAMEPLAY_URL + `active_match/${roundId}`, {
            method: 'GET',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Gets the entrants in the match
 *
 * @param matchId - the match to check
 */
export async function getMatchEntrants(matchId: number) { 'use server'
    try {
        const response = await fetchWithAuth(GAMEPLAY_URL + `active_match_entrants/${matchId}`, {
            method: 'GET',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

interface Bet {
    matchId: number,
    entrantId: number,
    amount: number
}

/**
 * Places a bet on the entrant
 *
 * @param betPlacementId - an id to track if bet was placed
 * @param bet - the matchId, entrantId, and amount to bet
 */
export async function placeBet(betPlacementId: number, bet: Bet) { 'use server'
    try {
        const response = await fetchWithAuth(GAMEPLAY_URL + `bet/${betPlacementId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                match_id: bet.matchId,
                entrant_id: bet.entrantId,
                bet_amount: bet.amount
            }),
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}