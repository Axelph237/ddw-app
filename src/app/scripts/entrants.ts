const ENTRANTS_URL = process.env.NEXT_PUBLIC_API_URL + '/entrants/'

// Creates entrant under user's account
export async function createEntrant(entrant:{name: string, weapon: string}) {
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