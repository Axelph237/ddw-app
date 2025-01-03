'use server'

import fetchWithAuth from "@/scripts/fetchWithAuth.ts";

const GAMEPLAY_URL = process.env.NEXT_PUBLIC_API_URL + '/gameplay/'

/**
 * Gets the user's current game balance
 *
 * @param gameId - the game to check
 */
export async function getBalance(gameId: number) {
    try {
        const response = await fetchWithAuth(GAMEPLAY_URL + `balance/${gameId}`, {
            method: 'GET',
        });

        console.log(response)

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Gets the data for a given match.
 *
 * @param matchId - the match to check
 */
export async function getMatchData(matchId: number) {
    try {
        const response = await fetchWithAuth(GAMEPLAY_URL + `${matchId}`, {
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
export async function placeBet(betPlacementId: number, bet: Bet) {
    try {
        console.log('placing bet')
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

/**
 * Continues the game's state
 *
 * @param gameId - the game to continue
 */
export async function continueGame(gameId: number) {
    try {
        const response = await fetchWithAuth(GAMEPLAY_URL + `${gameId}/continue`, {
            method: 'POST',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Gets the number of users who have bet in a match, and total users in the match
 *
 * @param matchId - the match to search
 */
export async function getBetInfo(matchId: number) {
    try {
        const response = await fetchWithAuth(GAMEPLAY_URL + `${matchId}/bet_info`, {
            method: 'GET',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Ends the game, sending all its matches and rounds to completed
 *
 * @param gameId - the game to end
 */
export async function endGame(gameId: number) {
    try {
        const response = await fetchWithAuth(GAMEPLAY_URL + `kill/${gameId}`, {
            method: 'POST',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}