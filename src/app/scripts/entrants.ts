'use server'

const ENTRANTS_URL = process.env.NEXT_PUBLIC_API_URL + '/entrants'

export interface Entrant {
    name: string,
    weapon: string,
    id?: number,
    imgUrl?: string,
}

// Creates entrant under user's account
export async function createEntrant(entrant: Entrant) {
    try {
        const response = await fetch(ENTRANTS_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entrant),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        return json
    }
    catch (error) {
        console.log(error)
    }
}

export async function getEntrant(entrantId: number) {

    try {
        const response = await fetch(ENTRANTS_URL + `/${entrantId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        return json
    }
    catch (error) {
        console.log(error)
    }
}