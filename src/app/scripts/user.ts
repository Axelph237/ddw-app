const USERS_URL = process.env.NEXT_PUBLIC_API_URL + '/users'

export let SESSION_INFO: JSON | undefined = undefined

// Registers the user, responding with a success message and uuid
export async function register(username: string, email: string, password: string) {
    try {
        const response = await fetch(USERS_URL + '/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"  // Tells the server to expect JSON
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    }
    catch (error) {
        console.log(error)
    }
}

// Logs user in, returning their session token and uuid
export async function login(email: string, password: string) {
    try {
        const response = await fetch(USERS_URL + '/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"  // Tells the server to expect JSON
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        SESSION_INFO = json;
        return json
    }
    catch (error) {
        console.log(error)
    }
}