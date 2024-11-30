'use server'

import fetchWithAuth from "@/scripts/fetchWithAuth.ts";

const ENTRANTS_URL = process.env.NEXT_PUBLIC_API_URL + '/entrants/'

export interface Entrant {
    name: string,
    weapon: string,
    id?: number,
    imgUrl?: string,
}

// Creates entrant under user's account
export async function createEntrant(entrant: Entrant) {
    console.log('Running:', ENTRANTS_URL)
    console.log('Entrant data:', entrant)

    try {
        const response = await fetchWithAuth(ENTRANTS_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entrant),
        });

        return response
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