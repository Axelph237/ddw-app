import fetchWithAuth from "@/scripts/fetchWithAuth.ts";

const GAMES_URL = process.env.NEXT_PUBLIC_API_URL + '/games/'

/**
 * Starts the current game if it is in lobby and the calling user is the admin
 *
 * @param gameId - the game to start
 */
export async function startGame(gameId: number) { 'use server'
    try {
        const response = await fetchWithAuth(GAMES_URL + `${gameId}/start`, {
            method: 'POST',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Joins the current game
 */
export async function joinGame() {
    try {
        const response = await fetchWithAuth(GAMES_URL + 'join', {
            method: 'POST',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Leaves the game.
 *
 * @param gameId - the game to leave
 */
export async function leaveGame(gameId: number) {
    try {
        const response = await fetchWithAuth(GAMES_URL + `${gameId}/leave`, {
            method: 'POST',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Gets all players in the lobby.
 *
 * @param gameId - the game to search
 */
export async function getLobbyPlayers(gameId: number) {
    try {
        const response = await fetchWithAuth(GAMES_URL + `${gameId}/lobby`, {
            method: 'GET',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Gets the currently running game
 */
export async function getCurrentGame() {
    try {
        const response = await fetchWithAuth(GAMES_URL + 'current', {
            method: 'GET',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Gets if the user is in the current game, and if they are the admin of it.
 */
export async function getUserStatus() {
    try {
        const response = await fetchWithAuth(GAMES_URL + 'user_status', {
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
        const response = await fetchWithAuth(GAMES_URL + `kill/${gameId}`, {
            method: 'POST',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}