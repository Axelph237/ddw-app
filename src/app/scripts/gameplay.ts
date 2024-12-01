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
 * Gets the currently active round
 *
 * @param gameId - the game to check
 */
export async function getCurrentRound(gameId: number) {
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
export async function getCurrentMatch(roundId: number) {
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
export async function getMatchEntrants(matchId: number) {
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
export async function placeBet(betPlacementId: number, bet: Bet) {
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
 * Gets the winner and loser of a match
 *
 * @param matchId - the match to search
 */
export async function getMatchResults(matchId: number) {
    try {
        const response = await fetchWithAuth(GAMEPLAY_URL + `${matchId}/results`, {
            method: 'GET',
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