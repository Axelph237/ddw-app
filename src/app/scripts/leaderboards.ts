const LEADERBOARDS_URL = process.env.NEXT_PUBLIC_API_URL + '/leaderboards/'

/**
 * Gets the entrants leaderboard.
 */
export async function getEntrantsLeaderboard(gameId: number) {
    try {
        const response = await fetch(LEADERBOARDS_URL + `entrants/${gameId}`, {
            method: 'GET',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Gets the user leaderboard.
 */
export async function getUsersLeaderboard(gameId: number) {
    try {
        const response = await fetch(LEADERBOARDS_URL + `users/${gameId}`, {
            method: 'GET',
        });

        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}